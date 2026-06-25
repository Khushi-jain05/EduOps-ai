import {
  BookOpen,
  FileText,
  Brain,
  CheckCircle,
  Calendar,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Assignment Submitted",
    description: "Uploaded DBMS Assignment 4",
    time: "2 hours ago",
    icon: FileText,
    color: "blue",
  },
  
  {
    id: 3,
    title: "Attendance Updated",
    description: "Operating Systems lecture",
    time: "Yesterday",
    icon: CheckCircle,
    color: "green",
  },
  {
    id: 4,
    title: "Exam Scheduled",
    description: "Data Structures Mid Semester",
    time: "3 days ago",
    icon: Calendar,
    color: "orange",
  },
 
];

export default function RecentActivity() {
  return (
    <div className="activity-card">

      <div className="card-header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity-list">

        {activities.map((activity) => {

          const Icon = activity.icon;

          return (

            <div
              key={activity.id}
              className="activity-item"
            >

              <div
                className={`activity-icon ${activity.color}`}
              >
                <Icon size={18} />
              </div>

              <div className="activity-content">

                <h4>{activity.title}</h4>

                <p>{activity.description}</p>

                <span>{activity.time}</span>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}