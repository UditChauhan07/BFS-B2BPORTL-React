import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import Swal from 'sweetalert2';
import './style.css';

function CheckoutForm({ clientSecret, orderData, amount }) {
    const [email, setEmail] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [reload, setReload] = useState(false);
    const [saveInfo, setSaveInfo] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    // useEffect(() => {
    //     const handleKeyDown = (event) => {
    //         if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
    //             event.preventDefault();
    //             alert(
    //                 "Page refresh is disabled during payment. The page that you're looking for used information that you entered. Returning to that page might cause any action you took to be repeated."
    //             );
    //         }
    //     };

    //     const handleBeforeUnload = (event) => {
    //         if (!reload) {
    //             event.preventDefault();
    //             event.returnValue =
    //                 "Page refresh is disabled during payment. Are you sure you want to leave?";
    //         }
    //     };

    //     document.addEventListener("keydown", handleKeyDown);
    //     window.addEventListener("beforeunload", handleBeforeUnload);

    //     return () => {
    //         document.removeEventListener("keydown", handleKeyDown);
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, []);



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
            // setReload(true);
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

    const handleCheckboxChange = () => {
        setSaveInfo(!saveInfo);
    };

    const handleCheckboxLabelClick = () => {
        setSaveInfo(!saveInfo);
    };

    return (
        <div className="full-section">
            {/* Left Side: Order Summary */}
            <div className="detail-section">
                <div className="detailed-sub-section">
                    <p className="orderData-info"><strong>{orderData?.Account.Name}</strong> </p>
                    <p className="orderData-info"><strong>Manufacturer</strong><span>{orderData?.ManufacturerName__c}</span> </p>
                    <p className="orderData-info"><strong>PO Number</strong> <span>{orderData?.PO_Number__c}</span> </p>
                    <p className="orderData-info"><strong>Shipping Address</strong> <span>{orderData?.Shipping_Street__c}, {orderData?.Shipping_City__c}, {orderData?.Shipping_State__c} {orderData?.Shipping_Country__c} {orderData?.Shipping_Zip__c}</span>  </p>

                    <p className="pay-button">Pay</p>
                    <h1 className="">${amount}</h1>
                    <p className="orderData-info"><strong>Order Shipment Cost via [{orderData?.Shipping_method__c}]</strong> <span> ${orderData?.Shipment_cost__c ? orderData?.Shipment_cost__c : 0}</span> </p>
                </div>
            </div>

            {/* Right Side: Checkout Form */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <button className="text-lg w-full bg-green-500 text-black py-2 rounded-lg mb-4">Pay with <b>Link</b></button>
                <p className="text-center text-gray-500">Or pay with card</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Manage Email Input */}
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    
                    <div className="border p-3 rounded-lg">
                        <label className="block text-gray-600 mb-1">Card information</label>
                        <CardNumberElement className="w-full p-2 border rounded-lg" />
                    </div>
                    
                    <div className="flex space-x-4">
                        <div className="border p-3 rounded-lg w-1/2">
                            <label className="block text-gray-600 mb-1">MM / YY</label>
                            <CardExpiryElement className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="border p-3 rounded-lg w-1/2">
                            <label className="block text-gray-600 mb-1">CVC</label>
                            <CardCvcElement className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>

                    {/* Manage Cardholder Name Input */}
                    <input 
                        type="text" 
                        placeholder="Cardholder name" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={cardholderName} 
                        onChange={(e) => setCardholderName(e.target.value)} 
                        required 
                    />

                    <select className="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select country</option>
                        {[
                            "United States", "Canada", "India", "United Kingdom", "Australia", "Germany", "France", "Japan", "China", "Brazil", "South Africa"
                        ].map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={saveInfo}
                            onChange={handleCheckboxChange} 
                        />
                        <label 
                            className="text-gray-600 cursor-pointer"
                            onClick={handleCheckboxLabelClick}
                        >
                            Securely save my information for 1-click checkout
                        </label>
                    </div>
                    
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