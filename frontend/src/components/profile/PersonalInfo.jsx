import ProfileField from "./ProfileField";

export default function PersonalInfo({
  user,
  isEditing,
  handleChange,
}) {

  if (!user) return null;

  return (

    <div className="personal-card">

      <div className="card-header">
        <h2>Personal Information</h2>
      </div>

      <div className="info-grid">

        <ProfileField
          label="Full Name"
          name="username"
          value={user.username || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="Email"
          name="email"
          value={user.email || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="Phone"
          name="phone"
          value={user.phone || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="Date of Birth"
          name="dob"
          value={user.dob || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="City"
          name="city"
          value={user.city || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="Program"
          name="program"
          value={user.program || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="Student ID"
          name="studentId"
          value={user.studentId || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileField
          label="Semester"
          name="semester"
          value={user.semester || ""}
          isEditing={isEditing}
          handleChange={handleChange}
        />

      </div>

      <div className="textarea-group">

        <label>Address</label>

        <textarea
          value={user.address || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            handleChange("address", e.target.value)
          }
        />

      </div>

      <div className="textarea-group">

        <label>About Me</label>

        <textarea
          value={user.about || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            handleChange("about", e.target.value)
          }
        />

      </div>

    </div>

  );

}