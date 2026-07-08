const GRAPH_API_VERSION = "v20.0";

const getConfig = () => {
  const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error(
      "WhatsApp sending is not configured. Set META_WHATSAPP_ACCESS_TOKEN and META_WHATSAPP_PHONE_NUMBER_ID in backend/.env."
    );
  }

  return { accessToken, phoneNumberId };
};

const toE164Digits = (phone) => phone.replace(/[^\d]/g, "");

const sendWhatsAppMessage = async (toPhone, body) => {
  const { accessToken, phoneNumberId } = getConfig();

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toE164Digits(toPhone),
        type: "text",
        text: { body },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const message = data?.error?.message || "Failed to send WhatsApp message";
    throw new Error(message);
  }

  return data;
};

module.exports = {
  sendWhatsAppMessage,
};
