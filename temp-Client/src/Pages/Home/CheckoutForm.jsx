import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useContext, useEffect, useState, useRef } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";

export default function CheckoutForm() {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const amountInputRef = useRef(null);

  const handleAmountChange = (event) => {
    event.preventDefault();
    const amountInput = amountInputRef.current.value;
    const amount = parseFloat(amountInput);
    if (!isNaN(amount) && amount > 0) {
      setPaymentAmount(amount);
    } else {
      setPaymentAmount(null);
      amountInputRef.current.value = "";
      setError("Please enter a valid amount.");
    }
  };

  useEffect(() => {
    if (paymentAmount) {
      axiosSecure
        .post("/create-payment-intent", {
          donationAmount: paymentAmount,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, paymentAmount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setPaymentAmount(null);
    } else {
      setError("");
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      if (paymentIntent.status === "succeeded") {
        setTransactionId(paymentIntent.id);

        const payment = {
          name: user.displayName,
          email: user.email,
          amount: paymentAmount,
          transactionId: paymentIntent.id,
          date: new Date(),
        };

        const res = await axiosSecure.post("/payments", payment);
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Payment successful!",
            showConfirmButton: false,
            timer: 1500,
          });
        }

        amountInputRef.current.value = "";
        setPaymentAmount(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="amount" className="text-sm font-bold text-slate-700">
        Donation Amount
      </label>
      <div className="mb-5 mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className="w-full rounded-md border border-slate-300 p-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          name="amount"
          type="number"
          placeholder="Enter your donation amount here"
          ref={amountInputRef}
        />
        <button
          onClick={handleAmountChange}
          className="rounded-md bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
        >
          Set Amount
        </button>
      </div>

      <label htmlFor="card-details" className="text-sm font-bold text-slate-700">
        Card Details
      </label>
      <CardElement
        className="my-2 rounded-md border border-slate-300 p-3"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button
        className="mt-4 rounded-md bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Pay
      </button>
      {error && <p className="mt-4 font-bold text-red-600">{error}</p>}
      {transactionId && (
        <p className="mt-4 rounded-md bg-teal-50 p-3 font-bold text-teal-800">
          Your transaction Id:{" "}
          <span className="font-bold">{transactionId}</span>
        </p>
      )}
    </form>
  );
}
