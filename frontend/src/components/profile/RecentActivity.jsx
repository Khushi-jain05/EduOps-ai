import {
  FileText,
} from "lucide-react";

export default function RecentActivity({
  activity = [],
}) {

  return (

    <div className="activity-card">

      <div className="card-header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity-list">

        {activity.length === 0 ? (

          <p>No Activity Yet</p>

        ) : (

          activity.map((item) => (

            <div
              key={item.id}
              className="activity-item"
            >

              <div className="activity-icon blue">
                <FileText size={18}/>
              </div>

              <div className="activity-content">

                <h4>{item.title}</h4>

                <p>{item.description}</p>

                <span>{item.time}</span>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}