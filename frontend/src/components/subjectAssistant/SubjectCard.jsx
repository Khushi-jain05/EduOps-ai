import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Code2,
  Atom,
  FlaskConical,
  Globe2,
  Languages,
} from "lucide-react";
const iconMap = {
  calculator: Calculator,
  code: Code2,
  atom: Atom,
  flask: FlaskConical,
  globe: Globe2,
  language: Languages,
};

export default function SubjectCard({
  subject,
}) {
  const navigate = useNavigate();
  const Icon = iconMap[subject.icon];
  console.log(subject);
console.log(subject.icon);
console.log(iconMap[subject.icon]);
  return (
      
    <div
      className={`subject-card ${subject.color}`}
    >
      <div className="card-top">

        <div className="subject-icon">

  {Icon && <Icon size={28} strokeWidth={2.2}/>}

</div>


        {/* <span className="card-arrow">
          →
        </span> */}

      </div>

      <span className="subject-code">
        {subject.code}
      </span>

      <h3>{subject.name}</h3>

      <p className="faculty-name">
        {subject.faculty}
      </p>

      <div className="subject-footer">
        <span>
          {subject.topics} topics
        </span>

        <span>
          {subject.progress}%
        </span>
      </div>

      <div className="progress-bar">
        <div
          className={`progress-fill ${subject.color}`}
          style={{
            width: `${subject.progress}%`,
          }}
        />
      </div>

      <button className="ai-link" onClick={() => navigate("/support-ai")}>
         <Sparkles className="ai-icon" />
         Ask the AI tutor
      </button>
      
    </div>
  );

}