import ProfileField from "./ProfileField";

export default function PersonalInfo() {

  const user = {
    fullName: "Khushi Jain",
    email: "khushi@gmail.com",
    phone: "+91 9876543210",
    dob: "10 Aug 2005",
    city: "Delhi",
    program: "B.Tech CSE",
    studentId: "RU20240012",
    semester: "4th Semester",
    address: "New Delhi, India",
    about:
      "Passionate Computer Science student interested in AI, Full Stack Development and Data Analytics.",
  };

  return (

    <div className="personal-card">

      <div className="card-header">

        <h2>
          Personal Information
        </h2>

      </div>

      <div className="info-grid">

        <ProfileField
          label="Full Name"
          value={user.fullName}
        />

        <ProfileField
          label="Email"
          value={user.email}
        />

        <ProfileField
          label="Phone"
          value={user.phone}
        />

        <ProfileField
          label="Date of Birth"
          value={user.dob}
        />

        <ProfileField
          label="City"
          value={user.city}
        />

        <ProfileField
          label="Program"
          value={user.program}
        />

        <ProfileField
          label="Student ID"
          value={user.studentId}
        />

        <ProfileField
          label="Semester"
          value={user.semester}
        />

      </div>

      <div className="textarea-group">

        <label>Address</label>

        <textarea
          readOnly
          value={user.address}
        />

      </div>

      <div className="textarea-group">

        <label>About Me</label>

        <textarea
          readOnly
          value={user.about}
        />

      </div>

    </div>

  );
}