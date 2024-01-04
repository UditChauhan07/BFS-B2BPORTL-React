import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from './Styles.module.css'
import Img1 from './Images/Eye1.png'



function MyBagFinal({opportunityId}) {
  console.log(opportunityId);
 

  
 

  return (
    <div>
      <section>
        <div className='container mt-4'>
          <div>
            <div className={Styles.MyBagFinalTop}>
              <div className={Styles.MyBagFinalRight} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none" onClick={handleback}>
                  <path d="M8.94284 2.27615C9.46349 1.75544 9.46349 0.911229 8.94284 0.390521C8.42213 -0.130174 7.57792 -0.130174 7.05721 0.390521L2.3911 5.05666C2.39092 5.05684 2.39128 5.05648 2.3911 5.05666L0.390558 7.05721C0.153385 7.29442 0.024252 7.59868 0.00313201 7.90895C-0.00281464 7.99562 -0.000321319 8.08295 0.010852 8.17002C0.0431986 8.42308 0.148118 8.66868 0.325638 8.87322C0.348651 8.89975 0.372651 8.92535 0.397585 8.94989L7.05721 15.6095C7.57792 16.1302 8.42213 16.1302 8.94284 15.6095C9.46349 15.0888 9.46349 14.2446 8.94284 13.7239L4.55231 9.33335H22.6667C23.4031 9.33335 24 8.73642 24 8.00002C24 7.26362 23.4031 6.66668 22.6667 6.66668H4.55231L8.94284 2.27615Z" fill="black" />
                </svg>
                <h4> <span> {OrderData.ManufacturerName__c} | </span>{OrderData.Name}</h4> </div>

              <div className={Styles.MyBagFinalleft} ><h5>PO Number    <b>{OrderData.PO_Number__c}</b> </h5>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M19.3078 10.6932V19.2841C19.3078 19.6794 18.9753 20 18.5652 20H0.742642C0.332504 20 0 19.6794 0 19.2841V2.10217C0 1.70682 0.332504 1.38627 0.742642 1.38627H9.65389C10.064 1.38627 10.3965 1.70682 10.3965 2.10217C10.3965 2.49754 10.064 2.81809 9.65389 2.81809H1.48519V18.5682H17.8226V10.6932C17.8226 10.2979 18.1551 9.97731 18.5652 9.97731C18.9753 9.97731 19.3078 10.2979 19.3078 10.6932ZM17.9926 5.11422L15.6952 2.89943L7.72487 10.5832L7.09297 13.4072L10.0223 12.7981L17.9926 5.11422ZM21 2.2148L18.7027 0L16.8541 1.78215L19.1515 3.99692L21 2.2148Z" fill="black" />
                </svg>
              </div>


            </div>

            <div className={Styles.MyBagFinalMain}>
              <div className='row'>
                <div className='col-lg-7 col-md-8 col-sm-12'>
                  <div className={Styles.MainBag}>
                    <h3>SHOPPING BAG (33)</h3>
                    <div className={Styles.scrollP}>
                      <div className={Styles.MainInner}>

                        <div className={Styles.Mainbox}>
                          <div className={Styles.Mainbox1M}>
                            {/* <div className={Styles.Mainbox2}>
                            </div> */}
                            <div className={Styles.Mainbox3}>
                              {
                                OrderData.OpportunityLineItems?.map((item) => {
                                  return (
                                    <>

                                      <div className={`d-flex g-3 ${Styles.innerBox}`}>

                                        <div className={Styles.Mainbox2}>
                                          <img src={Img1} alt="" />
                                        </div>
                                        <div>
                                          <h2 className="">{item.Name} </h2>
                                          <p><span className={Styles.Span1} >{item.ListPrice}</span>
                                            <span className={Styles.Span2}>{item.UnitPrice}</span></p>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              }

                            </div>
                          </div>
                        </div>

                      </div>

                      <div className={Styles.TotalPricer}>
                        <div>
                          <h2>Total</h2>
                        </div>
                        <div>
                          <h2>{OrderData.Amount}</h2>
                        </div>
                      </div>
                    </div>






                  </div>

                </div>

                <div className='col-lg-5 col-md-4 col-sm-12'>
                  <div className={Styles.ShippControl}>
                    <h2>Shipping Address</h2>

                    <div className={Styles.ShipAdress}>
                      <p>928 S Western Ave <br />
                        # 111Los Angeles, CA 90006US<br />
                        Example123@gmail.com |+(442)-XXX-XX00</p>

                    </div>

                    <div className={Styles.ShipAdress2}>
                      <h4>Note</h4>
                      <textarea placeholder='' />
                    </div>

                    <div className={Styles.ShipBut}>
                      <button>INVOICE</button>
                    </div>


                  </div>

                </div>
              </div>

            </div>




            {/* </>
                )
              })

            } */}










          </div>

        </div>
      </section>



    </div>
  )
}

export default MyBagFinal