import React, { useEffect } from "react";
import TopNav from "./All Headers/topNav/TopNav";
import LogoHeader from "./All Headers/logoHeader/LogoHeader";
import Header from "./All Headers/header/Header";
import MobileHeader from "./All Headers/mobileHeader/MobileHeader";
import Footer from "./Footer/Footer";
import { motion, AnimatePresence } from 'framer-motion';
const AppLayout = ({ children, filterNodes }) => {
  useEffect(()=>{
    let ppc= localStorage.getItem("ppc");
    if(ppc && ppc != ""&&ppc != "undefined"&&ppc!="null"){
      localStorage.removeItem("ppc");
      window.location.href = window.location.origin+"/productPage/"+ppc
    }
  },[])
  return (
    <div className="col-12">
      <div className="container p-0">
        <TopNav />
        <hr className="hrBgColor" />
        <div className="sticky-top">
          <LogoHeader />
          <Header />
          <MobileHeader />
          <div className="filter-container">{filterNodes}</div>
        </div>
        <main>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.5, // Adjust the duration to 1 second
                ease: 'easeInOut', // Use a gradual easing curve
                delay: 0.25, // Add a 0.5-second delay to the animation
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
