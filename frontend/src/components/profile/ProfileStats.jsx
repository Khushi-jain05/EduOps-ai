import {
  BookOpen,
  Award,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";

export default function ProfileStats({ stats }) {

  const data = [
    {
      title: "Assignments",
      value: stats?.assignments ?? 0,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Subjects",
      value: stats?.subjects ?? 0,
      icon: Award,
      color: "green",
    },
    {
      title: "Attendance",
      value: `${stats?.attendance ?? 0}%`,
      icon: BadgeCheck,
      color: "purple",
    },
    {
      title: "Exams",
      value: stats?.exams ?? 0,
      icon: CalendarDays,
      color: "orange",
    },
  ];

  return (

    <div className="profile-stats">

      {data.map((stat, index) => {

        const Icon = stat.icon;

        return (

          <div
            key={index}
            className="stat-card"
          >

            <div className="stat-top">

              <p>{stat.title}</p>

              <div
                className={`stat-icon ${stat.color}`}
              >
                <Icon size={20}/>
              </div>

            </div>

            <h2>{stat.value}</h2>

          </div>

        );

      })}

    </div>

  );

}