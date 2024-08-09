import { useEffect, useState } from "react";
import { GetAuthData, getProductDetails, getRetailerList } from "../lib/store";
import Loading from "../components/Loading";
import { useBag } from "../context/BagContext";
import ModalPage from "../components/Modal UI";
import ProductDetailCard from "../components/ProductDetailCard";
import { CloseButton } from "../lib/svg";

const ProductDetails = ({ productId, setProductDetailId, isAddtoCart = true, AccountId = null, ManufacturerId = null, toRedirect = "/my-retailers" }) => {
    const { orders, setOrders, setOrderQuantity, addOrder, setOrderProductPrice } = useBag();
    const [product, setProduct] = useState({ isLoaded: false, data: [], discount: {} });
    const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
    const [replaceCartProduct, setReplaceCartProduct] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(true);
    // const [accountList,setAccountList]=useState([])
    // const [overAct,setOverAct] = useState();
    useEffect(() => {
        if (productId) {
            setIsModalOpen(true)
            setProduct({ isLoaded: false, data: [], discount: {} })
            GetAuthData().then((user) => {
                // ||overAct?.value
                let rawData = { productId: productId, key: user.x_access_token, salesRepId: user?.Sales_Rep__c, accountId: AccountId }
                // console.log({rawData});
                getProductDetails({ rawData }).then((productRes) => {
                    // console.log({productRes});
                    // if(!AccountId && !overAct){
                    //     getRetailerList({key: user.x_access_token,userId:user?.Sales_Rep__c,}).then((retailerRes)=>{
                    //         setAccountList(retailerRes.data)
                    //     }).catch(e=>console.error(e))
                    // }
                    setProduct({ isLoaded: true, data: productRes.data, discount: productRes.discount })
                }).catch((proErr) => {
                    console.log({ proErr });
                })
            }).catch((err) => {
                console.log({ err });
            })
        }
    }, [productId])
    //overAct
    if (!productId) return null;


    const orderSetting = (element, quantity) => {
        setReplaceCartModalOpen(false);
        addOrder(element, quantity, product.discount);
    };
    const onQuantityChange = (element, quantity, salesPrice = null, discount = null) => {
        element.salesPrice = salesPrice;
        if (Object.values(orders).length) {
            if (
                Object.values(orders)[0]?.manufacturer?.id === ManufacturerId &&
                Object.values(orders)[0].account.id === AccountId &&
                Object.values(orders)[0].productType === (element.Category__c === "PREORDER" ? "pre-order" : "wholesale")
            ) {
                orderSetting(element, quantity);
                setReplaceCartModalOpen(false);
            } else {
                setReplaceCartModalOpen(true);
                setReplaceCartProduct({ product: element, quantity });
            }
        } else {
            orderSetting(element, quantity);
        }
    };
    const onPriceChangeHander = (element, price = '0') => {
        if (price == '') price = 0;
        setOrderProductPrice(element, price)
    }
    const replaceCart = () => {
        localStorage.removeItem("orders");
        setReplaceCartModalOpen(false);
        setOrderQuantity(0);
        setOrders({});
        addOrder(replaceCartProduct.product, replaceCartProduct.quantity, product.discount);
    };
    let styles = {
        btn: { color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: 600, lineHeight: 'normal', letterSpacing: '1.4px', backgroundColor: '#000', width: '100px', height: '30px', cursor: 'pointer' }
    }
    let orderofThisProduct = orders[product?.data?.Id];
    if (orderofThisProduct?.manufacturer?.name == product?.data?.ManufacturerName__c && orderofThisProduct?.account?.name == localStorage.getItem("Account")) {
    }

    return (
        <>
            {isModalOpen && <ModalPage
                open
                content={
                    <div className="d-flex flex-column gap-3" style={{ width: '75vw' }}>
                        <div style={{
                            position: 'sticky',
                            top: '-20px',
                            background: '#fff',
                            zIndex: 1,
                            padding: '15px 0 0 0'
                        }}>
                            <div className="d-flex align-items-center justify-content-between" style={{ minWidth: '75vw' }}>
                                <h1 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] m-0 p-0">Product Details</h1>
                                <button type="button" onClick={() => { setIsModalOpen(false); setProductDetailId(null) }}>
                                    <CloseButton />
                                </button>
                            </div>
                            <hr />
                        </div>
                        {replaceCartModalOpen ? (
                            <ModalPage
                                open
                                content={
                                    <div className="d-flex flex-column gap-3">
                                        <h2>Warning</h2>
                                        <p>
                                            Adding this item will replace <br></br> your current cart
                                        </p>
                                        <div className="d-flex justify-content-around ">
                                            <button style={styles.btn} onClick={replaceCart}>
                                                OK
                                            </button>
                                            <button style={styles.btn} onClick={() => setReplaceCartModalOpen(false)}>
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
                        {!product?.isLoaded ? <Loading /> :
                            <ProductDetailCard product={product} orders={orders} onQuantityChange={onQuantityChange} onPriceChangeHander={onPriceChangeHander} isAddtoCart={isAddtoCart} AccountId={AccountId} toRedirect={toRedirect} />}
                            {/* accountList={accountList} setOverAct={setOverAct} overAct={overAct} */}
                    </div>
                }
                onClose={() => {
                    setIsModalOpen(false); setProductDetailId(null);
                }}
            />}
        </>
    );

    // return (
    //     <AppLayout>
    //         {replaceCartModalOpen ? (
    //             <ModalPage
    //                 open
    //                 content={
    //                     <div className="d-flex flex-column gap-3">
    //                         <h2 className={`${styles.warning} `}>Warning</h2>
    //                         <p className={`${styles.warningContent} `}>
    //                             Adding this item will replace <br></br> your current cart
    //                         </p>
    //                         <div className="d-flex justify-content-around ">
    //                             <button className={`${styles.modalButton}`} onClick={replaceCart}>
    //                                 OK
    //                             </button>
    //                             <button className={`${styles.modalButton}`} onClick={() => setReplaceCartModalOpen(false)}>
    //                                 Cancel
    //                             </button>
    //                         </div>
    //                     </div>
    //                 }
    //                 onClose={() => {
    //                     setReplaceCartModalOpen(false);
    //                 }}
    //             />
    //         ) : null}
    //         {!product?.isLoaded ? <Loading /> :
    //             <ProductDetailCard product={product} orders={orders} onQuantityChange={onQuantityChange} onPriceChangeHander={onPriceChangeHander} />}
    //     </AppLayout>
    // );
};
export default ProductDetails;