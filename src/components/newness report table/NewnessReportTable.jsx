import React from "react";
import styles from "./table.module.css";
import { Link } from "react-router-dom";
import Loading from "../Loading";
const NewnessReportTable = ({ newnessData, dataDisplay }) => {
  // console.log(newnessData);
  const handleTableDataDisplay = (value) => {
    if (dataDisplay === "price") return `$${Number(value).toFixed(2)}`;
    else return value;
  };
  let length = 0;
  return (
    <>
      {newnessData?.status === 200 ? (
        newnessData.AccountList.length ? (
          <div className={`d-flex p-3 ${styles.tableBoundary} mb-5`}>
            <div className={`{styles.WidthTable} table-responsive overflow-scroll ` } style={{ maxHeight: "73vh", minHeight: "40vh" }}>
              <table id="salesReportTable" className="table table-responsive">
                <thead>
                  <tr>
                    <th className={`${styles.th} ${styles.stickyFirstColumnHeading} `}style={{ minWidth: "200px" }}>Account Name</th>
                    <th className={`${styles.th} ${styles.stickySecondColumnHeading}`} style={{ minWidth: "200px" }}>
                      Account Owner Name
                    </th>
                    <th className={`${styles.th} ${styles.stickyThirdColumnHeading1}`}>Sales Rep</th>
                    <th className={`${styles.month} ${styles.stickyMonth}`}>Account Status</th>
                    {newnessData?.header?.map((ele, index) => {
                      length = ele?.length > 30 ? (ele?.length >= 38 ? ele?.length * 7.5 : ele?.length * 8) : ele?.length * 10;
                      return (
                        // ele?.length >= 45 ? ele?.length * 6 : ele?.length * 6
                        <>
                          <th key={index} className={`${styles.month} ${styles.stickyMonth}`} style={{ minWidth: `${length}px` }}>
                            {ele}
                          </th>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {newnessData.AccountList.map((ele, index) => {
                    return (
                      <tr key={index}>
                        <td className={`${styles.td} ${styles.stickyFirstColumn}`}>{ele?.AccountName__c}</td>
                        <td className={`${styles.td} ${styles.stickySecondColumn}`}>{ele?.OwnerName}</td>
                        <td className={`${styles.td} ${styles.stickyThirdColumn1}`}>{ele?.Sales_Rep_Name__c}</td>
                        <td className={`${styles.td}`}>{ele?.Active_Closed__c}</td>

                        {newnessData?.header?.map((item, innerIndex) => {
                          return (
                            <>
                              <td className={`${styles.td}`} key={innerIndex}>
                                {handleTableDataDisplay(ele[item][dataDisplay === "quantity" ? "qty" : dataDisplay])}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
            {/* <Link to="/newness-report" className="linkStyle d-flex"> */}
              No Data Found 
              
            {/* </Link> */}
          </div>
        )
      ) : (
        <Loading height={"70vh"}/>
      )}
    </>
  );
};

export default NewnessReportTable;
