import AppSidebar from "./AppSidebar";
import Header from "./Header";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;