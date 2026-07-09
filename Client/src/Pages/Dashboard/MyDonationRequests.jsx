import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye, faCheck, faTimes, faTint } from "@fortawesome/free-solid-svg-icons";
import DotLoading from "../Shared/DotLoading";

export default function MyDonationRequests() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axiosSecure
      .get(`/allDonationRequests?email=${user?.email}`)
      .then((res) => {
        setTableData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [axiosSecure, user?.email]);

  const handleDone = (id) => {
    axiosSecure
      .patch(`/request-status-update/${id}`, { status: "done" })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Marked as Done!",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      });
  };

  const handleCancel = (id) => {
    axiosSecure
      .patch(`/request-status-update/${id}`, { status: "canceled" })
      .then(() => {
        Swal.fire({
          icon: "info",
          title: "Canceled!",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
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
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/requestDelete/${id}`)
          .then(() => {
            setTableData((prevData) =>
              prevData.filter((item) => item._id !== id)
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your donation request has been deleted.",
              icon: "success",
              background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
              color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
            });
          });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>My Donation Requests</h1>
          <p>View, update status, and manage the blood donation requests you have created</p>
        </div>
        <div>
          <Link to="/dashboard/createDonation">
            <button className="btn-red flex items-center gap-2">
              <FontAwesomeIcon icon={faTint} />
              Create Request
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <DotLoading />
        </div>
      ) : tableData.length === 0 ? (
        <div className="db-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 text-2xl">🩸</div>
          <h3 className="text-lg font-bold db-text">No Donation Requests Yet</h3>
          <p className="text-sm db-text-muted mt-1 max-w-md">
            You haven't created any donation requests yet. Click the button above to request blood.
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
                  <th className="db-th">Donor Information</th>
                  <th className="db-th">Status</th>
                  <th className="db-th text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y db-border">
                {tableData.map((item) => (
                  <tr key={item._id} className="db-tr transition-colors duration-150">
                    {/* Recipient */}
                    <td className="db-td font-semibold db-text">
                      {item.recipientName}
                    </td>

                    {/* Location */}
                    <td className="db-td text-xs db-text-muted">
                      {item.upazilla}, <span className="font-semibold db-text">{item.district}</span>
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
                          <div className="db-text font-semibold">{item.donorName}</div>
                          <div className="db-text-muted mt-0.5">{item.donorEmail}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="db-td">
                      <span className={`badge ${
                        item.donationStatus === "done"
                          ? "badge-done"
                          : item.donationStatus === "canceled"
                          ? "badge-canceled"
                          : item.donationStatus === "inprogress"
                          ? "badge-inprogress"
                          : "badge-pending"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.donationStatus === "done"
                            ? "bg-green-500"
                            : item.donationStatus === "canceled"
                            ? "bg-red-500"
                            : item.donationStatus === "inprogress"
                            ? "bg-blue-500 animate-pulse"
                            : "bg-amber-500 animate-ping"
                        }`} />
                        {item.donationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="db-td text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {item?.donationStatus === "inprogress" && (
                          <>
                            <button
                              onClick={() => handleDone(item._id)}
                              className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center transition-all duration-200"
                              title="Mark as Done"
                            >
                              <FontAwesomeIcon icon={faCheck} className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleCancel(item._id)}
                              className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center transition-all duration-200"
                              title="Cancel"
                            >
                              <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            </button>
                          </>
                        )}
                        <Link to={`/dashboard/request/edit/${item._id}`}>
                          <button
                            className="w-8 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 dark:text-sky-400 flex items-center justify-center transition-all duration-200"
                            title="Edit Request"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center transition-all duration-200"
                          title="Delete Request"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                        </button>
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