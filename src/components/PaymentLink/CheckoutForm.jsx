import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import Swal from 'sweetalert2';
import './style.css';
import visa from './Images/visa.svg'
import amex from'./Images/amex.svg'
import mastercard from './Images/mastercard.svg'
import AllRegions from "./AllRegions";
function CheckoutForm({ clientSecret, orderData, amount }) {
    const [email, setEmail] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [reload, setReload] = useState(false);
    const [saveInfo, setSaveInfo] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         if (!reload) {
    //             event.preventDefault();
    //             event.returnValue =
    //                 "Page refresh is disabled during payment. Are you sure you want to leave?";
    //         }
    //     };

    //     window.addEventListener("beforeunload", handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, [reload]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardNumberElement = elements.getElement(CardNumberElement);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: cardholderName,
                    email: email,
                },
            },
        });

        if (error) {
            console.error(error.message);
        } else {
            setReload(true);
            Swal.fire({
                title: 'Payment Successful!',
                text: 'Your payment is successful for this order',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                window.location.href = window.location.origin + "/dashboard";
            });
        }
    };

 

    return (
        <div className="full-section">
            {/* Left Side: Order Summary */}
            <div className="detail-section">
                <div className="detailed-sub-section">
                    <p className="orderData-info accountNAME"><strong>{orderData?.Account.Name}</strong> </p>
                    <p className="orderData-info manufacter1 "><strong>Manufacturer</strong><span>{orderData?.ManufacturerName__c}</span> </p>
                    <p className="orderData-info manufacter1"><strong>PO Number</strong> <span>{orderData?.PO_Number__c}</span> </p>
                    <p className="orderData-info manufacter1"><strong>Shipping Address</strong> <span>{orderData?.Shipping_Street__c}, {orderData?.Shipping_City__c}, {orderData?.Shipping_State__c} {orderData?.Shipping_Country__c} {orderData?.Shipping_Zip__c}</span>  </p>

                   
                    
                    <p className="orderData-info manufacter1"><strong>Order Shipment Cost via [{orderData?.Shipping_method__c}]</strong> <span> $&nbsp;{orderData?.Shipment_cost__c ? orderData?.Shipment_cost__c : 0}</span> </p>
                    <p className="orderData-info manufacter1"><strong>Product Amount </strong> <span>$&nbsp;{orderData?.Amount}</span> </p>
                    <p className="pay-button orderData-info manufacter1 "><strong>Pay</strong> <span> $&nbsp;{amount}</span></p>
                </div>
            </div>

            {/* Right Side: Checkout Form */}
            <div className="bg-white  rounded-lg p-6 w-full max-w-md payment-section">
                <button className="text-lg w-full  text-black py-2 rounded-lg mb-4 pay-green">Pay with <b>Card</b></button>

                <div class="Divider"><hr></hr><p class="Divider-Text Text Text-color--gray400 Text-fontSize--14 Text-fontWeight--400"><span class="DividerText">Or pay with card</span></p></div>
               
                <form onSubmit={handleSubmit} className="mt-4 space-y-4 paymentL">
                    {/* Manage Email Input */}
                    <label>Email
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    </label>
                    
                   
                        <label className="block text-gray-600 mb-1 labeREl">Card information
                        <CardNumberElement className="w-full p-2  carBor1" /> 
                    <div className="imgControl"> 
                    <img src={visa}/><img src={amex}/><img src={mastercard}/>
                    </div>
                    
                        <div className="CardElem">
                        
                            <CardExpiryElement className="w-50 p-2 carBor" />
                       
                       
                            <CardCvcElement className="w-50 p-2 carBor2" />
                            </div>
                            </label>
                        
                   

                    {/* Manage Cardholder Name Input */}
                    <label class="CardholderName"> CardholderName
                    <input 
                        type="text" 
                        placeholder="Cardholder name" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={cardholderName} 
                        onChange={(e) => setCardholderName(e.target.value)} 
                        required 
                    />
                    </label>

                    <AllRegions/>

                  <label className="TermAndCondition">
                    <input type="checkbox"/>
                    Please agree with term and condition 
                  </label>
                    
                   
                    
                    <button 
                        type="submit" 
                        disabled={!stripe} 
                        className={`w-full ${!stripe ? 'bg-gray-400' : 'bg-blue-600'} text-white py-2 rounded-lg`}
                    >
                        Pay
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckoutForm;