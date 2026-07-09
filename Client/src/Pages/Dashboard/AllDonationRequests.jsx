import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAdmin from "../../hooks/useAdmin";
import useAllDonationRequests from "../../hooks/useAllDonationRequests";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DotLoading from "../Shared/DotLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faEye,
  faCheck,
  faTimes,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function AllDonationRequests() {
  const axiosSecure = useAxiosSecure();
  const [isAdmin] = useAdmin();
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: donationRequestsDB = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["donationRequestsDB"],
    queryFn: useAllDonationRequests(),
  });

  const handleDone = (id) => {
    axiosSecure
      .patch(`/request-status-update/${id}`, { status: "done" })
      .then(() => {
        refetch();
        Swal.fire({
          icon: "success",
          title: "Donation Complete!",
          text: "Status updated successfully.",
          background: document.documentElement.classList.contains("dark")
            ? "#1e293b"
            : "#fff",
          color: document.documentElement.classList.contains("dark")
            ? "#f1f5f9"
            : "#0f172a",
          showConfirmButton: false,
          timer: 1200,
        });
      });
  };

  const handleCancel = (id) => {
    axiosSecure
      .patch(`/request-status-update/${id}`, { status: "canceled" })
      .then(() => {
        refetch();
        Swal.fire({
          icon: "info",
          title: "Canceled!",
          text: "Donation status canceled.",
          background: document.documentElement.classList.contains("dark")
            ? "#1e293b"
            : "#fff",
          color: document.documentElement.classList.contains("dark")
            ? "#f1f5f9"
            : "#0f172a",
          showConfirmButton: false,
          timer: 1200,
        });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/requestDelete/${id}`).then(() => {
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Your donation request has been deleted.",
            icon: "success",
            background: document.documentElement.classList.contains("dark")
              ? "#1e293b"
              : "#fff",
            color: document.documentElement.classList.contains("dark")
              ? "#f1f5f9"
              : "#0f172a",
          });
        });
      }
    });
  };

  const filteredRequests = (
    statusFilter === "all"
      ? donationRequestsDB
      : donationRequestsDB.filter((req) => req.donationStatus === statusFilter)
  )
    .slice()
    .sort((a, b) => {
      const aTime = new Date(
        a.createdAt || a.updatedAt || a._id?.$oid || 0,
      ).getTime();
      const bTime = new Date(
        b.createdAt || b.updatedAt || b._id?.$oid || 0,
      ).getTime();
      return bTime - aTime;
    });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>All Donation Requests</h1>
          <p>
            Manage, track, verify or delete all blood donation requests
            submitted by users
          </p>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-red-500 text-sm" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="db-select !py-1.5 !px-3 text-xs w-40"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <DotLoading />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="db-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 text-2xl">
            🩸
          </div>
          <h3 className="text-lg font-bold db-text">
            No Donation Requests Found
          </h3>
          <p className="text-sm db-text-muted mt-1 max-w-md">
            There are currently no blood donation requests matching the selected
            filter status.
          </p>
        </div>
      ) : (
        <div className="db-table-wrap bg-white dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="db-table">
              <thead>
                <tr>
                  <th className="db-th">Recipient</th>
                  <th className="db-th">Location</th>
                  <th className="db-th">Date & Time</th>
                  <th className="db-th">Blood Group</th>
                  <th className="db-th">Donor Info</th>
                  <th className="db-th">Status</th>
                  <th className="db-th text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y db-border">
                {filteredRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="db-tr transition-colors duration-150"
                  >
                    {/* Recipient */}
                    <td className="db-td font-semibold db-text">
                      {item.recipientName}
                    </td>

                    {/* Location */}
                    <td className="db-td text-xs db-text-muted">
                      {item.upazilla},{" "}
                      <span className="font-semibold db-text">
                        {item.district}
                      </span>
                    </td>

                    {/* Date / Time */}
                    <td className="db-td text-xs">
                      <div className="db-text font-medium">
                        {format(new Date(item.date), "dd MMM yyyy")}
                      </div>
                      <div className="db-text-muted mt-0.5">{item.time}</div>
                    </td>

                    {/* Blood Group */}
                    <td className="db-td">
                      <span className="w-9 h-9 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 dark:text-red-400 font-extrabold flex items-center justify-center text-xs">
                        {item.bloodGroup}
                      </span>
                    </td>

                    {/* Donor Details */}
                    <td className="db-td text-xs">
                      {item.donorName ? (
                        <div>
                          <div className="db-text font-semibold">
                            {item.donorName}
                          </div>
                          <div className="db-text-muted mt-0.5">
                            {item.donorEmail}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="db-td">
                      <span
                        className={`badge ${
                          item.donationStatus === "done"
                            ? "badge-done"
                            : item.donationStatus === "canceled"
                              ? "badge-canceled"
                              : item.donationStatus === "inprogress"
                                ? "badge-inprogress"
                                : "badge-pending"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.donationStatus === "done"
                              ? "bg-green-500"
                              : item.donationStatus === "canceled"
                                ? "bg-red-500"
                                : item.donationStatus === "inprogress"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-amber-500 animate-ping"
                          }`}
                        />
                        {item.donationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="db-td text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.donationStatus === "done" ? (
                          <button
                            onClick={() => handleCancel(item._id)}
                            className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center transition-all duration-200"
                            title="Cancel Request"
                          >
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-xs"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDone(item._id)}
                            className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center transition-all duration-200"
                            title="Complete Request"
                          >
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-xs"
                            />
                          </button>
                        )}
                        <Link to={`/dashboard/request/edit/${item._id}`}>
                          <button
                            className="w-8 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 dark:text-sky-400 flex items-center justify-center transition-all duration-200"
                            title="Edit"
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-xs"
                            />
                          </button>
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center transition-all duration-200"
                            title="Delete"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="text-xs"
                            />
                          </button>
                        )}
                        <Link to={`/dashboard/request/view/${item._id}`}>
                          <button
                            className="w-8 h-8 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all duration-200"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-xs" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
