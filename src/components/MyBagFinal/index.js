/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import Styles from "./Styles.module.css";
import QuantitySelector from "../BrandDetails/Accordion/QuantitySelector";
import { Link, useNavigate } from "react-router-dom";
import { GetAuthData, OrderPlaced, POGenerator, ShareDrive, fetchBeg, getProductImageAll, getBrandPaymentDetails, originAPi, getProductList, FreeShipHandler } from "../../lib/store";
import { useCart } from "../../context/CartContext";
import OrderLoader from "../loader";
import ModalPage from "../Modal UI";
import StylesModal from "../Modal UI/Styles.module.css";
import ProductDetails from "../../pages/productDetails";
import Loading from "../Loading";
import { DeleteIcon } from "../../lib/svg";
import ImageHandler from "../loader/ImageHandler";
import ShipmentHandler from "./ShipmentHandler";
import CustomAccordion from "../CustomAccordian/CustomAccordain";
import StripePay from "../StripePay";
import Swal from "sweetalert2";
import { BiCheckboxChecked } from "react-icons/bi";
import { useMemo } from "react";
function MyBagFinal({ showOrderFor }) {
  let Img1 = "/assets/images/dummy.png";
  const { order, updateProductQty, removeProduct, deleteOrder, keyBasedUpdateCart, getOrderTotal } = useCart();
  const navigate = useNavigate();
  const [orderDesc, setOrderDesc] = useState(null);
  const [PONumber, setPONumber] = useState(null);
  const [total, setTotal] = useState(0);
  const [buttonActive, setButtonActive] = useState(false);
  const [bagValue, setBagValue] = useState(fetchBeg({}));
  const [isOrderPlaced, setIsOrderPlaced] = useState(0);
  const [isPOEditable, setIsPOEditable] = useState(false);
  const [PONumberFilled, setPONumberFilled] = useState(true);
  const [clearConfim, setClearConfim] = useState(false);
  const [orderStatus, setorderStatus] = useState({ status: false, message: "" });
  const [productDetailId, setProductDetailId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [salesRepData, setSalesRepData] = useState({ Name: null, Id: null });
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { getOrderQuantity, updateProductPrice } = useCart();
  const [alert, setAlert] = useState(0);
  const [limitCheck, setLimitCheck] = useState(false);
  const [orderShipment, setOrderShipment] = useState([]);
  const [isSelect, setIsSelect] = useState(false);
  const [intentRes, setIntentRes] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [isPlayAble, setIsPlayAble] = useState(0);
  const [greenStatus, setGreenStatus] = useState(null);
  const [isAccordianOpen, setIsAccordianOpen] = useState(false);
  const [detailsAccordian, setDetailsAccordian] = useState(true);
  const [orderId, setOrderId] = useState();
  const [paymentAccordian, setPaymentAccordian] = useState(false);
  const [qunatityChange, setQuantityChange] = useState();
  const [paymentDetails, setPaymentDetails] = useState({
    PK_KEY: null,
    SK_KEY: null,
  });
  const [outoOfStockAllow, setOutOfStockAllow] = useState(false);
  const [note, setNote] = useState()
  const [isPayNow, setIsPayNow] = useState(false);
  const [desc, setDesc] = useState()
  const [freeShipping, setFreeShipping] = useState(false);
  const [ownShipping, setOwnShipping] = useState({});
  const handleNameChange = (event) => {
    const limit = 12;
    const value = event.target.value.slice(0, limit); // Restrict to 11 characters
    setPONumber(value);
  };
  useEffect(() => {
    if (order?.Account?.id && order?.Manufacturer?.id && order?.items?.length > 0) {
      setButtonActive(true);
    }
    setTotal(getOrderTotal() ?? 0);
  }, [order, buttonActive]);
  const editValue = localStorage.getItem("isEditaAble")
  const fetchBrandPaymentDetails = async () => {

    try {
      let id = order?.Manufacturer?.id;
      let AccountID = order?.Account?.id;

      const user = await GetAuthData();
      if (id && AccountID) {
        const brandRes = await getBrandPaymentDetails({
          key: user.x_access_token,
          Id: id,
          AccountId: AccountID,
        });

        setIntentRes(brandRes);

        brandRes.accountManufacturerData.map((item) => setPaymentType(item.Payment_Type__c));

        // Check for null keys
        if (!brandRes?.brandDetails.Stripe_Secret_key_test__c || !brandRes?.brandDetails.Stripe_Publishable_key_test__c) {
          setIsPlayAble(0);
          console.log("Brand payment details are missing, skipping payment processing.");
          return {
            PK_KEY: null,
            SK_KEY: null,
          };
        } else {
          const terms = [
            "Net",
            "terms:2%",
            "TERMS:215",
            "TERMS:210",
            "TERMS:245",
            "TERMS:410",
            "TERMS:50%",
            "TERMS:505",
            "TERMS:AFT",
            "TERMS:AMA",
            "TERMS:BR",
            "TERMS:BRA",
            "TERMS:CAT",
            "TERMS:COD",
            "TERMS:F30",
            "TERMS:FA3",
            "TERMS:GIF",
            "TERMS:KLA",
            "TERMS:LOG",
            "TERMS:N12",
            "TERMS:N15",
            "TERMS:N20",
            "TERMS:N30",
            "TERMS:N45",
            "TERMS:N60",
            "TERMS:N75",
            "TERMS:N90",
            "TERMS:NO",
            "TERMS:NT",
            "TERMS:OFF",
            "TERMS:PAY",
            "TERMS:SHO",
            "TERMS:UNK",
            "Check",
            "Wire"
          ];
          // Check paymentIntent status and payment types
          const paymentTypes = brandRes.accountManufacturerData.map((item) => item.Payment_Type__c);
          console.log(paymentTypes , "payment types")
          const hasNetPaymentType = paymentTypes.some((type) => terms.some((term) => type?.toLowerCase().startsWith(term.toLowerCase())));
          if (!hasNetPaymentType) {
            setIsPlayAble(1);
          }
        }

        let paymentIntent = await fetch(`${originAPi}/stripe/payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: "100",
            paymentId: brandRes?.brandDetails.Stripe_Secret_key_test__c,
          }),
        });

        setGreenStatus(paymentIntent.status);


        setIsLoading(false);

        setPaymentDetails({
          PK_KEY: brandRes?.brandDetails.Stripe_Publishable_key_test__c,
          SK_KEY: brandRes?.brandDetails.Stripe_Secret_key_test__c,
        });

        return {
          PK_KEY: brandRes?.brandDetails.Stripe_Publishable_key_test__c,
          SK_KEY: brandRes?.brandDetails.Stripe_Secret_key_test__c,
        };
      }
    } catch (error) {
      console.log("Error fetching brand payment details:", error);
      setIsLoading(false);
      return null;
    }
  };

  const FetchFreeShipHandler = () => {
    if (order?.Manufacturer?.id) {
      FreeShipHandler({ brandId: order?.Manufacturer?.id }).then((res) => {
        setFreeShipping(res)
        freeShippingHandler({ shipObj: res, orderObj: order })
      })
    }
  }
  const FetchPoNumber = async () => {
    setIsLoading(true)
    if (order?.Account?.id && order?.Manufacturer?.id) {
      try {
        const res = await POGenerator();

        if (res?.poNumber) {

          if (res?.shippingMethod) {
            setOwnShipping(res?.shippingMethod);
          }
          if (res?.freeShipping && iswholeSale) {
            setFreeShipping(res?.freeShipping)
            freeShippingHandler({shipObj:res?.freeShipping,orderObj:order})
          }
          if (res?.address || res?.brandShipping) {
            let tempOrder = order.Account;
            if (res?.address) {
              tempOrder = { ...tempOrder, address: res?.address };
            }
            if (res.checkBrandAllow) {
              if (res?.shippingMethod) {
                tempOrder = { ...tempOrder, shippingMethod: res?.shippingMethod };
              } else {
                if (!isSelect) {
                  tempOrder = { ...tempOrder, shippingMethod: null };
                }
              }
            } else {
              if (!isSelect) {
                tempOrder = { ...tempOrder, shippingMethod: null };
              }
            }
            keyBasedUpdateCart({ Account: tempOrder });
            if (res?.brandShipping) {
              if (res?.brandShipping.length) {
                setOrderShipment(res?.brandShipping);
              }
            }
          }
          let isPreOrder = order.items.some((product) => product.Category__c?.toUpperCase()?.includes("PREORDER") || product.Category__c?.toUpperCase()?.includes("EVENT"));
          let poInit = res.poNumber;
          if (isPreOrder) {
            poInit = `PRE-${poInit}`;
          }
          setPONumber(poInit);
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching PO number:", error);
        setIsLoading(false);
      }
    }
  };
  const freeShippingHandler = async ({ shipObj, orderObj }) => {
    // Check if the order is eligiable for shipping address
    if (shipObj && iswholeSale) {
      if (shipObj?.type) {
        let tempOrder = order.Account;
        if ((shipObj?.start && shipObj?.end) || shipObj?.amount) {
          let date = new Date();
          let start = new Date(shipObj?.start);
          let end = new Date(shipObj?.end);
          date.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);


          if (orderObj?.total >= shipObj?.amount && shipObj?.type == "Amount Based") {
            if (!order?.Account?.shippingMethod?.freeApplied) {
              // console.log("************ amount true **************");
              tempOrder.shippingMethod = {
                cal: 0,
                method: "Free Shipping",
                name: "Free Shipping",
                number: null,
                freeApplied: true
              };
              keyBasedUpdateCart({ Account: tempOrder });
            }
          } else if (date >= start && date <= end && shipObj?.type == "Date Range Based") {
            if (!order?.Account?.shippingMethod?.freeApplied) {
              // console.log("************ date true **************");
              tempOrder.shippingMethod = {
                cal: 0,
                method: "Free Shipping",
                name: "Free Shipping",
                number: null,
                freeApplied: true
              };
              keyBasedUpdateCart({ Account: tempOrder });
            }
          } else {
            if (orderObj?.Account?.shippingMethod?.freeApplied) {
              // console.log("************ escape **************");
              if (ownShipping?.number || ownShipping?.method) {
                tempOrder.shippingMethod = ownShipping
              } else {
                tempOrder.shippingMethod = null;
              }
              keyBasedUpdateCart({ Account: tempOrder });
            }
          }
        }
      } else {
        if (shipObj?.start && shipObj?.end && shipObj?.amount && false) {
          let date = new Date();
          let start = new Date(shipObj?.start);
          let end = new Date(shipObj?.end);
          date.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          let tempOrder = order.Account;
          if (orderObj?.total >= shipObj?.amount && (date >= start && date <= end)) {
            if (!orderObj?.Account?.shippingMethod?.freeApplied) {
              console.log("************ both apply **************");
              tempOrder.shippingMethod = {
                cal: 0,
                method: "FedEx",
                name: "Free Shipping",
                number: null,
                freeApplied: true
              };
              keyBasedUpdateCart({ Account: tempOrder });
            }
          } else {
            if (orderObj?.Account?.shippingMethod?.freeApplied) {
              console.log("************ escape **************");
              if (ownShipping?.number || ownShipping?.method) {
                tempOrder.shippingMethod = ownShipping
              } else {
                tempOrder.shippingMethod = null;
              }
              keyBasedUpdateCart({ Account: tempOrder });
            }
          }
        } else {
          if (orderObj?.Account?.shippingMethod?.freeApplied) {
            // console.log("************ escape **************");
            let tempOrder = order.Account;
            if (ownShipping?.number || ownShipping?.method) {
              tempOrder.shippingMethod = ownShipping
            } else {
              tempOrder.shippingMethod = null;
            }
            keyBasedUpdateCart({ Account: tempOrder });
          }
        }
      }
    } else {
      if (orderObj?.Account?.shippingMethod?.freeApplied) {
        // console.log("************ escape **************");
        let tempOrder = order.Account;
        if (ownShipping?.number || ownShipping?.method) {
          tempOrder.shippingMethod = ownShipping
        } else {
          tempOrder.shippingMethod = null;
        }
        keyBasedUpdateCart({ Account: tempOrder });
      }
    }
  }
  useEffect(() => {
    if (order?.Account?.id && order?.Manufacturer?.id) {
      fetchBrandPaymentDetails();
      if (!PONumber) {
        FetchPoNumber();
      }
    } else {
      setIsLoading(false);
      setOrderShipment([]);
      setPONumber(null)
    }
  }, [order]);


  const [productImage, setProductImage] = useState({ isLoaded: false, images: {} });
  // let total = 0;

  useEffect(() => {
    if (false) {
      let data = ShareDrive();
      if (!data) {
        data = {};
      }
      if (order) {
        if (order?.Manufacturer) {
          if (order?.Manufacturer?.id) {
            if (!data[order?.Manufacturer?.id]) {
              data[order?.Manufacturer?.id] = {};
            }
            if (Object.values(data[order.Manufacturer.id]).length > 0) {
              setProductImage({ isLoaded: true, images: data[order.Manufacturer.id] });
            } else {
              setProductImage({ isLoaded: false, images: {} });
            }
          }
        }
        if (order.items) {
          if (order.items.length > 0) {
            let productCode = "";
            order.items.map((element, index) => {
              productCode += `'${element.product?.ProductCode}'`;
              if (order.items.length - 1 != index) productCode += ", ";
            });
            getProductImageAll({ rawData: { codes: productCode } })
              .then((res) => {
                if (res) {
                  console.log({ res });
                  if (data[order.Manufacturer.id]) {
                    data[order.Manufacturer.id] = { ...data[order.Manufacturer.id], ...res };
                  } else {
                    data[order.Manufacturer.id] = res;
                  }
                  ShareDrive(data);
                  setProductImage({ isLoaded: true, images: res });
                } else {
                  setProductImage({ isLoaded: true, images: {} });
                }
              })
              .catch((err) => {
                console.log({ err });
              });
          }
        }
      }
    }
    if (order?.Account?.id && order?.Manufacturer?.id && order?.items?.length > 0 && total > 0) {
      setButtonActive(true);
    }
    if (freeShipping && iswholeSale) {
      freeShippingHandler({ shipObj: freeShipping, orderObj: order })
    }
  }, [order]);

  const [checkProduct, setCheckProduct] = useState({ beingLoading: false, isLoad: false, list: [], discount: {} });

  const CheckOutStockProduct = () => {
    if (order?.Account?.id && order?.Manufacturer?.id && order?.Account?.SalesRepId) {
      setCheckProduct(prevState => ({
        ...prevState,  // Spread the previous state to keep unchanged properties
        beingLoading: true,
        isLoad: false,
      }));

      GetAuthData().then(user => {
        let rawData = {
          key: user.access_token,
          Sales_Rep__c: order?.Account?.SalesRepId,
          Manufacturer: order.Manufacturer.id,
          AccountId__c: order.Account.id,
        };
        getProductList({ rawData }).then((list) => {

          setOutOfStockAllow((list?.discount?.portalProductManage && iswholeSale) ? true : false)
          setCheckProduct({ isLoad: true, list: list?.data?.records || [], discount: list?.discount || {} })
        }).catch((err) => {
          console.log({ err });
        })
      })
    }
  }
  console.log(order , "order")
  // useBackgroundUpdater(CheckOutStockProduct, defaultLoadTime);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsPOEditable(false);
        CheckOutStockProduct();
        FetchFreeShipHandler();
        // console.log('Page is active');
        // Check for updates or fetch data
      }
    };

    const handleFocus = () => {
      // console.log('Window is focused');
      // Maybe refresh data or resume actions
    };

    const handleBlur = () => {
      // console.log('Window is blurred');
      // Pause any ongoing activities
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);


    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  const iswholeSale = useMemo(() => {
    return order?.ordertype == "wholesale"
  }, [order])
  useEffect(() => {
    if (order?.Account?.id && order?.Manufacturer?.id && order?.Account?.SalesRepId && !checkProduct?.isLoad && !checkProduct.beingLoading) {
      CheckOutStockProduct()
    }
  }, [order])

  const orderPlaceHandler = () => {
    let OOSPIncludes = false;
    if (checkProduct.isLoad) {
      if (outoOfStockAllow && order.items.length) {
        order.items.map((product) => {
          const foundItem = checkProduct.list?.find(item => item.Id === product.Id);
          if (product.qty > (foundItem?.Available_Quantity__c || 0)) {
            OOSPIncludes = true;
          }
        })
      }
    }
    if (OOSPIncludes) {
      setConfirm(false);
      return Swal.fire({
        title: "Alert!",
        text: "You've added more products than are available in stock. Please update your cart before submitting your order.",
        icon: "warning",
        confirmButtonColor: "#000", // Black
      });
    }
    if (order?.Account?.SalesRepId) {
      setIsOrderPlaced(1);
      setConfirm(false);
      GetAuthData()
        .then((user) => {
          // let bagValue = fetchBeg()
          if (order.Account.id && order.Manufacturer.id) {
            // setButtonActive(true)
            let list = [];
            let orderType = "Wholesale Numbers";
            if (order.items.length) {
              order.items.map((product) => {
                let productCategory = product?.Category__c?.toUpperCase()?.trim();

                // Set orderType based on product category and prepend "PRE" to PONumber if "PREORDER"
                if (productCategory?.toUpperCase()?.includes("PREORDER") || productCategory?.toUpperCase()?.match("EVENT")?.length > 0) {
                  orderType = "Pre Order";
                }
                let temp = {
                  Id: product.Id,
                  ProductCode: product.ProductCode,
                  qty: product.qty,
                  price: product?.price,
                  discount: product?.discount,
                };
                list.push(temp);
              });
            }
            let begToOrder = {
              AccountId: order?.Account?.id,
              Name: order?.Account?.name,
              ManufacturerId__c: order?.Manufacturer?.id,
              PONumber: PONumber,
              desc: order?.Note,
              SalesRepId: order?.Account?.SalesRepId,
              Type: orderType,
              ShippingCity: order?.Account?.address?.city,
              ShippingStreet: order?.Account?.address?.street,
              ShippingState: order?.Account?.address?.state,
              ShippingCountry: order?.Account?.address?.country,
              ShippingZip: order?.Account?.address?.postalCode,
              ManufacturerName__c : order?.Manufacturer.name , 
              list,
              key: user.access_token,
              shippingMethod: order.Account.shippingMethod,
            };
            OrderPlaced({ order: begToOrder, cartId: order.id })
              .then((response) => {
                if (response) {
                  // console.log("response" , response.length)
                  setTimeout(async function () {
                    if (response.err) {
                      setIsOrderPlaced(0);
                      setorderStatus({ status: true, message: response.err[0].message });
                    } else {
                      await deleteOrder();

                      if (response?.orderId && typeof response.orderId == "string") {
                        setOrderId(response.orderId);
                        localStorage.setItem("OpportunityId", JSON.stringify(response.orderId));
                        setIsOrderPlaced(2);
                        window.location.href = window.location.origin + "/order-list";
                      } else {
                        setIsOrderPlaced(2);
                        navigate("/order-list");
                      }
                    }
                  }, 1000);
                }
              })
              .catch((err) => {
                console.error({ err });
              });
          }
        })
        .catch((error) => {
          console.error({ error });
        });
    } else {
      alert("no sales rep.");
    }

  };
  // console.log(order.Account.name)
  const deleteBag = () => {
    // localStorage.removeItem("AA0KfX2OoNJvz7x")
    deleteOrder()
      .then((res) => {
        setClearConfim(false);
        console.log({ res });

        if (res) {
          window.location.reload();
        }
      })
      .catch((err) => console.error({ err }));
  };

  const OrderQuantity = () => {
    return getOrderQuantity() || 0;
  };
  const onPriceChangeHander = (productId, price = "0") => {
    if (price == "") price = 0;
    updateProductPrice(productId, price || 0);
  };

  const handlePayNow = () => {
    setIsPayNow(true);
  };

  const onToggle = () => {
    setQuantityChange(false);
    setIsAccordianOpen(!isAccordianOpen);
    setDetailsAccordian(!detailsAccordian);
    setPaymentAccordian(!paymentAccordian);
  };

  const handleAccordian = () => {
    let OOSPIncludes = false;
    if (checkProduct.isLoad) {
      if (outoOfStockAllow && order.items.length) {
        order.items.map((product) => {
          const foundItem = checkProduct.list?.find(item => item.Id === product.Id);
          if (product.qty > (foundItem?.Available_Quantity__c || 0)) {
            OOSPIncludes = true;
          }
        })
      }
    }
    if (OOSPIncludes) {
      setConfirm(false);
      return Swal.fire({
        title: "Alert!",
        text: "You've added more products than are available in stock. Please update your cart before submitting your order.",
        icon: "warning",
        confirmButtonColor: "#000", // Black
      });
    }
    if (order?.items?.length) {
      if (PONumber.length) {
        if (order?.items?.length > 100) {
          setLimitCheck(true);
        } else {
          if (!order?.Account?.shippingMethod?.method && orderShipment?.length > 0) {
            setAlert(3);
            return;
          } else {
            if (order.Account.discount.MinOrderAmount > total) {
              setAlert(1);
            } else {
              setQuantityChange(true);
              setIsAccordianOpen(true);
              setDetailsAccordian(false);
              setPaymentAccordian(true);
            }
          }
        }
      } else {
        setPONumberFilled(false);
      }
    }
  };
  const handlePayLater = () => {
    setIsPayNow(false);
    setIsAccordianOpen(true);
    setDetailsAccordian(true);
  };
  useEffect(() => {
    setNote(order?.Note || ""); // Order update hone pe note set kare
  }, [order?.Note]);

  if (isOrderPlaced === 1)
    return (
      <div style={{ height: "300px" }}>
        <OrderLoader />{" "}
      </div>
    );
  return (
    <div className="mt-4">
      {isLoading ? (
        <Loading height={"50vh"} /> // Display full-page loader while data is loading
      ) : (
        <section>
          {!PONumberFilled ? (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Warning</h1>
                    <p className={` ${StylesModal.ModalContent}`}> Please Enter PO Number</p>
                    <div className="d-flex justify-content-center">
                      <button
                        className={`${StylesModal.modalButton}`}
                        onClick={() => {
                          setPONumberFilled(true);
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setPONumberFilled(true);
              }}
            />
          ) : null}
          {alert == 1 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Products of Minimum Order Amount</p>
                    {/* <p className={` ${Styles.ModalContent}`}><b>Current Order Total:</b> ${formentAcmount(orderTotal)}</p> */}
                    <div className="d-flex justify-content-center">
                      <button className={Styles.btnHolder} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => setAlert(0)}
            />
          )}
          {alert == 2 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Tester Product of Minimum Order Amount</p>
                    <div className="d-flex justify-content-center">
                      <button className={Styles.btnHolder} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setAlert(0);
              }}
            />
          )}

          {alert == 3 && (
            <ModalPage
              open
              content={
                <>
                  <div style={{ maxWidth: "309px" }}>
                    <h1 className={`fs-5 ${Styles.ModalHeader}`}>Alert!!</h1>
                    <p className={` ${Styles.ModalContent}`}>Please Select Shipping Method for this order</p>
                    <div className="d-flex justify-content-center">
                      <button className={Styles.btnHolder} onClick={() => setAlert(0)}>
                        OK
                      </button>
                    </div>
                  </div>
                </>
              }
              onClose={() => {
                setAlert(0);
              }}
            />
          )}
          <ModalPage
            open={limitCheck || false}
            content={
              <>
                <div style={{ maxWidth: "309px" }}>
                  <h1 className={`fs-5 ${Styles.ModalHeader}`}>Warning</h1>
                  <p className={` ${Styles.ModalContent}`}>Please upload file with less than 100 products</p>
                  <div className="d-flex justify-content-center">
                    <button className={StylesModal.modalButton} onClick={() => setLimitCheck(false)}>
                      OK
                    </button>
                  </div>
                </div>
              </>
            }
            onClose={() => setLimitCheck(false)}
          />
          <ModalPage
            open={confirm || false}
            content={
              <div className="d-flex flex-column gap-3">
                <h2 style={{ textDecoration: "underline" }}>Confirm</h2>
                <p>
                  Are you sure you want to generate a order?
                  <br /> This action cannot be undone.
                </p>
                <div className="d-flex justify-content-around ">
                  <button className={Styles.btnHolder} onClick={orderPlaceHandler}>
                    Submit
                  </button>
                  <button className={Styles.btnHolder} onClick={() => setConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            }
            onClose={() => {
              setConfirm(false);
            }}
          />
          {clearConfim ? (
            <ModalPage
              open
              content={
                <div className="d-flex flex-column gap-3">
                  <h2 className={`${Styles.warning} `}>Warning</h2>
                  <p className={`${Styles.warningContent} `}>Are you Sure you want to clear bag?</p>
                  <div className="d-flex justify-content-around ">
                    <button className={Styles.btnHolder} onClick={deleteBag}>
                      Yes
                    </button>
                    <button className={Styles.btnHolder} onClick={() => setClearConfim(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              }
              onClose={() => {
                setClearConfim(false);
              }}
            />
          ) : null}
          {orderStatus?.status ? (
            <ModalPage
              open
              content={
                <div className="d-flex flex-column gap-3" style={{ maxWidth: "700px" }}>
                  <h2 className={`${Styles.warning} `}>SalesForce Error</h2>
                  <p className={`${Styles.warningContent} `} style={{ lineHeight: "22px" }}>
                    {orderStatus.message}
                  </p>
                  <div className="d-flex justify-content-around ">
                    <button
                      style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        fontFamily: "Montserrat-600",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: "600",
                        height: "30px",
                        letterSpacing: "1.4px",
                        lineHeight: "normal",
                        width: "100px",
                      }}
                      onClick={() => setorderStatus({ status: false, message: "" })}
                    >
                      OK
                    </button>
                  </div>
                </div>
              }
              onClose={() => {
                setorderStatus({ status: false, message: "" });
              }}
            />
          ) : null}
          <div className="">
            <div>
              <div className={Styles.MyBagFinalTop}>
                <div className={Styles.MyBagFinalRight}>
                  <button onClick={() => navigate("/product")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <path
                        d="M8.94284 2.27615C9.46349 1.75544 9.46349 0.911229 8.94284 0.390521C8.42213 -0.130174 7.57792 -0.130174 7.05721 0.390521L2.3911 5.05666C2.39092 5.05684 2.39128 5.05648 2.3911 5.05666L0.390558 7.05721C0.153385 7.29442 0.024252 7.59868 0.00313201 7.90895C-0.00281464 7.99562 -0.000321319 8.08295 0.010852 8.17002C0.0431986 8.42308 0.148118 8.66868 0.325638 8.87322C0.348651 8.89975 0.372651 8.92535 0.397585 8.94989L7.05721 15.6095C7.57792 16.1302 8.42213 16.1302 8.94284 15.6095C9.46349 15.0888 9.46349 14.2446 8.94284 13.7239L4.55231 9.33335H22.6667C23.4031 9.33335 24 8.73642 24 8.00002C24 7.26362 23.4031 6.66668 22.6667 6.66668H4.55231L8.94284 2.27615Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <h4>
                    {buttonActive ? (
                      <>
                        <span>
                          {" "}
                          <Link style={{ color: "#000" }} to={`/Brand/${order?.Manufacturer?.id}`}>
                            {order?.Manufacturer?.name}
                          </Link>{" "}
                          |
                        </span>
                        &nbsp;
                        <Link style={{ color: "#000" }} to={`/store/${order?.Account?.id}`}>
                          {order?.Account?.name}
                        </Link>
                      </>
                    ) : (
                      <span>Empty bag</span>
                    )}
                  </h4>
                </div>

                <div className={Styles.MyBagFinalleft}>
                  <h5>
                    PO Number{" "}
                    {!isPOEditable ? (
                      <b>
                        {buttonActive
                          ? // If it's a Pre Order and PONumber doesn't already start with "PRE", prepend "PRE"
                          PONumber
                          : "---"}
                      </b>
                    ) : (
                      <input
                        type="text"
                        value={PONumber}

                        // onChange={handleNameChange} // Correctly handles input changes
                        placeholder="Enter PO Number"
                        style={{ borderBottom: "1px solid black" }}
                        id="limit_input"
                        name="limit_input"
                        onKeyPress={(e) => {
                          if (e.key === " ") {
                            e.preventDefault(); // Prevent space character from being entered
                          }
                        }}
                        onChange={handleNameChange}
                      />
                    )}
                  </h5>

                  {!isPOEditable && !qunatityChange && order.items?.length ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none" onClick={() => setIsPOEditable(true)} style={{ cursor: "pointer" }}>
                      <path
                        d="M19.3078 10.6932V19.2841C19.3078 19.6794 18.9753 20 18.5652 20H0.742642C0.332504 20 0 19.6794 0 19.2841V2.10217C0 1.70682 0.332504 1.38627 0.742642 1.38627H9.65389C10.064 1.38627 10.3965 1.70682 10.3965 2.10217C10.3965 2.49754 10.064 2.81809 9.65389 2.81809H1.48519V18.5682H17.8226V10.6932C17.8226 10.2979 18.1551 9.97731 18.5652 9.97731C18.9753 9.97731 19.3078 10.2979 19.3078 10.6932ZM17.9926 5.11422L15.6952 2.89943L7.72487 10.5832L7.09297 13.4072L10.0223 12.7981L17.9926 5.11422ZM21 2.2148L18.7027 0L16.8541 1.78215L19.1515 3.99692L21 2.2148Z"
                        fill="black"
                      />
                    </svg>
                  ) : null}
                </div>
              </div>

              <div className={Styles.MyBagFinalMain}>
                <div className="row">
                  <div className="col-lg-7 col-md-8 col-sm-12">
                    <div className={Styles.MainBag}>
                      <h3>
                        SHOPPING BAG (<OrderQuantity />)
                      </h3>
                      <div className={Styles.scrollP}>
                        <div className={`${Styles.MainInner} overflow-auto`} style={{ minHeight: "400px" }}>
                          {order && order.items?.length > 0 ? (
                            order.items?.map((ele) => {
                              let salesPrice = ele?.price;
                              let listPrice = Number().toFixed(2);
                              if (salesPrice == "NaN") {
                                salesPrice = 0;
                              }
                              listPrice = Number(ele?.usdRetail__c?.replace("$", "").replace(",", "")).toFixed(2);
                              if (ele?.usdRetail__c.includes("$")) {
                                if (listPrice == "NaN") {
                                  listPrice = 0;
                                }
                              }
                              let errorProduct = false;
                              let stockAvailable = 0;
                              if (outoOfStockAllow) {
                                stockAvailable = checkProduct?.list?.find(item => item.Id === ele?.Id)?.Available_Quantity__c;
                                if (stockAvailable < 1) {
                                  stockAvailable = 0;
                                }
                                if (ele.qty > stockAvailable) {
                                  errorProduct = true;
                                }
                              }

                              return (
                                <div className={Styles.Mainbox} style={errorProduct ? { border: '1px solid red', borderRadius: '5px' } : {}}>
                                  <div className={Styles.Mainbox1M}>
                                    <div className={Styles.Mainbox2} style={{ cursor: "pointer" }}>
                                      <ImageHandler
                                        Id={ele.Id}
                                        width={25}
                                        onClick={() => {
                                          if (!qunatityChange) {
                                            setProductDetailId(ele?.Id);
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className={Styles.Mainbox3}>
                                      <h2
                                        onClick={() => {
                                          if (!qunatityChange) {
                                            setProductDetailId(ele?.Id);
                                          }
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {ele?.Name}&nbsp;{errorProduct ? stockAvailable ? <small style={{ color: '#c68282' }}>Hurry! Only {stockAvailable} units left in stock.</small> : <small style={{ color: '#c68282' }}>Oops! This item is currently out of stock.</small> : null}
                                      </h2>
                                      <p>
                                        <span className={Styles.Span1}>{`$${listPrice}`}</span>
                                        <span className={Styles.Span2}>
                                          {/* ${Number(salesPrice).toFixed(2)} */}
                                          <input
                                            type="number"
                                            value={salesPrice}
                                            placeholder={Number(salesPrice).toFixed(2)}
                                            className={`ms-1 ${Styles.customPriceInput}`}
                                            style={qunatityChange ? { opacity: "0.3" } : null}
                                            onChange={(e) => {
                                              if (!qunatityChange) {
                                                onPriceChangeHander(ele?.Id, e.target.value < 10 ? e.target.value.replace("0", "").slice(0, 5) : e.target.value.slice(0, 5) || 0);
                                              }
                                            }}
                                            id="limit_input"
                                            minLength={0}
                                            maxLength={5}
                                            name="limit_input"
                                          />
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className={Styles.Mainbox2M}>
                                    <div
                                      className={Styles.Mainbox4}
                                      style={qunatityChange ? { opacity: "0.3" } : null}
                                      onClick={() => {
                                        if (!qunatityChange) {
                                          if (order.items.length == 1) {
                                            setClearConfim(true);
                                          } else {
                                            removeProduct(ele.Id);
                                          }
                                        }
                                      }}
                                    >
                                      <DeleteIcon fill="red" />
                                    </div>
                                    <div className={Styles.Mainbox5} style={qunatityChange ? { opacity: "0.3" } : null}>
                                      <QuantitySelector
                                        min={ele?.Min_Order_QTY__c || 0}
                                        onChange={(quantity) => {
                                          if (!qunatityChange) {
                                            if (outoOfStockAllow) {
                                              if (stockAvailable) {
                                                if (quantity > stockAvailable && quantity > ele.qty) {
                                                  return Swal.fire({
                                                    title: "Alert!",
                                                    text: "Oops! You’re trying to add more than what’s available. We only have " + stockAvailable + " left in stock.",
                                                    confirmButtonColor: "#000", // Black
                                                  });
                                                }
                                              } else {
                                                if (quantity > ele.qty) {
                                                  return Swal.fire({
                                                    title: "Oops!",
                                                    text: "The product you're trying to add to your cart is currently out of stock. Please check back soon",
                                                    icon: "warning",
                                                    confirmButtonColor: "#000", // Black
                                                  });
                                                }
                                              }
                                            }
                                            updateProductQty(ele.Id, quantity);
                                          }
                                        }}
                                        value={ele.qty}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <>
                              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "35vh" }}>
                                No Products in Bag
                              </div>
                            </>
                          )}
                        </div>
                        <div className={Styles.TotalPricer}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h2>{order?.Account?.shippingMethod?.cal ? "Sub-" : null}Total</h2>
                            </div>
                            <div>
                              <h2>${Number(total).toFixed(2)}</h2>
                            </div>
                          </div>
                          {order.Account?.shippingMethod?.cal ? (
                            <div className="d-flex justify-content-between">
                              <div>
                                <h2 className="text-capitalize">Shipping ({order.Account.shippingMethod?.name})</h2>
                              </div>
                              <div>
                                <h2>${order.Account.shippingMethod?.cal ? Number(total * order.Account.shippingMethod?.cal).toFixed(2) : 0}</h2>
                              </div>
                            </div>
                          ) : null}
                          {order.Account?.shippingMethod?.cal ? (
                            <div className="d-flex justify-content-between">
                              <div>
                                <h2>Total</h2>
                              </div>
                              <div>
                                <h2>${Number(total + total * order.Account.shippingMethod?.cal).toFixed(2)}</h2>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-5 col-md-4 col-sm-12">     */}
                  {isPayNow ? (
                    <div className="col-lg-5 col-md-4 col-sm-12">
                      <CustomAccordion title="Shipping Address" isOpen={detailsAccordian} onToggle={onToggle} isModalOpen={isAccordianOpen}>
                        <div className={Styles.ShippControl}>
                          {/* <h2>Shipping Address</h2> */}

                          <div className={Styles.ShipAdress}>
                            {buttonActive ? (
                              <p>
                                {order?.Account?.address?.street}, {order?.Account?.address?.city} <br />
                                {order?.Account?.address?.state}, {order?.Account?.address?.country} {order?.Account?.address?.postalCode}
                                <br />
                                {order?.Account?.address?.email} {order?.Account?.address?.contact && `{ |  ${order?.Account?.address?.contact}}`}
                              </p>
                            ) : (
                              <p>No Shipping Address</p>
                            )}
                          </div>
                          {showOrderFor && salesRepData?.Id && buttonActive && (
                            <>
                              <h2>Order For</h2>
                              <div className={Styles.ShipAdress}>{userData?.Sales_Rep__c == salesRepData?.Id ? "Me" : salesRepData?.Name}</div>
                            </>
                          )}
                          {total > 0 && isPlayAble && order?.ordertype !== "pre-order" ? (
                            <div className={Styles.PaymentType}>
                              <label className={Styles.shipLabelHolder}>Select Payment Type:</label>
                              <div className={Styles.paymentButtons}>
                                <div className={`${Styles.templateHolder} ${isPayNow ? Styles.selected : null}`} onClick={handlePayNow}>
                                  {" "}
                                  <div className={`${Styles.labelHolder}`}>Pay now</div>
                                </div>
                                <div className={`${Styles.templateHolder} ${!isPayNow ? Styles.selected : null}`} onClick={handlePayLater}>
                                  <div className={`${Styles.labelHolder}`}>Pay by Link</div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          {orderShipment.length > 0 ? (
                            <div className={Styles.PaymentType}>
                              {order?.Account?.shippingMethod?.freeApplied ? (
                                <p className="d-flex align-items-center m-0"><BiCheckboxChecked size={22} />Free shipping Applied</p>
                              ) : (
                                <>
                                  <label className={Styles.shipLabelHolder}>Select Shipping method:</label>
                                  <ShipmentHandler data={orderShipment} total={total} setIsSelect={setIsSelect} />
                                </>
                              )}
                            </div>
                          ) : null}
                          <div className={Styles.ShipAdress2}>

                            <textarea onBlur={(e) => keyBasedUpdateCart({ Note: e.target.value })} readOnly={order.items?.length == 0} placeholder="NOTE" className="placeholder:font-[Arial-500] text-[14px] tracking-[1.12px] ">
                              {note}
                            </textarea>
                          </div>
                          {!PONumberFilled ? (
                            <ModalPage
                              open
                              content={
                                <div style={{ maxWidth: "309px" }}>
                                  <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Warning</h1>
                                  <p className={` ${StylesModal.ModalContent}`}>Enter PO Number</p>
                                  <div className="d-flex justify-content-center">
                                    <button className={StylesModal.modalButton} onClick={() => setPONumberFilled(true)}>
                                      OK
                                    </button>
                                  </div>
                                </div>
                              }
                              onClose={() => setPONumberFilled(true)}
                            />
                          ) : (
                            <div className={Styles.ShipBut}>
                              {isPlayAble !== true && total === 0 ? (
                                <>
                                  <button
                                    onClick={() => {
                                      if (order?.items?.length) {
                                        if (PONumber.length) {
                                          if (order?.items?.length > 100) {
                                            setLimitCheck(true);
                                          } else {
                                            if (order.Account.discount.MinOrderAmount > total) {
                                              setAlert(1);
                                            } else {
                                              if (!order?.Account?.shippingMethod?.method && orderShipment?.length > 0) {
                                                setAlert(3);
                                                return;
                                              }
                                              // if (testerInBag && order.Account.discount.testerproductLimit > total) {
                                              //   setAlert(2);
                                              // } else {
                                              setConfirm(true);
                                              // }
                                            }
                                          }
                                        } else {
                                          setPONumberFilled(false);
                                        }
                                      }
                                    }}
                                    disabled={!buttonActive}
                                  >
                                    ${Number(total + total * (order?.Account?.shippingMethod?.cal || 0)).toFixed(2)} PLACE ORDER
                                  </button>
                                </>
                              ) : (
                                <div className={Styles.ShipBut}>
                                  <button onClick={handleAccordian}>PROCEED TO PAY</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CustomAccordion>
                      {isPayNow === true && total > 0 ? (
                        <CustomAccordion title="Payment Details" isOpen={paymentAccordian} onToggle={onToggle} isModalOpen={isAccordianOpen}>
                          <StripePay
                            description={order?.Note}
                            PO_Number={PONumber}
                            PK_KEY={paymentDetails.PK_KEY}
                            SK_KEY={paymentDetails.SK_KEY}
                            amount={total + total * (order?.Account?.shippingMethod?.cal || 0)}
                            order={order}
                            PONumber={PONumber}
                            orderDesc={orderDesc}
                            AccountName={order.Account?.name}
                            AccountNumber={intentRes?.accountNumber?.Account_Number__c}
                          />
                        </CustomAccordion>
                      ) : null}

                      {isPayNow == true && total > 0 ? (
                        <p
                          className={`${Styles.ClearBag}`}
                          style={{ textAlign: "center", cursor: "pointer" }}
                          onClick={() => {
                            if (buttonActive) {
                              setClearConfim(true);
                            }
                          }}
                          disabled={!buttonActive}
                        >
                          {paymentAccordian ? null : "Clear Bag"}
                        </p>
                      ) : null}
                      {paymentAccordian && !editValue ? (
                        <p className={`${Styles.ClearBag}`} style={{ textAlign: "center", cursor: "pointer" }} onClick={onToggle}>
                          Edit Bag
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="col-lg-5 col-md-4 col-sm-12">
                      <div className={Styles.ShippControl}>
                        <h2>Shipping Address</h2>

                        <div className={Styles.ShipAdress}>
                          {buttonActive ? (
                            <p>
                              {order?.Account?.address?.street}, {order?.Account?.address?.city} <br />
                              {order?.Account?.address?.state}, {order?.Account?.address?.country} {order?.Account?.address?.postalCode}
                              <br />
                              {order?.Account?.address?.email} {order?.Account?.address?.contact && `{ |  ${order?.Account?.address?.contact}}`}
                            </p>
                          ) : (
                            <p>No Shipping Address</p>
                          )}
                        </div>
                        {showOrderFor && salesRepData?.Id && buttonActive && (
                          <>
                            <h2>Order For</h2>
                            <div className={Styles.ShipAdress}>{userData?.Sales_Rep__c == salesRepData?.Id ? "Me" : salesRepData?.Name}</div>
                          </>
                        )}
                        {total > 0 && isPlayAble && order?.ordertype !== "pre-order" ? (
                          <div className={Styles.PaymentType}>
                            <label className={Styles.shipLabelHolder}>Select Payment Type:</label>
                            <div className={Styles.paymentButtons}>
                              <div className={`${Styles.templateHolder} ${isPayNow ? Styles.selected : null}`} onClick={handlePayNow}>
                                {" "}
                                <div className={`${Styles.labelHolder}`}>Pay now</div>
                              </div>
                              <div className={`${Styles.templateHolder} ${!isPayNow ? Styles.selected : null}`} onClick={handlePayLater}>
                                <div className={Styles.labelHolder}>Pay By Link</div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {orderShipment.length > 0 ? (
                          <div className={Styles.PaymentType}>
                            {order?.Account?.shippingMethod?.freeApplied ? (
                              <p className="d-flex align-items-center m-0"><BiCheckboxChecked size={22} />Free shipping Applied</p>
                            ) : (
                              <>
                                <label className={Styles.shipLabelHolder}>Select Shipping method:</label>
                                <ShipmentHandler data={orderShipment} total={total} setIsSelect={setIsSelect} />
                              </>
                            )}
                          </div>
                        ) : null}
                        <div className={Styles.ShipAdress2}>
                          {/* <label>NOTE</label> */}
                          <textarea onBlur={(e) => keyBasedUpdateCart({ Note: e.target.value })} readOnly={order.items?.length == 0} placeholder="NOTE" className="placeholder:font-[Arial-500] text-[14px] tracking-[1.12px] ">
                            {order?.Note}
                          </textarea>
                        </div>
                        {!PONumberFilled ? (
                          <ModalPage
                            open
                            content={
                              <div style={{ maxWidth: "309px" }}>
                                <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Warning</h1>
                                <p className={` ${StylesModal.ModalContent}`}>Enter PO Number</p>
                                <div className="d-flex justify-content-center">
                                  <button className={StylesModal.modalButton} onClick={() => setPONumberFilled(true)}>
                                    OK
                                  </button>
                                </div>
                              </div>
                            }
                            onClose={() => setPONumberFilled(true)}
                          />
                        ) : (
                          <div className={Styles.ShipBut}>
                            <button
                              onClick={() => {
                                if (order?.items?.length) {
                                  if (PONumber.length) {
                                    if (order?.items?.length > 100) {
                                      setLimitCheck(true);
                                    } else {
                                      if (order.Account.discount.MinOrderAmount > total) {
                                        setAlert(1);
                                      } else {
                                        if (!order?.Account?.shippingMethod?.method && orderShipment?.length > 0) {
                                          setAlert(3);
                                          return;
                                        }
                                        // if (testerInBag && order.Account.discount.testerproductLimit > total) {
                                        //   setAlert(2);
                                        // } else {
                                        setConfirm(true);
                                        // }
                                      }
                                    }
                                  } else {
                                    setPONumberFilled(false);
                                  }
                                }
                              }}
                              disabled={!buttonActive}
                            >
                              ${Number(total + total * (order?.Account?.shippingMethod?.cal || 0)).toFixed(2)} PLACE ORDER
                            </button>
                            <p
                              className={`${Styles.ClearBag}`}
                              style={{ textAlign: "center", cursor: "pointer" }}
                              onClick={() => {
                                if (buttonActive) {
                                  setClearConfim(true);
                                }
                              }}
                              disabled={!buttonActive}
                            >
                              Clear Bag
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {productDetailId ? <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} AccountId={bagValue?.Account?.id} ManufacturerId={bagValue?.Manufacturer?.id} selectedsalesRep={order?.Account?.SalesRepId} /> : null}
    </div>
  );
}

export default MyBagFinal;
