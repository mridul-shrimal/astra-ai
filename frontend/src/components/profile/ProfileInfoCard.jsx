import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/Card";
import ProfileItem from "./ProfileItem";

function ProfileInfoCard() {
  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    "User";

  const email = user?.email || "Not Available";

  const userId = user?.id
    ? `${user.id.substring(0, 8)}...`
    : "Not Available";

  const joined =
    user?.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "Not Available";

  const provider =
    user?.app_metadata?.provider || "Email";

  const role =
    user?.role || "Authenticated";

  return (
    <Card title="Personal Information">
      <div className="space-y-1">

        <ProfileItem
          label="Full Name"
          value={fullName}
        />

        <ProfileItem
          label="Email"
          value={email}
        />

        <ProfileItem
          label="User ID"
          value={userId}
        />

        <ProfileItem
          label="Joined"
          value={joined}
        />

        <ProfileItem
          label="Provider"
          value={provider}
        />

        <ProfileItem
          label="Role"
          value={role}
        />

      </div>
    </Card>
  );
}

export default ProfileInfoCard;