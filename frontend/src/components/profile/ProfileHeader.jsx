import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

import { Pencil } from "lucide-react";

function ProfileHeader() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const isLight = theme === "light";

  const fullName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    "User";

  const email = user?.email || "Not Available";

  const verified = !!user?.email_confirmed_at;

  return (
    <div
      className={`rounded-2xl border p-8 transition-all duration-300 ${
        isLight
          ? "bg-white border-slate-200 shadow-sm"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="flex items-center gap-6">

          <Avatar
            name={fullName}
            size="xl"
            showStatus
          />

          <div>

            <h1
              className={`text-3xl font-bold ${
                isLight
                  ? "text-slate-900"
                  : "text-white"
              }`}
            >
              {fullName}
            </h1>

            <p
              className={`mt-2 ${
                isLight
                  ? "text-slate-600"
                  : "text-slate-400"
              }`}
            >
              {email}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">

              <Badge variant="success">
                Active
              </Badge>

              <Badge
                variant={
                  verified
                    ? "success"
                    : "warning"
                }
              >
                {verified
                  ? "Verified"
                  : "Pending"}
              </Badge>

              <Badge variant="info">
                Astra User
              </Badge>

            </div>

          </div>

        </div>

        {/* Right */}

        <Button>
          <Pencil size={18} />
          Edit Profile
        </Button>

      </div>
    </div>
  );
}

export default ProfileHeader;