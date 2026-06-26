import {
  Mail,
  Camera,
  Pencil,
  Save,
} from "lucide-react";

export default function ProfileBanner({
  user,
  isEditing,
  setIsEditing,
  handleSave,
}) {

  if (!user) return null;

  const initials =
    user.username
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  const handleButtonClick = () => {

    if (isEditing) {

      handleSave();

    } else {

      setIsEditing(true);

    }

  };

  return (
    <div className="profile-banner">

      <div className="profile-cover" />

      <div className="profile-banner-content">

        <div className="profile-left">

          <div className="profile-avatar">

            {user.profilePic ? (

              <img
                src={user.profilePic}
                alt="Profile"
                className="avatar-image"
              />

            ) : (

              <div className="avatar-text">
                {initials}
              </div>

            )}

            <button
              className="camera-btn"
              disabled={!isEditing}
            >
              <Camera size={16} />
            </button>

          </div>

          <div className="profile-details">

            <h2>
              {user.username || "Student"}
            </h2>

            <div className="profile-meta">

              <span className="member-badge">
                {user.role || "Student"}
              </span>

              <span className="email">

                <Mail size={15} />

                {user.email}

              </span>

            </div>

          </div>

        </div>

        <button
          className="edit-profile-btn"
          onClick={handleButtonClick}
        >

          {isEditing ? (
            <>
              <Save size={18} />
              Save Profile
            </>
          ) : (
            <>
              <Pencil size={18} />
              Edit Profile
            </>
          )}

        </button>

      </div>

    </div>
  );
}