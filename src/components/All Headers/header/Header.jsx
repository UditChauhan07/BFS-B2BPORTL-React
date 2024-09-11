import React, { useEffect, useState, useMemo } from "react";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getPermissions } from "../../../lib/permission"; 
import PermissionDenied from "../../PermissionDeniedPopUp/PermissionDenied";
import "./index.css";
import { GetAuthData, getSessionStatus } from "../../../lib/store";

const Header = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const user = await GetAuthData();
        const userPermissions = await getPermissions();
        setPermissions(userPermissions);
      } catch (err) {
        console.log("Error fetching permissions", err);
      }
    }

    fetchPermissions();
  }, []);

  // Memoize permissions to avoid unnecessary re-calculations
  const memoizedPermissions = useMemo(() => permissions, [permissions]);

  // Handle restricted access with alert
  const handleRestrictedAccess = (moduleName) => {
    PermissionDenied();
  };

  const path = window.location.pathname;

  return (
    <div className="d-none-print">
      <div id={`${styles.main}`} className="d-flex justify-content-between align-items-center gap-1">
        {memoizedPermissions?.modules?.Header?.childModules?.topProducts ? (
          <p className={`m-0 ${styles.text}`}>
            <Link to="/top-products" className="linkStyle">Top Products</Link>
          </p>
        ) : (
          <p className={`m-0 ${styles.text}`}>
            <span
              className={`linkStyle`}
              onClick={() => handleRestrictedAccess('Top Products')}
              style={{ cursor: 'not-allowed', color: 'grey' }}
            >
              Top Products
            </span>
          </p>
        )}

        {memoizedPermissions?.modules?.Header?.childModules?.marketingCalender ? (
          <p className={`m-0 ${styles.text}`}>
            <Link to="/marketing-calendar" className="linkStyle">Marketing Calendar</Link>
          </p>
        ) : (
          <p className={`m-0 ${styles.text}`}>
            <span
              className={`linkStyle`}
              onClick={() => handleRestrictedAccess('Marketing Calendar')}
              style={{ cursor: 'not-allowed', color: 'grey' }}
            >
              Marketing Calendar
            </span>
          </p>
        )}

        {memoizedPermissions?.modules?.Header?.childModules?.educationCenter ? (
          <p className={`m-0 ${styles.text}`}>
            <Link to="/education-center" className="linkStyle">Education Center</Link>
          </p>
        ) : (
          <p className={`m-0 ${styles.text}`}>
            <span
              className={`linkStyle`}
              onClick={() => handleRestrictedAccess('Education Center')}
              style={{ cursor: 'not-allowed', color: 'grey' }}
            >
              Education Center
            </span>
          </p>
        )}

        {memoizedPermissions?.modules?.Header?.childModules?.customerSupport ? (
          <p className={`m-0 ${styles.text}`}>
            <Link to="/customer-support" className="linkStyle">Customer Support</Link>
          </p>
        ) : (
          <p className={`m-0 ${styles.text}`}>
            <span
              className={`linkStyle`}
              onClick={() => handleRestrictedAccess('Customer Support')}
              style={{ cursor: 'not-allowed', color: 'grey' }}
            >
              Customer Support
            </span>
          </p>
        )}

        <p className={`m-0 ${styles.text}`}>
          <Link to="" className="linkStyle">
            <div className="dropdown dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {path === "/sales-report" ? "Sales Report" : null ||
               path === "/newness-report" ? "Newness Report" : null ||
               path === "/comparison-report" ? "Comparison Report" : null ||
               path === "/comparison" ? "Yearly Comparison Report" : null ||
               path === "/Target-Report" ? "Target Report" : "Reports"}
              <ul className="dropdown-menu">
                {memoizedPermissions?.modules?.Header?.childModules?.salesReport ? (
                  <li>
                    <Link
                      to="/sales-report"
                      className="dropdown-item text-start"
                      onClick={() => navigate("/sales-report")}
                    >
                      Sales Report
                    </Link>
                  </li>
                ) : <li className="dropdown-item text-start" onClick={()=>handleRestrictedAccess('Sales Report')} 
                style={{ cursor: 'not-allowed', color: 'grey' , fontSize : '12px' }}
                > Sales Report</li>}

                {memoizedPermissions?.modules?.Header?.childModules?.newnessReport ? (
                  <li>
                    <Link
                      to="/newness-report"
                      className="dropdown-item text-start"
                      onClick={() => navigate("/newness-report")}
                    >
                      Newness Report
                    </Link>
                  </li>
                ) : <li className="dropdown-item text-start" onClick={()=>handleRestrictedAccess('Newness Report')} 
                style={{ cursor: 'not-allowed', color: 'grey' , fontSize : '12px' }}
                > Newness Report</li>}

                {memoizedPermissions?.modules?.Header?.childModules?.comparisonReport ? (
                  <li>
                    <Link
                      to="/comparison-report"
                      className="dropdown-item text-start"
                      onClick={() => navigate("/comparison-report")}
                    >
                      Comparison Report
                    </Link>
                  </li>
                ) :<li className="dropdown-item text-start" onClick={()=>handleRestrictedAccess('Comparison Report')} 
                style={{ cursor: 'not-allowed', color: 'grey' , fontSize : '12px' }}
                > Comparison Report</li> }

                {memoizedPermissions?.modules?.Header?.childModules?.yearlyComparisonReport ? (
                  <li>
                    <Link
                      to="/comparison"
                      className="dropdown-item text-start"
                      onClick={() => navigate("/comparison")}
                    >
                      Yearly Comparison Report
                    </Link>
                  </li>
                ) : <li className="dropdown-item text-start" onClick={()=>handleRestrictedAccess('Yearly Comparison Report')} 
                style={{ cursor: 'not-allowed', color: 'grey' , fontSize : '12px' }}
                > Yearly Comparison Report</li>}

                {memoizedPermissions?.modules?.Header?.childModules?.targetReport ? (
                  <li>
                    <Link
                      to="/Target-Report"
                      className="dropdown-item text-start"
                      onClick={() => navigate("/Target-Report")}
                    >
                      Target Report
                    </Link>
                  </li>
                ) : <li className="dropdown-item text-start" onClick={()=>handleRestrictedAccess('Target Report')} 
                style={{ cursor: 'not-allowed', color: 'grey' , fontSize : '12px' }}
                > Target Report</li>}
              </ul>
            </div>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Header;
