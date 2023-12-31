import React from "react";
import styles from "./table.module.css";
import Loading from "../Loading";
const SalesReportTable = ({ salesData }) => {
  let totalOrder = 0,
    totalOrderPrice = 0;
  let monthTotalAmount = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };
  return (
    <>
      {salesData.length ? (
        <div className={`d-flex p-3 ${styles.tableBoundary} mb-5`}>
          <div
            className=""
            style={{ maxHeight: "73vh", minHeight: "40vh", overflow: "auto" }}
          >
            <table id="salesReportTable" className="table table-responsive">
              <thead>
                <tr>
                  <th
                    className={`${styles.th} ${styles.stickyFirstColumnHeading} `}
                    style={{ minWidth: "170px" }}
                  >
                    Manufacturer
                  </th>
                  <th
                    className={`${styles.th} ${styles.stickySecondColumnHeading}`}
                    style={{ minWidth: "150px" }}
                  >
                    Account
                  </th>
                  <th
                    className={`${styles.th} ${styles.stickyThirdColumnHeading}`}
                    style={{ minWidth: "200px" }}
                  >
                    Sales Rep
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Jan
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Feb
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Mar
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Apr
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    May
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Jun
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Jul
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Aug
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Sep
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Oct
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Nov
                  </th>
                  <th className={`${styles.month} ${styles.stickyMonth}`}>
                    Dec
                  </th>
                  <th
                    className={`${styles.th} ${styles.stickySecondLastColumnHeading}`}
                    style={{ minWidth: "200px" }}
                  >
                    Total Order
                  </th>
                  <th
                    className={`${styles.th} ${styles.stickyLastColumnHeading}`}
                    style={{ minWidth: "200px" }}
                  >
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((ele) => {
                  return ele.Orders.map((item, index) => {
                    totalOrder += Number(item.totalOrders);
                    totalOrderPrice += Number(item.totalorderPrice);
                    monthTotalAmount.Jan += Number(item.Jan.amount);
                    monthTotalAmount.Feb += Number(item.Feb.amount);
                    monthTotalAmount.Mar += Number(item.Mar.amount);
                    monthTotalAmount.Apr += Number(item.Apr.amount);
                    monthTotalAmount.May += Number(item.May.amount);
                    monthTotalAmount.Jun += Number(item.Jun.amount);
                    monthTotalAmount.Jul += Number(item.Jul.amount);
                    monthTotalAmount.Aug += Number(item.Aug.amount);
                    monthTotalAmount.Sep += Number(item.Sep.amount);
                    monthTotalAmount.Oct += Number(item.Oct.amount);
                    monthTotalAmount.Nov += Number(item.Nov.amount);
                    monthTotalAmount.Dec += Number(item.Dec.amount);
                    return (
                      <tr key={index}>
                        <td
                          className={`${styles.td} ${styles.stickyFirstColumn}`}
                        >
                          {ele?.ManufacturerName__c}
                        </td>
                        <td
                          className={`${styles.td} ${styles.stickySecondColumn}`}
                        >
                          {item?.Name}
                        </td>
                        <td
                          className={`${styles.td} ${styles.stickyThirdColumn}`}
                        >
                          {item?.AccountRepo ??
                            JSON.parse(localStorage.getItem("Api Data")).data
                              .Name}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Jan.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Feb.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Mar.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Apr.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.May.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Jun.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Jul.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Aug.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Sep.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Oct.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td}`}>
                          ${Number(item.Nov.amount).toFixed(2)}
                        </td>
                        <td className={`${styles.td} `}>
                          ${Number(item.Dec.amount).toFixed(2)}
                        </td>
                        <td
                          className={`${styles.td} ${styles.stickySecondLastColumn}`}
                        >
                          {item?.totalOrders}
                        </td>
                        <td
                          className={`${styles.td} ${styles.stickyLastColumn}`}
                        >
                          ${Number(item?.totalorderPrice).toFixed(2)}
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    className={`${styles.lastRow} ${styles.stickyFirstColumn} ${styles.stickyLastRow}`}
                  >
                    TOTAL
                  </td>
                  <td
                    className={`${styles.lastRow} ${styles.stickySecondColumn} ${styles.stickyLastRow}`}
                  ></td>
                  <td
                    className={`${styles.lastRow} ${styles.stickyThirdColumn} ${styles.stickyLastRow}`}
                  ></td>
                  <td
                    className={`${styles.lastRow} ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Jan).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow} ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Feb).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Mar).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Apr).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.May).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.stickyLastRow}  ${styles.lastRowMonth}`}
                  >
                    ${Number(monthTotalAmount.Jun).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Jul).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Aug).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Sep).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Oct).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth} ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Nov).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow}  ${styles.lastRowMonth}  ${styles.stickyLastRow}`}
                  >
                    ${Number(monthTotalAmount.Dec).toFixed(2)}
                  </td>
                  <td
                    className={`${styles.lastRow} ${styles.stickyLastRow} ${styles.stickySecondLastColumn}`}
                  >
                    {totalOrder}
                  </td>
                  <td
                    className={`${styles.lastRow} ${styles.stickyLastRow} ${styles.stickyLastColumn}`}
                  >
                    ${Number(totalOrderPrice).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <Loading height={"70vh"} />
      )}
    </>
  );
};

export default SalesReportTable;
