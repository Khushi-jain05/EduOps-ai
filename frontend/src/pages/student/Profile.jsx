import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import ProfileBanner from "../../components/profile/ProfileBanner";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileTabs from "../../components/profile/ProfileTabs";
import PersonalInfo from "../../components/profile/PersonalInfo";
import RecentActivity from "../../components/profile/RecentActivity";

import {
  getProfile,
  updateProfile,
} from "../../services/profile.service";

import "../../styles/profile.css";

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      console.log("PROFILE:", data);

      setProfile(data);

      setFormData(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

          <div
            style={{
              padding: "60px",
              textAlign: "center",
              fontSize: "22px",
            }}
          >
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

          <div
            style={{
              padding: "60px",
              textAlign: "center",
              fontSize: "22px",
            }}
          >
            Failed to load profile.
          </div>
        </div>
      </div>
    );
  }

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

          <ProfileStats
            stats={profile.stats}
          />

          <ProfileTabs />

          <div className="profile-grid">

            <PersonalInfo
              user={formData}
              isEditing={isEditing}
              handleChange={handleChange}
            />

            <RecentActivity
              activity={profile.activity}
            />

          </div>

        </div>
      </div>
    </div>
  );
}