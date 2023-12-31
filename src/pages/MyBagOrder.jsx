import React from 'react';
import TopNav from '../components/All Headers/topNav/TopNav';
import LogoHeader from '../components/All Headers/logoHeader/LogoHeader';
import Header from '../components/All Headers/header/Header';
import MyBagFinal from '../components/OrderList/MyBagFinal';
import HelpSection from '../components/Footer/HelpSection';
import Footer from '../components/Footer/Footer';
import MobileHeader from '../components/All Headers/mobileHeader/MobileHeader';

function MyBagOrder(props) {
    return (
        <div>
            <div className="container-fluid p-0 m-0">
        <div className="row p-0 m-0 d-flex flex-column justify-content-around align-items-center col-12">
          {/* TopNav */}
          <div className="col-10">
            <TopNav/>
          </div>
          <hr className="hrBgColor"></hr>
          {/* all headers */}
          <div className="col-10">
            <LogoHeader/>
            <Header />
            <MobileHeader/>
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
        </div>
    );
}

export default MyBagOrder;