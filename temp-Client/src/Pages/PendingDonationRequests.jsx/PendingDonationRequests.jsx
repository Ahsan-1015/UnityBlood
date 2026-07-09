import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaHospital, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function PendingDonationRequests() {
  const axiosPublic = useAxiosPublic();
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    axiosPublic.get("/pending-donation-requests").then((res) => {
      setPendingRequests(res.data);
    });
  }, [axiosPublic]);

  return (
    <main className="bg-slate-50">
      <section className="bg-[#fff7f5] border-b border-red-100">
        <div className="container mx-auto px-6 py-14">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Donation requests
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Pending blood donation requests
              </h1>
              <p className="mt-3 max-w-2xl leading-8 text-slate-600">
                Review urgent requests by blood group, hospital, date, and
                location before opening the full request.
              </p>
            </div>
            <div className="rounded-lg border border-red-100 bg-white px-5 py-4 shadow-sm">
              <p className="text-3xl font-extrabold text-red-600">
                {pendingRequests.length}
              </p>
              <p className="text-sm font-bold text-slate-600">Open requests</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {pendingRequests.length < 1 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-950">
              No pending donation requests found
            </h2>
            <p className="mt-3 text-slate-600">
              New requests will appear here when recipients publish them.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
              <table className="min-w-full">
                <thead className="bg-teal-950 text-left text-sm uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-5 py-4">Recipient</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Hospital</th>
                    <th className="px-5 py-4">Blood</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Time</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequests.map((request) => (
                    <tr key={request._id} className="transition hover:bg-red-50/50">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {request.recipientName}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {request.district}, {request.upazilla}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {request.hospital}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-red-600 px-3 py-1 font-extrabold text-white">
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{request.date}</td>
                      <td className="px-5 py-4 text-slate-600">{request.time}</td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/donation-request-details/${request._id}`}
                          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:hidden">
              {pendingRequests.map((request) => (
                <article
                  key={request._id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-950">
                        {request.recipientName}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-slate-600">
                        <FaMapMarkerAlt className="text-red-600" />
                        {request.district}, {request.upazilla}
                      </p>
                    </div>
                    <span className="rounded-md bg-red-600 px-3 py-1 font-extrabold text-white">
                      {request.bloodGroup}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 text-slate-600">
                    <p className="flex items-center gap-2">
                      <FaHospital className="text-teal-700" />
                      {request.hospital}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-teal-700" />
                      {request.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock className="text-teal-700" />
                      {request.time}
                    </p>
                  </div>
                  <Link
                    to={`/donation-request-details/${request._id}`}
                    className="mt-5 inline-flex w-full justify-center rounded-md bg-teal-700 px-4 py-3 font-bold text-white transition hover:bg-teal-800"
                  >
                    View Details
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
