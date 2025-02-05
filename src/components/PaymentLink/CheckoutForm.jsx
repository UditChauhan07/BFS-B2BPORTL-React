import React from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";

import Swal from 'sweetalert2';
function CheckoutForm({ clientSecret, orderData, amount }) {
    const stripe = useStripe();
    const elements = useElements();


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement,
            },
        });

        if (error) {
            console.error(error.message);
        } else {
            Swal.fire({
                title: 'Payment Successful!',
                text: 'Your payment is successful for this order',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(() => {
              
                window.location.href = window.location.origin + "/dashboard";
        });
           
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-evenly min-h-screen bg-gray-100 p-6">
            {/* Left Side: Order Summary */}

            <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3 mb-6 md:mb-0 md:mr-6 h-1s00">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <p><strong>Account Name:</strong> {orderData?.Account?.Name}</p>
                <p><strong>Manufacturer:</strong> {orderData?.ManufacturerName__c}</p>
                <p><strong>Shipping Method:</strong> {orderData?.Shipping_method__c}</p>
                <p><strong>PO Number:</strong> {orderData?.PO_Number__c}</p>
                <p><strong>Shipping Address:</strong> {orderData?.Shipping_Street__c} , {orderData?.Shipping_City__c} 
                   , {orderData?.Shipping_State__c} {orderData?.Shipping_Country__c} {orderData?.Shipping_Zip__c} </p>
            </div>

            {/* Right Side: Checkout Form */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3">
                <h2 className="text-lg font-semibold mb-2">Checkout</h2>
                <p className="text-2xl font-bold text-gray-700">${amount}</p>
                {/* <p className="text-sm text-gray-500"></p> */}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Card Number Input */}
                    <div className="border p-3 rounded-lg">
                        <label className="block text-gray-600 mb-1">Card Number</label>
                        <CardNumberElement className="w-full p-2 border rounded-lg" />
                    </div>

                    {/* Expiry and CVC Inputs */}
                    <div className="flex space-x-4">
                        <div className="border p-3 rounded-lg w-1/2">
                            <label className="block text-gray-600 mb-1">Expiration (MM/YY)</label>
                            <CardExpiryElement className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="border p-3 rounded-lg w-1/2">
                            <label className="block text-gray-600 mb-1">CVC</label>
                            <CardCvcElement className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <button
                        type="submit"
                        disabled={!stripe}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Pay
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckoutForm;
