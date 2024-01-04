import React from "react";
import styles from "../topNav/index.module.css";
import { Link } from "react-router-dom";
import { useBag } from "../../../context/BagContext";

const LogoHeader = () => {
  const { orderQuantity } = useBag();

  return (
    <>
      <div className={` ${styles.laptopMode}`}>
        <div className={styles.lapSetting}>
          <p className={`m-0  ${styles.language}`}>
            <Link to="/my-retailers" className={`linkStyle`}>
              My Retailers
            </Link>
          </p>
          <p className={`m-0   ${styles.language}`}>
            <Link to="/new-arrivals" className={`linkStyle`}>
              New Arrivals
            </Link>
          </p>
          <p className={`m-0   ${styles.language}`}>
            <Link to="/brand" className={`linkStyle`}>
              Brands
            </Link>
          </p>
        </div>
        {/* image div */}
        <div className={styles.lapSetting}>
          <Link to="/dashboard" className={`linkStyle`}>
            <img src={"/assets/images/BFSG_logo.svg"} alt="img" />
          </Link>
        </div>
        {/* my bag */}
        <div className={styles.lapSetting}>
          <p className={`m-0  ${styles.language}`}>
            <Link to="/dashboard" className={`linkStyle`}>
              Dashboard
            </Link>
          </p>
          <p className={`m-0  ${styles.language} flex`}>
            Search...
            <img src={"/assets/images/searchIcon.svg"} alt="img" />
          </p>
          <p className={`m-0  ${styles.language}`}>
            <Link to="/my-bag" className={`linkStyle`}>
              My Bag ({orderQuantity ?? 0})
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogoHeader;
