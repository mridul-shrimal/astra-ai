import { useTheme } from "../../context/ThemeContext";


function Greeting() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <div className="mb-8">
      <h1
  className={`text-4xl font-bold ${
    isLight ? "text-slate-900" : "text-white"
  }`}
>
        {greeting}, Mridul 👋
      </h1>

      <p
  className={`mt-2 ${
    isLight ? "text-slate-600" : "text-gray-400"
  }`}
>
        Welcome back! Astra AI is ready to assist you.
      </p>
    </div>
  );
}

export default Greeting;