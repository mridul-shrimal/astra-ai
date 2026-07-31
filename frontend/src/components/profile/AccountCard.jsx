import {
  ShieldCheck,
  MailCheck,
  Clock3,
  MessageSquare,
  Brain,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function AccountCard() {
  const { user } = useAuth();

  const verified = !!user?.email_confirmed_at;

  const lastLogin = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : "Not Available";

  return (
    <Card title="Account Overview">
      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={22} />
            <span>Account Status</span>
          </div>

          <Badge variant="success">
            Active
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MailCheck className="text-cyan-500" size={22} />
            <span>Email Verification</span>
          </div>

          <Badge
            variant={
              verified
                ? "success"
                : "warning"
            }
          >
            {verified ? "Verified" : "Pending"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3 className="text-amber-500" size={22} />
            <span>Last Login</span>
          </div>

          <span className="text-sm text-right">
            {lastLogin}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">

          <div className="rounded-xl bg-cyan-500/10 p-4 text-center">
            <MessageSquare
              className="mx-auto mb-2 text-cyan-400"
              size={22}
            />
            <h3 className="text-2xl font-bold">
              0
            </h3>
            <p className="text-sm text-slate-400">
              Chats
            </p>
          </div>

          <div className="rounded-xl bg-cyan-500/10 p-4 text-center">
            <Brain
              className="mx-auto mb-2 text-cyan-400"
              size={22}
            />
            <h3 className="text-2xl font-bold">
              0
            </h3>
            <p className="text-sm text-slate-400">
              Memories
            </p>
          </div>

        </div>

        <Button className="w-full">
          Edit Profile
        </Button>

      </div>
    </Card>
  );
}

export default AccountCard;