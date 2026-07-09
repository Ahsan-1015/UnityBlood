import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaUser,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";

export default function DonationRequestsDetails() {
  const { userInfo } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: donationRequest = {}, refetch } = useQuery({
    queryKey: ["donationRequest", params.id],
    queryFn: () =>
      axiosSecure.get(`/donationRequest/${params.id}`).then((res) => res.data),
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmDonation = () => {
    axiosSecure
      .patch(`/request-status-update/${donationRequest._id}`, {
        status: "inprogress",
        donorName: userInfo?.name,
        donorEmail: userInfo?.email,
      })
      .then(() => {
        refetch();
      });
    closeModal();
  };

  const statusClass =
    donationRequest.donationStatus === "pending"
      ? "bg-amber-100 text-amber-800"
      : "bg-teal-100 text-teal-800";

  const detailItems = [
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: `${donationRequest.district || ""}, ${
        donationRequest.upazilla || ""
      }`,
    },
    { icon: FaHospital, label: "Hospital", value: donationRequest.hospital },
    { icon: FaCalendarAlt, label: "Date", value: donationRequest.date },
    { icon: FaClock, label: "Time", value: donationRequest.time },
    { icon: FaUser, label: "Requester", value: donationRequest.requesterName },
    {
      icon: FaEnvelope,
      label: "Requester Email",
      value: donationRequest.requesterEmail,
    },
  ];

  return (
    <main className="bg-slate-50">
      <section className="bg-[#fff7f5] border-b border-red-100">
        <div className="container mx-auto px-6 py-14">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Request details
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
                {donationRequest.recipientName || "Donation Request"}
              </h1>
              <p className="mt-3 max-w-2xl leading-8 text-slate-600">
                Check the request information carefully before confirming your
                donation support.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-red-100 bg-white p-4 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-red-600 text-white">
                <FaTint />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-500">Blood Group</p>
                <p className="text-2xl font-extrabold text-red-600">
                  {donationRequest.bloodGroup}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-extrabold text-slate-950">
                Request information
              </h2>
              <span
                className={`inline-flex rounded-md px-3 py-1 text-sm font-extrabold capitalize ${statusClass}`}
              >
                {donationRequest.donationStatus}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {detailItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-teal-700">
                      <Icon />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-500">{label}</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {value || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">
                Recipient message
              </p>
              <p className="mt-2 leading-8 text-slate-700">
                {donationRequest.message || "No message provided."}
              </p>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-950">
              Ready to donate?
            </h2>
            <p className="mt-3 leading-8 text-slate-600">
              Confirming will mark this request as in progress with your donor
              name and email.
            </p>
            <button
              onClick={openModal}
              className="mt-6 w-full rounded-md bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
            >
              Donate Now
            </button>
          </aside>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-slate-950">
              Confirm your donation
            </h2>
            <p className="mt-2 text-slate-600">
              Your profile information will be attached to this request.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={userInfo?.name || ""}
                  readOnly
                  className="mt-2 block w-full rounded-md border border-slate-300 bg-slate-50 p-3 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={userInfo?.email || ""}
                  readOnly
                  className="mt-2 block w-full rounded-md border border-slate-300 bg-slate-50 p-3 text-slate-700"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDonation}
                  className="rounded-md bg-teal-700 px-4 py-2 font-bold text-white transition hover:bg-teal-800"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
