import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useTheme } from "../../context/ThemeContext";

function MainLayout({ children }) {
  const { theme } = useTheme();
  return (
    <div
  className={`flex min-h-screen transition-colors duration-300 ${
    theme === "light"
      ? "bg-slate-100 text-slate-900"
      : "bg-slate-950 text-white"
  }`}
>
      {/* Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main
  className={`flex-1 overflow-auto p-8 transition-colors duration-300 ${
    theme === "light"
      ? "bg-slate-100"
      : "bg-slate-950"
  }`}
>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;