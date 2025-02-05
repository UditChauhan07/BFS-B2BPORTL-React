import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getBrandPaymentDetails, GetAuthData , originAPi , getPaymentLinkDetails} from '../../lib/store';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // Create a separate component for handling checkout
import Loading from '../Loading';
import Swal from 'sweetalert2';
function PaymentLink() {
    const [keys, setKeys] = useState({ pk: null, sk: null });
    const [clientSecret, setClientSecret] = useState(null);
    const [orderData , setOrderData] = useState()
     const [token , setToken ] = useState()
    const[ isPageLoad , setIsPageLoad ] = useState(false)
     const { order_Id, randomToken } = useParams()
     const fullUrl = window.location.href;
     const checkUrl = ()=>{
        if(fullUrl !== orderData?.PBL_Status__c){
            Swal.fire({
                title: 'Error',
                text: 'This URL does not exists for the payment!',
                icon: 'Error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(() => {
                setIsPageLoad(false)
                window.location.href = window.location.origin + "/";
        });
        }
        else{
            setIsPageLoad(true)
        }
     }
     useEffect(()=>{
     checkUrl()

     },[])
  
    const fetchBrandDetails = async () => {
        try {
            const user = await GetAuthData();
            setToken(user.x_access_token)
            const brandRes = await getBrandPaymentDetails({
                key: user.x_access_token,
                Id: orderData?.ManufacturerId__c,
                AccountId: orderData?.Account_ID__c,
            });

            const pk = brandRes?.brandDetails?.Stripe_Publishable_key_test__c;
            const sk = brandRes?.brandDetails?.Stripe_Secret_key_test__c;
            // console.log(pk , sk , "branddetails")
            setKeys({ pk, sk });

            if (pk) {
                loadPaymentIntent(pk, sk);
            }
        } catch (error) {
            console.error("Error fetching brand details:", error);
        }
    };
    const getOrderDetails = async ()=>{
        const user = await GetAuthData();
        let res = await getPaymentLinkDetails({ Id : order_Id  , key :  user?.x_access_token})
        // console.log({res})
        if(res?.success === false){
            Swal.fire({
                title: 'Error',
                text: 'Either Payment has already been made for this order. Or  This order does not exist.',
                icon: 'warning',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(() => {
                
                window.location.href = window.location.origin + "/";
        });

        }
       
        setOrderData(res.data?.[0])
        
    }
    useEffect(()=>{
        getOrderDetails()
    }, [])
    const shipping_cost = orderData?.Shipment_cost__c ? parseInt(orderData?.Shipment_cost__c) : 0 
    const totalAmount = orderData?.Amount + shipping_cost
    // console.log({totalAmount})
    const loadPaymentIntent = async (pk, sk) => {
        try {
            const response = await fetch(`${originAPi}/stripe/payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalAmount,
            paymentId: sk,
            orderId : order_Id , 
            access_token : token
                }),
            });

            const data = await response.json();
            // console.log({data})
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        } catch (error) {
            console.error("Error loading payment intent:", error);
        }
    };
   
    const stripePromise = keys.pk ? loadStripe(keys.pk) : null;
    // console.log(stripePromise)
   
    useEffect(() => {
        if (orderData) {
            fetchBrandDetails();
            
        }
    }, [orderData]);
    return (
        <div>
            
            {stripePromise && clientSecret && isPageLoad? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret = {clientSecret} orderData = {orderData} amount = {totalAmount}/>
                </Elements>
            ) : (
                <div style={{
                    display: "flex",
                    height : "100vh",
                    alignItems : "center",
                    justifyContent : "center"
                }}>
                    <Loading/>
                </div>
                
            )}
        </div>
    );
}

export default PaymentLink;
