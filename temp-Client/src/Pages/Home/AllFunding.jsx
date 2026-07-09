import { format } from "date-fns";
import { FaCalendarAlt, FaHandHoldingHeart, FaUser } from "react-icons/fa";
import useAllFunding from "../../hooks/useAllFunding";

export default function AllFunding() {
  const [allFunding] = useAllFunding();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-slate-950">
          Funding records
        </h2>
        <p className="mt-3 text-slate-600">
          Contributions from people supporting the UnityBlood mission.
        </p>
      </div>

      <div className="space-y-4">
        {allFunding.map((item) => (
          <div
            key={item._id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-lg hover:shadow-red-50"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <FaHandHoldingHeart />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-500">Amount</p>
                  <p className="text-2xl font-extrabold text-red-600">
                    USD {item.amount}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-slate-600">
                <p className="flex items-center gap-2 font-bold">
                  <FaUser className="text-teal-700" />
                  {item.name}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-700" />
                  {format(new Date(item.date), "MM-dd-yyyy")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
