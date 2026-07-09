import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";

// todo: add publishable key
const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

export default function PaymentForm() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-slate-950">
          Make a contribution
        </h2>
        <p className="mt-3 text-slate-600">
          Your support helps keep the donation network active and responsive.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
