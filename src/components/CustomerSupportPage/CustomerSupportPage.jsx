import React, { useMemo } from 'react'
import Styles from './Style.module.css'
import MySupportTicket from './MySupportTicket';
import { Link } from 'react-router-dom'
import { CustomerServiceIcon, OrderStatusIcon } from '../../lib/svg'

function CustomerSupportPage({ data, PageSize, currentPage, manufacturerFilter, searchBy,retailerFilter }) {
  const filteredData = useMemo(() => {
    let newValues = data;
    if (manufacturerFilter) {
      newValues = newValues.filter((item) => item.ManufacturerId__c === manufacturerFilter);
    }
    if (searchBy) {
      newValues = newValues?.filter((value) => value.CaseNumber?.toLowerCase().includes(searchBy?.toLowerCase()));
    }
    if(retailerFilter){
        newValues=newValues.filter((item)=>item.AccountId===retailerFilter)
    }
    return newValues;
  }, [data,retailerFilter, manufacturerFilter, searchBy]);
  return (
    <div>
      <div className="">
        <div className={Styles.supportMain}>
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12">
              <div className={Styles.supportLeft}>
                <Link to={"/order-list"}>
                  <div className={Styles.supportLeftBox}>
                    <div className={Styles.supportLeftImg}>
                      <OrderStatusIcon width={42} height={42} />
                    </div>

                    <div className={Styles.supportLeftContent}>
                      <h2>Order Status</h2>
                      <p>Track Your Orders with Ease.</p>
                    </div>
                  </div>
                </Link>

                <div className={Styles.supportLeftBox}>
                  <div className={Styles.supportLeftImg}>
                    <CustomerServiceIcon width={42} height={42} />
                  </div>

                  <div className={Styles.supportLeftContent}>
                    <h2>Customer Services </h2>
                    <p>Resolving Concerns Serving Solutions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9 col-md-12 col-sm-12">
              {filteredData.length ? (
                <MySupportTicket data={filteredData} currentPage={currentPage} PageSize={PageSize} />
              ) : (
                <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">No data found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSupportPage;