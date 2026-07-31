import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import AccountCard from "../components/profile/AccountCard";

function Profile() {
  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProfileInfoCard />
        <AccountCard />
      </div>
    </div>
  );
}

export default Profile;