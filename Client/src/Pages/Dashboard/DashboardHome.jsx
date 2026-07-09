import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChartLine,
  FaClock,
  FaDollarSign,
  FaHandHoldingHeart,
  FaTrashAlt,
  FaUsers,
} from "react-icons/fa";
import { FiEdit2, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAdmin from "../../hooks/useAdmin";
import useAllDonationRequests from "../../hooks/useAllDonationRequests";
import useAllFunding from "../../hooks/useAllFunding";
import useAllUsers from "../../hooks/useAllUsers";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Chart from "./Chart";

export default function DashboardHome() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [tableData, setTableData] = useState([]);
  const allUsers = useAllUsers();
  const [allFunding] = useAllFunding();

  const fundingSum = allFunding.reduce((acc, item) => acc + item.amount, 0);
  const activeUsersCount = allUsers.filter(
    (user) => user?.status?.toLowerCase() !== "blocked",
  ).length;

  const { data: donationRequestsDB = [] } = useQuery({
    queryKey: ["donationRequestsDB"],
    queryFn: useAllDonationRequests(),
  });

  const { userInfo } = useContext(AuthContext);
  const [isAdmin] = useAdmin();

  useEffect(() => {
    axiosSecure
      .get(`/donationRequests?email=${user?.email}`)
      .then((res) => {
        setTableData(res.data);
      })
      .catch(() => {});
  }, [axiosSecure, user?.email]);

  const handleDone = (id) => {
    axiosSecure
      .patch(`/request-status-update/${id}`, { status: "done" })
      .then(() => {
        window.location.reload();
      });
  };

  const handleCancel = (id) => {
    axiosSecure
      .patch(`/request-status-update/${id}`, { status: "canceled" })
      .then(() => {
        window.location.reload();
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: "#0f172a",
      color: "#f1f5f9",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/requestDelete/${id}`).then(() => {
          setTableData((prevData) =>
            prevData.filter((item) => item._id !== id),
          );
          Swal.fire({
            title: "Deleted!",
            text: "Your request has been deleted.",
            icon: "success",
            background: "#0f172a",
            color: "#f1f5f9",
          });
        });
      }
    });
  };

  const statusConfig = {
    inprogress: {
      label: "In Progress",
      className:
        "bg-amber-400/15 text-amber-400 border border-amber-400/25 ring-1 ring-amber-400/20",
      dot: "bg-amber-400",
    },
    done: {
      label: "Completed",
      className:
        "bg-emerald-400/15 text-emerald-400 border border-emerald-400/25 ring-1 ring-emerald-400/20",
      dot: "bg-emerald-400",
    },
    canceled: {
      label: "Cancelled",
      className:
        "bg-red-400/15 text-red-400 border border-red-400/25 ring-1 ring-red-400/20",
      dot: "bg-red-400",
    },
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    to,
    gradient,
    iconBg,
    glowColor,
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group dark:border-slate-700 dark:bg-slate-900/80`}
    >
      {/* Gradient glow effect */}
      <div
        className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-3xl ${glowColor} group-hover:opacity-30 transition-opacity duration-500`}
      ></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div
            className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}
          >
            <Icon className="text-white text-xl" />
          </div>
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-lg ${gradient} text-white opacity-80`}
          >
            Live
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-slate-500 text-sm font-medium dark:text-slate-400">
            {label}
          </p>
          <p className="text-4xl font-black text-slate-900 tracking-tight dark:text-white">
            {value}
          </p>
        </div>
      </div>

      <Link
        to={to}
        className={`flex items-center justify-between px-6 py-3.5 bg-gradient-to-r ${gradient} text-white/90 hover:text-white text-sm font-semibold transition-all duration-300 group/link`}
      >
        <span>View Details</span>
        <FaArrowRight className="text-xs transform group-hover/link:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );

  return (
    <div className="space-y-8">
      {user ? (
        <>
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl dark:border-slate-700 dark:bg-slate-950">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-500/10 rounded-full blur-3xl dark:bg-red-500/10"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/10"></div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-red-500/50 shadow-lg shadow-red-500/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-500/30">
                      {user?.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 shadow-lg"></span>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-0.5 dark:text-slate-400">
                    Welcome back 👋
                  </p>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    {user?.displayName}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-red-500/15 text-red-600 text-xs font-semibold border border-red-500/25 dark:text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    {isAdmin
                      ? "Administrator"
                      : userInfo?.role || "Blood Donor"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs mb-1 dark:text-slate-400">
                  Today
                </p>
                <p className="text-slate-900 font-semibold text-sm dark:text-white">
                  {format(new Date(), "EEEE, MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Overview Metrics */}
          {isAdmin || userInfo?.role === "Volunteer" ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <StatCard
                    icon={FaUsers}
                    label="Total Users"
                    value={allUsers.length || 0}
                    to="/dashboard/all-users"
                    gradient="from-blue-600 to-blue-500"
                    iconBg="bg-gradient-to-br from-blue-500 to-blue-700"
                    glowColor="bg-blue-500"
                  />
                  <StatCard
                    icon={FaHandHoldingHeart}
                    label="Donation Requests"
                    value={donationRequestsDB?.length || 0}
                    to="/dashboard/all-donation-requests"
                    gradient="from-red-600 to-red-500"
                    iconBg="bg-gradient-to-br from-red-500 to-red-700"
                    glowColor="bg-red-500"
                  />
                  <StatCard
                    icon={FaDollarSign}
                    label="Total Funding"
                    value={`$${fundingSum.toLocaleString()}`}
                    to="/payment"
                    gradient="from-emerald-600 to-emerald-500"
                    iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
                    glowColor="bg-emerald-500"
                  />
                  <StatCard
                    icon={FaClock}
                    label="Average Response"
                    value="18 min"
                    to="/dashboard/all-donation-requests"
                    gradient="from-violet-600 to-violet-500"
                    iconBg="bg-gradient-to-br from-violet-500 to-violet-700"
                    glowColor="bg-violet-500"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-xl p-6 dark:border-slate-700 dark:bg-slate-900/80">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-slate-500 text-sm font-medium dark:text-slate-400">
                        Dashboard Overview
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Quick Insights
                      </h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Updated now
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-slate-500 text-sm dark:text-slate-400">
                            Active Users
                          </p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                            {activeUsersCount || 0}
                          </p>
                        </div>
                        <FaChartLine className="text-3xl text-red-500" />
                      </div>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Users that have interacted with the platform in the last
                        7 days.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-slate-500 text-sm dark:text-slate-400">
                            Donation Fulfillment
                          </p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                            {donationRequestsDB?.filter(
                              (req) => req.donationStatus === "done",
                            ).length || 0}
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              {" "}
                              / {donationRequestsDB?.length || 0}
                            </span>
                          </p>
                        </div>
                        <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          {donationRequestsDB?.length
                            ? `${Math.round((donationRequestsDB.filter((req) => req.donationStatus === "done").length / donationRequestsDB.length) * 100)}%`
                            : "0%"}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Completed requests out of total donor requests created
                        by your team.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-slate-500 text-sm dark:text-slate-400">
                            Funding Raised
                          </p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                            ${fundingSum.toLocaleString()}
                          </p>
                        </div>
                        <FaDollarSign className="text-3xl text-emerald-500" />
                      </div>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Aggregate donations received across all campaigns and
                        requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                  Analytics
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
            </>
          ) : (
            /* Donor View — Donation Requests Table */
            <>
              {tableData.length < 1 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-slate-200/60 bg-white/90 dark:border-slate-700 dark:bg-slate-900/70">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 dark:bg-slate-800/70">
                    <FaHandHoldingHeart className="text-slate-500 text-2xl dark:text-slate-300" />
                  </div>
                  <p className="text-slate-700 font-semibold text-lg mb-2 dark:text-slate-200">
                    No donation requests yet
                  </p>
                  <p className="text-slate-600 text-sm mb-6 dark:text-slate-400">
                    Create your first blood donation request to get started
                  </p>
                  <Link
                    to="/dashboard/createDonation"
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                  >
                    + Create Donation Request
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-slate-900 font-bold text-lg dark:text-white">
                        My Recent Donation Requests
                      </h3>
                      <p className="text-slate-500 text-sm mt-0.5 dark:text-slate-400">
                        {tableData.length} request
                        {tableData.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                    <Link
                      to="/dashboard/my-donation-requests"
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                    >
                      View All <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 shadow-xl dark:border-slate-700 dark:bg-slate-900/70">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          {[
                            "Recipient",
                            "Location",
                            "Date",
                            "Blood Group",
                            "Donor Info",
                            "Status",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              className="py-4 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700">
                        {tableData.map((item, idx) => (
                          <tr
                            key={item._id}
                            className="hover:bg-slate-100/80 dark:hover:bg-white/5 transition-colors duration-200 group"
                          >
                            <td className="py-4 px-5">
                              <span className="text-slate-900 font-semibold text-sm dark:text-white">
                                {item.recipientName}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="text-slate-500 text-sm dark:text-slate-300">
                                {item.upazilla}, {item.district}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="text-slate-500 text-sm dark:text-slate-300">
                                {format(new Date(item.date), "MMM dd, yyyy")}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/20">
                                {item.bloodGroup}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <div className="text-sm">
                                <p className="text-slate-900 font-medium dark:text-white">
                                  {item.donorName || "—"}
                                </p>
                                <p className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                  {item.donorEmail || "Awaiting donor"}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              {(() => {
                                const cfg =
                                  statusConfig[item.donationStatus] ||
                                  statusConfig.canceled;
                                return (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.className}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                    ></span>
                                    {cfg.label}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item?.donationStatus === "inprogress" && (
                                  <>
                                    <button
                                      onClick={() => handleDone(item._id)}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition-all duration-200"
                                    >
                                      Done
                                    </button>
                                    <button
                                      onClick={() => handleCancel(item._id)}
                                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all duration-200"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                                <Link
                                  to={`/dashboard/request/edit/${item._id}`}
                                >
                                  <button className="p-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-all duration-200">
                                    <FiEdit2 className="text-xs" />
                                  </button>
                                </Link>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 transition-all duration-200"
                                >
                                  <FaTrashAlt className="text-xs" />
                                </button>
                                <Link
                                  to={`/dashboard/request/view/${item._id}`}
                                >
                                  <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all duration-200 dark:bg-slate-700/40 dark:hover:bg-slate-600/40 dark:text-slate-200 dark:hover:text-white dark:border-slate-700">
                                    <FiEye className="text-xs" />
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

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                  Analytics
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
            </>
          )}

          {/* Chart */}
          <Chart />
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-red-500/50 animate-pulse"></div>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Loading dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
