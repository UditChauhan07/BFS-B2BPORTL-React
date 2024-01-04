import React, { useEffect } from "react";
import TopNav from "../components/All Headers/topNav/TopNav";
import LogoHeader from "../components/All Headers/logoHeader/LogoHeader";
import HelpSection from "../components/Footer/HelpSection";
import Header from "../components/All Headers/header/Header";
import Footer from "../components/Footer/Footer";
import Dashboard from "../components/Dashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import MobileHeader from '../components/All Headers/mobileHeader/MobileHeader'


const DashboardPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Name")) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className="container ">
        <div className="row  ">
          {/* TopNav */}
          
            <TopNav />
          
          <hr className="hrBgColor"></hr>
          {/* all headers */}
          
            <LogoHeader />
            <Header />
            <MobileHeader/>
          
          {/* dashboard */}
          
            <Dashboard />
          
      </div>
          {/* footer */}
          
        </div>
            <HelpSection />

            
            <Footer />
          
    </>
  );
};

export default DashboardPage;
