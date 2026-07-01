import LessonCard from "./LessonCard";
import NewLessonCard from "./NewLessonCard";

export default function LessonGrid({
  plans,
  onNewClick,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill,minmax(390px,1fr))",
        gap: "28px",
        marginTop: "35px",
        paddingBottom: "40px",
      }}
    >
      {plans.length > 0 ? (
        plans.map((plan) => (
          <LessonCard
            key={plan.id}
            plan={{
              id: plan.id,

              subject:
                plan.Subject?.name ||
                "Unknown Subject",

              code:
                plan.Subject?.code ||
                "CS301",

              week:
                plan.week ||
                "Week 1",

              title:
                plan.title,

              topic:
                plan.topic,

              sessions:
                plan.sessions ||
                1,

              duration:
                plan.duration ||
                "60 mins",

              date:
                plan.lesson_date,

              status:
                plan.status ||
                "draft",
            }}
          />
        ))
      ) : (
        <div
          style={{
            gridColumn: "1/-1",
            textAlign: "center",
            padding: "80px",
            background: "#fff",
            borderRadius: "24px",
            color: "#64748B",
            fontSize: "22px",
            fontWeight: 500,
          }}
        >
          No Lesson Plans Found
        </div>
      )}

      <NewLessonCard
        onClick={onNewClick}
      />
    </div>
  );
}