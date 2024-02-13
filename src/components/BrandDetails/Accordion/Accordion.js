import React, { useState } from "react";
import styles from "./Style.module.css";
import Img1 from "./images/makeup1.png";
import CollapsibleRow from "../../CollapsibleRow";
import QuantitySelector from "./QuantitySelector";

import ModalPage from "../../Modal UI";
import { useBag } from "../../../context/BagContext";

const Accordion = ({ data, formattedData }) => {
  // console.log("Accordion data", data);
  // console.log("Accordion formattedData", formattedData);
  const { orders, setOrders, setOrderQuantity, addOrder } = useBag();
  const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
  const [replaceCartProduct, setReplaceCartProduct] = useState({});
  const [showName, setShowName] = useState(false);
  const [inputLimit, setInputLimit] = useState('');
  const onQuantityChange = (product, quantity, salesPrice = null, discount = null) => {
    product.salesPrice = salesPrice;
    if (Object.values(orders).length) {
      if (
        Object.values(orders)[0]?.manufacturer?.name === localStorage.getItem("manufacturer") &&
        Object.values(orders)[0].account.name === localStorage.getItem("Account") &&
        Object.values(orders)[0].productType === (product.Category__c === "PREORDER" ? "pre-order" : "wholesale")
      ) {
        orderSetting(product, quantity);
        setReplaceCartModalOpen(false);
      } else {
        setReplaceCartModalOpen(true);
        setReplaceCartProduct({ product, quantity });
      }
    } else {
      orderSetting(product, quantity);
    }
  };
  const orderSetting = (product, quantity) => {
    setReplaceCartModalOpen(false);
    addOrder(product, quantity, data.discount);
  };

  const replaceCart = () => {
    localStorage.removeItem("orders");
    setReplaceCartModalOpen(false);
    setOrderQuantity(0);
    setOrders({});
    addOrder(replaceCartProduct.product, replaceCartProduct.quantity, data.discount);
  };
  const handleNameChange =(e)=> {
    const limit = 10;
 // 👇️ only take first N characters
     setInputLimit(e.target.value.slice(0, limit));
    
   };
  return (
    <>
      {replaceCartModalOpen ? (
        <ModalPage
          open
          content={
            <div className="d-flex flex-column gap-3">
              <h2 className={`${styles.warning} `}>Warning</h2>
              <p className={`${styles.warningContent} `}>
                Adding this item will replace <br></br> your current cart
              </p>
              <div className="d-flex justify-content-around ">
                <button className={`${styles.modalButton}`} onClick={replaceCart}>
                  OK
                </button>
                <button className={`${styles.modalButton}`} onClick={() => setReplaceCartModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          }
          onClose={() => {
            setReplaceCartModalOpen(false);
          }}
        />
      ) : null}
      <div className={styles.OverFloweClass}>
        <div className={styles.accordion}>
          <table className="table table-hover ">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Product Code</th>
                <th>UPC</th>
                <th>List Price</th>
                <th>Sale Price</th>
                <th>Min Qty</th>
                <th>Qty</th>
              </tr>
            </thead>
            {Object.keys(formattedData).length ? (
              <>
                <tbody>
                  {Object.keys(formattedData)?.map((key, index) => {
                    let categoryOrderQuantity = 0;
                    Object.values(orders)?.forEach((order) => {
                      if (
                        order.account.name === localStorage.getItem("Account") &&
                        order.manufacturer.name === localStorage.getItem("manufacturer") &&
                        (order.product.Category__c === key || `${order.product.Category__c}` === key)
                      ) {
                        categoryOrderQuantity += order.quantity;
                      }
                    });
                    return (
                      <CollapsibleRow title={key != "null" ? key : "No Category"} quantity={categoryOrderQuantity} key={index} index={index}>
                        {Object.values(formattedData)[index]?.map((value, indexed) => {
                          let listPrice = isNaN(Number(value.usdRetail__c.substring(1)))
                            ? (+value.usdRetail__c.substring(2)).toFixed(2)
                            : (+value.usdRetail__c.substring(1)).toFixed(2);
                          return (
                            <tr className={`${styles.ControlTR} w-full `} key={indexed}>
                              <td className={styles.ControlStyle}>
                                <img src={Img1} alt="img" />
                              </td>
                              <td
                                className="text-capitalize"
                                onMouseEnter={() => setShowName({ index: indexed, type: true })}
                                onMouseLeave={() => setShowName({ index: indexed })}
                              >
                                {indexed !== showName?.index && value.Name.length >= 23 ? `${value.Name.substring(0, 23)}...` : value.Name}
                              </td>
                              <td>{value.ProductCode}</td>
                              <td>{value.ProductUPC__c === null || value.ProductUPC__c === "n/a" ? "--" : value.ProductUPC__c}</td>
                              <td>{value.usdRetail__c.includes("$") ? `$${listPrice}` : `$${Number(value.usdRetail__c).toFixed(2)}`}</td>
                              <td>
                                $ {(true && inputPrice || inputPrice == 0) ? (<><input type="number" placeholder={Number(inputPrice).toFixed(2)} className={styles.customPriceInput} onKeyUp={(e) => { onPriceChangeHander(value, e.target.value) }}
                                 id="input_limit"name="input_limit" value={inputLimit} onChange={handleNameChange} /></>) : salesPrice}
                              </td>
                              <td>{value.Min_Order_QTY__c || 0}</td>
                              <td>
                                <QuantitySelector
                                  min={value.Min_Order_QTY__c || 0}
                                  onChange={(quantity) => {
                                    onQuantityChange(value, quantity);
                                  }}
                                  value={
                                    Object.values(orders)?.find(
                                      (order) =>
                                        order.product.Id === value.Id &&
                                        order.manufacturer.name === value.ManufacturerName__c &&
                                        order.account.name === localStorage.getItem("Account")
                                    )?.quantity
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </CollapsibleRow>
                    );
                  })}{" "}
                </tbody>
              </>
            ) : (
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="flex justify-start items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">No Data Found</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default Accordion;
