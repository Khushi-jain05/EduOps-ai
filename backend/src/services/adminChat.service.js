const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");

const getUserId = (user) => user?.id || user?.userId || user?.sub;

const STATUSES = ["new", "contacted", "hot", "enrolled", "lost"];

const buildLeadContext = async () => {
  const [counts, hotLeads] = await Promise.all([
    Promise.all(
      STATUSES.map((status) => prisma.lead.count({ where: { status } }))
    ),
    prisma.lead.findMany({
      where: { score: { gte: 80 } },
      orderBy: { score: "desc" },
      take: 5,
      select: { name: true, course: true, city: true, status: true, score: true },
    }),
  ]);

  const statusSummary = STATUSES.map((status, i) => `${status}: ${counts[i]}`).join(", ");

  const hotSummary =
    hotLeads.length > 0
      ? hotLeads
          .map((l) => `- ${l.name} (${l.course || "no course"}, ${l.city || "unknown city"}) — status ${l.status}, score ${l.score}`)
          .join("\n")
      : "None currently.";

  return `Lead counts by status: ${statusSummary}.\n\nTop hot/urgent leads (score >= 80):\n${hotSummary}`;
};

const getChats = async (user) => {
  const userId = getUserId(user);

  return prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const getChatMessages = async (id, user) => {
  const userId = getUserId(user);

  const chat = await prisma.chat.findFirst({
    where: { id, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  return chat;
};

const sendMessage = async (chatId, message, user) => {
  const userId = getUserId(user);

  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const leadContext = await buildLeadContext();

  const prompt = `You are the Admission Assist AI — a co-pilot for the college's lead-management/counseling team. You have live access to the lead pipeline described below. Answer the counselor's question helpfully and concisely, referencing specific leads/numbers when relevant.

${leadContext}

Counselor question:
${message}

Answer:`;

  const aiReply = await askGemini(prompt);

  let chat = null;

  if (chatId && chatId !== "new") {
    chat = await prisma.chat.findFirst({ where: { id: chatId, userId } });
  }

  if (!chat) {
    chat = await prisma.chat.create({
      data: { userId, title: message.trim().slice(0, 30) },
    });
  }

  await prisma.message.createMany({
    data: [
      { chatId: chat.id, role: "user", content: message },
      { chatId: chat.id, role: "assistant", content: aiReply },
    ],
  });

  return {
    chatId: chat.id,
    assistant: { role: "assistant", content: aiReply },
  };
};

module.exports = {
  getChats,
  getChatMessages,
  sendMessage,
};
