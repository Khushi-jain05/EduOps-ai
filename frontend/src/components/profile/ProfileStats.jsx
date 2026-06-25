import {
  BookOpen,
  Award,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Assignments",
    value: "24",
    icon: BookOpen,
    color: "blue",
  },
  {
    id: 2,
    title: "Avg. Grade",
    value: "A",
    icon: Award,
    color: "green",
  },
  {
    id: 3,
    title: "Attendance",
    value: "92%",
    icon: BadgeCheck,
    color: "purple",
  },
  {
    id: 4,
    title: "Streak",
    value: "18d",
    icon: CalendarDays,
    color: "orange",
  },
];

export default function ProfileStats() {
  return (
    <div className="profile-stats">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="stat-card"
          >

            <div className="stat-top">

              <p>{stat.title}</p>

              <div className={`stat-icon ${stat.color}`}>
                <Icon size={20} />
              </div>

            </div>

            <h2>{stat.value}</h2>

          </div>
        );
      })}

    </div>
  );
}