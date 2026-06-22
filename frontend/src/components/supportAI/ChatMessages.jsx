import MessageBubble from "./MessageBubble";

export default function ChatMessages({
  messages,
}) {
  return (
    <div className="chat-messages">

      {messages.map(
        (message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
          />
        )
      )}

    </div>
  );
}