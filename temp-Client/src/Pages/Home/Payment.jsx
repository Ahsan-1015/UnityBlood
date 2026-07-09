import { useState } from "react";
import AllFunding from "./AllFunding";
import PaymentForm from "./PaymentForm";

export default function Payment() {
  const [formOpen, setFromOpen] = useState(false);

  return (
    <main className="bg-slate-50">
      <section className="bg-[#fff7f5] border-b border-red-100">
        <div className="container mx-auto px-6 py-14">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Funding
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Support UnityBlood community work
          </h1>
          <p className="mt-3 max-w-2xl leading-8 text-slate-600">
            Contributions help campaigns, awareness, coordination, and
            life-saving donation support.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <div className="mx-auto mb-8 flex w-full max-w-md rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setFromOpen(true)}
            className={`flex-1 rounded-md px-4 py-3 font-bold transition ${
              formOpen
                ? "bg-red-600 text-white"
                : "text-slate-700 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            Make Payment
          </button>
          <button
            onClick={() => setFromOpen(false)}
            className={`flex-1 rounded-md px-4 py-3 font-bold transition ${
              !formOpen
                ? "bg-red-600 text-white"
                : "text-slate-700 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            All Funding
          </button>
        </div>

        {formOpen ? <PaymentForm /> : <AllFunding />}
      </section>
    </main>
  );
}
