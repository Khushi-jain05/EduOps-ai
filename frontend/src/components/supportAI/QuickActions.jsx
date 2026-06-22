import {
  Calculator,
  FlaskConical,
  BookOpen,
  Languages,
} from "lucide-react";

export default function QuickActions({ setInput }) {

  const actions = [
    {
      icon: <Calculator size={22} />,
      title: "Solve a math problem",
      subtitle: "Step-by-step explanation",
      prompt:
        "Solve this problem step by step",
    },
    {
      icon: <FlaskConical size={22} />,
      title: "Explain a concept",
      subtitle:
        "Physics, Chemistry, Biology",
      prompt:
        "Explain this concept simply",
    },
    {
      icon: <BookOpen size={22} />,
      title: "Summarise a chapter",
      subtitle:
        "Get crisp revision notes",
      prompt:
        "Summarise this chapter",
    },
    {
      icon: <Languages size={22} />,
      title: "Translate or rewrite",
      subtitle:
        "Across 30+ languages",
      prompt:
        "Rewrite this text",
    },
  ];

  return (
    <div className="quick-grid">

      {actions.map((item) => (
        <div
          key={item.title}
          className="quick-card"
          onClick={() =>
            setInput(item.prompt)
          }
        >
          <div className="quick-icon">
            {item.icon}
          </div>

          <h4>{item.title}</h4>

          <p>{item.subtitle}</p>
        </div>
      ))}

    </div>
  );
}