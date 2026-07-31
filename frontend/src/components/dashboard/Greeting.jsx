import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

function Greeting() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const isLight = theme === "light";
  const hour = new Date().getHours();

  // Greeting based on time
  let greeting = "Good Evening";
  let period = "evening";

  if (hour < 12) {
    greeting = "Good Morning";
    period = "morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
    period = "afternoon";
  }

  // Get user's name
  const fullName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    "User";

  const firstName = fullName.trim().split(" ")[0];

  // Professional greeting messages
  const messages = {
    morning: [
      "Let's make today productive.",
      "Ready to build something amazing?",
      "Your AI assistant is standing by.",
    ],
    afternoon: [
      "Hope your day is going great.",
      "Let's keep the momentum going.",
      "Need help with your next task?",
    ],
    evening: [
      "Time to finish strong.",
      "Let's wrap up today's work.",
      "Your AI assistant is still here for you.",
    ],
  };

  // Rotate message once per day
  const dayNumber = new Date().getDate();
  const message =
    messages[period][dayNumber % messages[period].length];

  return (
    <div className="mb-8">
      <h1
        className={`text-4xl font-bold ${
          isLight ? "text-slate-900" : "text-white"
        }`}
      >
        {greeting}, {firstName} 👋
      </h1>

      <p
        className={`mt-2 ${
          isLight ? "text-slate-600" : "text-gray-400"
        }`}
      >
        {message}
      </p>
    </div>
  );
}

export default Greeting;