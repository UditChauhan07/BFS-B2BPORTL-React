import React, { useEffect, useState } from "react";
import Styles from "./style.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalPage from "../Modal UI";
import TrackingStatus from "./TrackingStatus/TrackingStatus";
import Orderstatus from "./OrderStatus/Orderstatus";

import { Link } from "react-router-dom";
import MyBagFinal from "./MyBagFinal";



function OrderListContent({ data }) {
  const [Orderdata, setOrderdata] = useState(data || []);
  const [Viewmore, setviewmore] = useState(false);
  const [isTrackingModal, setIsTrackingModal] = useState(false);
  const [oppoId, setoppoId] = useState();
  const [OrderId, setOrderId] = useState();
  console.log(oppoId);

  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = `${months[currentDate.getMonth()]
    } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  const TrackingModal = () => {
    return (
      <ModalPage
        open
        content={
          <div>
            <p className="text-center">
              Data is not available for selected Account and Manufacturer.{" "}
              <br></br>
              <br></br>
              Redirecting to My Retailers page...
            </p>
          </div>
        }
      />
    );
  };


  let size = 3;





  return (
    <>

      <MyBagFinal opportunityId={oppoId} />
      {/* TRACKING MODAL */}

      <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-lg">
          <div class="modal-content">
            {/* <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div> */}
            <div class="modal-body mt-4 ">
              <TrackingStatus
                TrackingData={Orderdata}
                opportunityId={oppoId}

              />
            </div>
          </div>
        </div>
      </div>


      {/* ORDER STATUS MODAL */}

      <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-lg">
          <div class="modal-content">
            {/* <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div> */}
            <div class="modal-body  mt-4">
              <Orderstatus
                TrackingData={Orderdata}
                opportunityId={oppoId}
              />
            </div>
          </div>
        </div>
      </div>



      {Orderdata.map((item, index) => {
        date = new Date(item.CreatedDate);
        let cdate = `${currentDate.getDate()} ${months[currentDate.getMonth()]
          } ${currentDate.getFullYear()}`;

        return (
          <div className={` ${Styles.orderStatement}`} key={index}>
            <div>
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
                      {item.OpportunityLineItems?.records.slice(0, size).map((ele) => {
                        return (
                          <>
                            <li>
                              {Viewmore
                                ? ele.Name
                                : `${ele.Name.slice(0, 31)}...`}

                            </li>


                          </>
                        );
                      })}
                    </ul>
                    {/* <span><a > +22More</a></span>*/}
                    <span>
                      <a>
                        {item.OpportunityLineItems?.totalSize - 3 < 0
                          ? ""
                          : `{+${item.OpportunityLineItems?.totalSize - 3
                          } More}`}
                      </a>
                    </span>
                  </div>
                </div>

                <div className={Styles.totalProductPrice}>
                  <div className={Styles.Margitotal}>
                    <h3>Total</h3>
                    <p>${Number(item.Amount).toFixed(2)}</p>
                  </div>

                  <Link to="/my-bagorder">
                    <button onClick={(e) => setoppoId(item.Id)}>
                      View Order Details
                    </button>
                  </Link>
                </div>
              </div>

              <div className={Styles.StatusOrder}>
                <div className={Styles.Status1}>
                  <h2 data-bs-toggle="modal" data-bs-target="#exampleModal1"
                    // onClick={() => {
                    //   setIsTrackingModal(true);
                    // }}
                    onClick={(e) => setoppoId(item.Id)}
                  >
                    Tracking Status
                  </h2>
                  <h3 data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={(e) => setoppoId(item.Id)}> Order Status</h3>
                  <h4>Invoice </h4>
                </div>

                <div className={Styles.Status2}>
                  <h6>
                    Order Placed <span>: {cdate}</span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {isTrackingModal && <TrackingModal />}


    </>
  );
}

export default OrderListContent;
