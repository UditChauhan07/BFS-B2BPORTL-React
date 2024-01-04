import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

const BagContext = createContext();

const BagProvider = ({ children }) => {
  const [orders, setOrders] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(0);

  useEffect(() => {
    // Manually calculates the order quantity from order state
    let orderQuantity = 0;
    Object.values(orders)?.forEach((order) => {
      orderQuantity += order.quantity;
    });
    setOrderQuantity(orderQuantity);
  }, [orders]);

  useEffect(() => {
    // Update the local storage whenever the order state is changed
    if (Object.keys(orders)?.length) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    // Gets the orders from local storage on initial render
    const fetchedOrders = localStorage.getItem("orders");
    if (fetchedOrders) {
      setOrders(JSON.parse(fetchedOrders));
    }
  }, []);

  const addOrder = (product, quantity, discount) => {
    setOrders((prev) => {
      const obj = { ...prev };
      obj[product.Id] = parseOrderObjectWithDiscount(
        product,
        quantity,
        discount
      );
      return obj;
    });
  };

  const parseOrderObjectWithDiscount = (product, quantity, discount) => {
    return {
      quantity: quantity,
      product,
      discount: {
        MinOrderAmount: discount.MinOrderAmount,
        margin: discount.margin,
        sample: discount.sample,
        testerMargin: discount.testerMargin,
        testerproductLimit: discount.testerproductLimit,
      },
      retailer: localStorage.getItem("Account"),
      brand: localStorage.getItem("manufacturer"),
      productType:
        product.Category__c === "PREORDER" ? "pre-order" : "wholesale",
    };
  };

  return (
    <BagContext.Provider
      value={{
        orders,
        setOrders,
        orderQuantity,
        setOrderQuantity,
        addOrder,
      }}
    >
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => useContext(BagContext);

export default BagProvider;
