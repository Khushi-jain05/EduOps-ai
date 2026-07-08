const twilio = require("twilio");

const getClient = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !authToken) {
    throw new Error(
      "WhatsApp sending is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in backend/.env."
    );
  }

  return twilio(sid, authToken);
};

const getFromAddress = () => {
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!from) {
    throw new Error(
      "WhatsApp sending is not configured. Set TWILIO_WHATSAPP_FROM in backend/.env (e.g. whatsapp:+14155238886)."
    );
  }

  return from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
};

const toWhatsAppAddress = (phone) =>
  phone.startsWith("whatsapp:") ? phone : `whatsapp:${phone}`;

const sendWhatsAppMessage = async (toPhone, body) => {
  const client = getClient();
  const from = getFromAddress();

  return client.messages.create({
    from,
    to: toWhatsAppAddress(toPhone),
    body,
  });
};

module.exports = {
  sendWhatsAppMessage,
};
