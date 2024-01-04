import React from "react";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import "./index.css";
const Header = () => {
  return (
    <div id={`${styles.main}`} className="d-flex justify-content-between  align-items-center my-2 gap-1">
      <p className={`m-0 ${styles.text}`}>
        <Link to="/top-products" className="linkStyle">
          Top Products
        </Link>
      </p>
      <p className={`m-0  ${styles.text}`}>
        <Link to="/marketing-calendar" className="linkStyle">
          Marketing Calendar
        </Link>
      </p>
        
      <p className={`m-0  ${styles.text}`}>
        <Link to="/education-center" className="linkStyle">
          Education Center
        </Link>
      </p>
      <p className={`m-0  ${styles.text}`}>
        <Link to="/customer-support" className="linkStyle">
          Customer Support
        </Link>
      </p>
      {/* <p className={`m-0  ${styles.text}`}>
        <select defaultValue="">
          <option value=""  disabled > REPORTS</option>
          <option value="1" className={`m-0  ${styles.text}`}> Sales Report</option>
          <option value="2" className={`m-0  ${styles.text}`}> Newness Report</option>
          <option value="3" className={`m-0  ${styles.text}`}> Comparison Report</option>
        </select>
        </p> */}
      <p className={`m-0  ${styles.text}`}>
        <Link to="" className="linkStyle">
                 
          <div class="dropdown">
  <a class=" dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
  Report
  </a>

  <ul class="dropdown-menu">
    <li><a class="dropdown-item">Newness Report</a></li>
    <li><a class="dropdown-item">Comparison Report</a></li>
  </ul>
</div>
        </Link>
      </p>
      
      
    </div>
  );
};

export default Header;
