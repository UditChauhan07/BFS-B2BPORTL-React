import React, { useEffect, useState, useMemo } from "react";
import Styles from "./style.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import OrderListContent from "./OrderListContent";

import { json } from "react-router-dom";
import { GetAuthData, getOrderList } from "../../lib/store";
import Loading from "../Loading";
import Pagination from "../Pagination/Pagination";
let PageSize = 10;
function OrderList() {
  const [data, setdata] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchTextfilter, setSearchTextfilter] = useState("");
  const [cards, setCards] = useState();
  const [Viewmore, setviewmore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [Options, setOptions] = useState([]);




  useEffect(() => {
    GetAuthData()
      .then((response) => {
        getOrderList({
          user: {
            key: response.x_access_token,
            Sales_Rep__c: false?"00530000005AdvsAAC" : response.Sales_Rep__c,
          },
        })
          .then((order) => {
            setdata(order);
            setLoaded(true);
          })
          .catch((error) => {
            console.log({ error });
          });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  const handlesearch = (e) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
  };

  const filteritem = () => {
    console.log(searchText);
    const filtered = data.filter(
      (ele) =>
        ele.PO_Number__c === searchText ||
        ele.PO_Number__c.includes(searchText.toLowerCase())
    );

    setCards(filtered);
  };

  const handleclick = () => {
    setviewmore(!Viewmore);
  };

  // const filteredArray = data?.filter((item) => {
  //   return  console.log( item);item.AccountName.toLowerCase().includes(searchTextfilter.toLowerCase());

  // })
  const handlefilter = (e) => {
    const search = e.target.value;
    const fill = data?.filter(
      (item) =>
        item.AccountName === search ||
        item.AccountName.includes(search.toLowerCase())
    );
    console.log(fill);

  };
  if (!loaded) return <Loading />;
  
  const OrderListDataSort = () => {
    const currentTableData = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return data.slice(firstPageIndex, lastPageIndex);
    }, [currentPage]);
    return <OrderListContent data={currentTableData} />;
  };

  const date = new Date();
  const options = {
    year: "numeric",
    month: "long",
  };
  let current = date.toLocaleString("en-IN", options);


  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  var d;
  var month;
  for (var i = 6; i > 0; i -= 1) {
    d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    month = monthNames[d.getMonth()];
  }

  var previousYearDate = `${d.getFullYear() - 1}`;


  return (
    <div>
      <div className="container mt-4">
        <div className={Styles.blacklLabel}>
          <ul className="d-flex">
            <li>
              <div class="dropdown">
                <button
                  class="dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  MONTHS
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      {current}
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      {month}
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      {previousYearDate}
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <select onChange={(e) => {
                const selectdata = data?.find((x) => x.ManufacturerName__c === e.target.value);
                setOptions(selectdata)
              }}
                className={Styles.selection}>
                <option> MANUFACTURER</option>
                {
                  data.map((ele) => {
                    return <>
                      <option value={ele.ManufacturerName__c} key={ele.Id}>{ele.ManufacturerName__c}</option>
                    </>
                  })
                }
              </select>

            </li>


            <li className={`d-flex align-items-center ${Styles.inputDraw}`}>
              <input
                type="text"
                placeholder="Search By Account"
                onChange={handlefilter}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <circle cx="8.24951" cy="8.25" r="4.5" stroke="white" />
                <path
                  d="M10.4995 8.25C10.4995 7.95453 10.4413 7.66194 10.3282 7.38896C10.2152 7.11598 10.0494 6.86794 9.8405 6.65901C9.63157 6.45008 9.38353 6.28434 9.11055 6.17127C8.83757 6.0582 8.54499 6 8.24951 6"
                  stroke="white"
                  stroke-linecap="round"
                />
                <path
                  d="M14.9995 15L12.7495 12.75"
                  stroke="white"
                  stroke-linecap="round"
                />
              </svg>
            </li>
            <li className={Styles.BtnStyle}>CLEAR ALL</li>
          </ul>
        </div>
      </div>

      <section>
        <div className="">
          <div className={Styles.orderMainDiv}>
            <div className={Styles.OrderMainPr}>
              <div className={Styles.inorderflex}>
                <div>
                  <h2>Your Orders</h2>
                </div>
                <div
                  className={`d-flex align-items-center ${Styles.InputControll}`}
                >
                  <input
                    type="text"
                    placeholder="Search All Orders"
                    onChange={handlesearch}
                  />
                  <button onClick={filteritem}>Search Orders</button>
                </div>
              </div>

              {searchText === "" ? (
                <>
                  <OrderListDataSort />
                </>
              ) : cards ? (
                <>
                  <div className={Styles.orderStatement}>
                    {cards.map((item, index) => {
                      return (
                        <div key={index}>
                          <div className={Styles.poNumber}>
                            <div>
                              <h3>PO Number</h3>
                              <p>{item.PO_Number__c}</p>
                            </div>

                            <div>
                              <h3>Brand</h3>
                              <p>{item.ManufacturerName__c}</p>
                            </div>

                            <div className={Styles.PoOrderLast}>
                              <h3>Ship To </h3>
                              <p>{item.AccountName}</p>
                            </div>
                          </div>

                          <div className={Styles.productDetail}>
                            <div className={Styles.Prod1}>
                              <div className={Styles.ProtuctInnerBox}>
                                <div className={Styles.BoxBlack}>
                                  <div className={Styles.Boxwhite}>
                                    <h1>
                                      {item.ProductCount} <span>Products</span>
                                    </h1>
                                  </div>
                                </div>
                              </div>

                              <div className={Styles.ProtuctInnerBox1}>
                                <ul>
                                  {item.OpportunityLineItems?.records.length >
                                    3 &&
                                    item.OpportunityLineItems?.records.map(
                                      (ele) => {
                                        return (
                                          <>
                                            <li
                                              className={Styles.tool}
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              onClick={handleclick}
                                            >
                                              {Viewmore
                                                ? ele.Name
                                                : `${ele.Name.slice(0, 31)}...`}
                                            </li>
                                          </>
                                        );
                                      }
                                    )}
                                </ul>
                              </div>
                            </div>

                            <div className={Styles.totalProductPrice}>
                              <div className={Styles.Margitotal}>
                                <h3>Total</h3>
                                <p>${item.Amount}</p>
                              </div>

                              <button>View Order Details</button>
                            </div>
                          </div>

                          <div className={Styles.StatusOrder}>
                            <div className={Styles.Status1}>
                              <h2>Tracking Status</h2>
                              <h3>Order Status</h3>
                              <h4>Invoice </h4>
                            </div>

                            <div className={Styles.Status2}>
                              <h6>
                                Order Placed <span>: {item.CreatedDate}</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      );
                    })} 

                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">
                    No data found
                  </div>
                </>
              )}
            </div>
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={data.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderList;
