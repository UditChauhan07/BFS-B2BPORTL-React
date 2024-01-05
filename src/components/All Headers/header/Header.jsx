import React, { useState } from "react";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
const Header = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  return (
    <div className="">
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
      <p className={`m-0  ${styles.text}`}>
        <Link to="" className="linkStyle">
          <div class="dropdown dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {path === "/sales-report" ? "Sales Report" : null || path === "/newness-report" ? "newness Report" : null || path === "/comparison-report" ? "comparison Report" : null || "Reports"}
            <ul class="dropdown-menu">
              <li>
                <Link
                  to="/sales-report"
                  className="dropdown-item text-start"
                  onClick={() => {
                    navigate("/sales-report");
                  }}
                >
                  Sales Report
                </Link>
              </li>
              <li>
                <Link
                  to="/newness-report"
                  className="dropdown-item text-start"
                  onClick={() => {
                    navigate("/newness-report");
                  }}
                >
                  Newness Report
                </Link>
              </li>
              <li>
                <Link
                  to="/comparison-report"
                  className="dropdown-item  text-start"
                  onClick={() => {
                    navigate("/comparison-report");
                  }}
                >
                  Comparison Report
                </Link>
              </li>
            </ul>
          </div>
        </Link>
      </p>
    </div>
    </div>
  );
};

export default Header;
