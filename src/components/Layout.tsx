
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-honeywell-dark">
      <Sidebar />
      <div className="flex flex-col flex-1 pl-2"> {/* Added left padding here */}
        <TopBar />
        <main className="flex-1 overflow-auto circuit-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
