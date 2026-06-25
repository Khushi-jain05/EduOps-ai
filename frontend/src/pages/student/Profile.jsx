import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import ProfileBanner from "../../components/profile/ProfileBanner";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileTabs from "../../components/profile/ProfileTabs";
import PersonalInfo from "../../components/profile/PersonalInfo";
import RecentActivity from "../../components/profile/RecentActivity";

import "../../styles/profile.css";

export default function Profile() {

  return (

    <div className="profile-layout">

      <Sidebar />

      <div className="profile-content">

        <Navbar />

        <div className="profile-wrapper">

          <ProfileBanner />

          <ProfileStats />

          <ProfileTabs />

          <div className="profile-grid">

            <PersonalInfo />

            <RecentActivity />

          </div>

        </div>

      </div>

    </div>

  );

}