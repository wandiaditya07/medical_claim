import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AppLayout = ({ sidebar: SidebarComponent, children }) => {
  return (
    <div className="d-flex">
      {SidebarComponent && <SidebarComponent />}

      <div className="flex-grow-1 d-flex flex-column min-vh-100 postion-fixed">
        <Navbar />
        <main className="flex-grow-1 p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
