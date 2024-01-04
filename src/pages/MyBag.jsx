import React from "react";
import LogoHeader from "../components/All Headers/logoHeader/LogoHeader";
import TopNav from "../components/All Headers/topNav/TopNav";
import Header from "../components/All Headers/header/Header";
import HelpSection from "../components/Footer/HelpSection";
import Footer from "../components/Footer/Footer";
import MyBagFinal from "../components/MyBagFinal";
import { FilterItem } from "../components/FilterItem";

const MyBag = () => {
  return (
    <>
      <div className="container-fluid p-0 m-0">
        <div className="row p-0 m-0 d-flex flex-column justify-content-around align-items-center col-12">
          {/* TopNav */}
          <div className="col-10">
            <TopNav />
          </div>
          <hr className="hrBgColor"></hr>
          {/* all headers */}
          <div className="col-10">
            <LogoHeader />
            <Header />
            <div className="filter-container">
          </div>
          </div>
          {/* My Bag */}
          <div className="col-10">
           <MyBagFinal/>
          </div>
          {/* footer */}
          <div className="col-12">
            <HelpSection />
          </div>
          <div className="col-10">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyBag;
