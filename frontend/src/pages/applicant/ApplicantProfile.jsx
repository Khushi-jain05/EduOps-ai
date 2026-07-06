import { useEffect, useState } from "react";
import { CheckCircle2, BookOpen, CalendarDays } from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import ProfileBanner from "../../components/profile/ProfileBanner";
import PersonalInfo from "../../components/profile/PersonalInfo";
import RecentActivity from "../../components/profile/RecentActivity";

import { getProfile, updateProfile } from "../../services/profile.service";

import "../../styles/profile.css";

export default function ApplicantProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      alert("Profile Updated Successfully");
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      console.log(error);
      alert("Failed to Update Profile");
    }
  };

  if (loading) {
    return (
      <div className="profile-layout">
        <Sidebar />
        <div className="profile-content">
          <Navbar />
          <div style={{ padding: "60px", textAlign: "center", fontSize: "22px" }}>
            Loading Profile...
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-layout">
        <Sidebar />
        <div className="profile-content">
          <Navbar />
          <div style={{ padding: "60px", textAlign: "center", fontSize: "22px" }}>
            Failed to load profile.
          </div>
        </div>
      </div>
    );
  }

  const stats = profile.stats || {};

  const statCards = [
    { title: "Application", value: `${stats.progressPercent ?? 0}%`, icon: CheckCircle2, color: "blue" },
    { title: "Programs Open", value: stats.programsOpen ?? 0, icon: BookOpen, color: "green" },
    { title: "Appointments", value: stats.appointments ?? 0, icon: CalendarDays, color: "orange" },
  ];

  return (
    <div className="profile-layout">
      <Sidebar />
      <div className="profile-content">
        <Navbar />
        <div className="profile-wrapper">
          <ProfileBanner
            user={formData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
          />

          <div className="profile-stats">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="stat-card">
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

          <div className="profile-grid">
            <PersonalInfo
              user={formData}
              isEditing={isEditing}
              handleChange={handleChange}
            />
            <RecentActivity activity={profile.activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
