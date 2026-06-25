import {
  Mail,
  Camera,
  Pencil,
} from "lucide-react";

export default function ProfileBanner() {
  return (
    <div className="profile-banner">

      <div className="profile-cover" />

      <div className="profile-banner-content">

        <div className="profile-left">

          <div className="profile-avatar">

            <div className="avatar-text">
              KJ
            </div>

            <button className="camera-btn">
              <Camera size={16} />
            </button>

          </div>

          <div className="profile-details">

            <h2>Khushi Jain</h2>

            <div className="profile-meta">

              <span className="member-badge">
                Member
              </span>

              <span className="email">
                <Mail size={15} />
                kj5369227@gmail.com
              </span>

            </div>

          </div>

        </div>

        <button className="edit-profile-btn">

          <Pencil size={18} />

          Edit Profile

        </button>

      </div>

    </div>
  );
}