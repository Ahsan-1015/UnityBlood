import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DotLoading from "../Shared/DotLoading";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheckCircle,
  faUserShield,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";

export default function AllUsers() {
  const axiosSecure = useAxiosSecure();

  const {
    data: allUsers = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await axiosSecure.get("/allUsers");
      return [...(response.data || [])].sort((a, b) => {
        const aTime = new Date(
          a.createdAt || a.updatedAt || a._id?.$oid || 0,
        ).getTime();
        const bTime = new Date(
          b.createdAt || b.updatedAt || b._id?.$oid || 0,
        ).getTime();
        return bTime - aTime;
      });
    },
  });

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleBlock = async (id) => {
    try {
      await axiosSecure.patch(`/user-update/status/${id}`, {
        status: "Blocked",
      });
      await refetch();
      showAlert("success", "Blocked!", "User status updated to Blocked.");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await axiosSecure.patch(`/user-update/status/${id}`, {
        status: "Active",
      });
      await refetch();
      showAlert("success", "Unblocked!", "User status updated to Active.");
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const handleVolunteer = async (id) => {
    try {
      await axiosSecure.patch(`/user-update/role/${id}`, { role: "Volunteer" });
      await refetch();
      showAlert("success", "Role Updated!", "User is now a Volunteer.");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleAdmin = async (id) => {
    try {
      await axiosSecure.patch(`/user-update/role/${id}`, { role: "Admin" });
      await refetch();
      showAlert("success", "Role Updated!", "User is now an Admin.");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDonor = async (id) => {
    try {
      await axiosSecure.patch(`/user-update/role/${id}`, { role: "Donor" });
      await refetch();
      showAlert("success", "Role Updated!", "User is now a Donor.");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const normalizeRole = (role) => role?.toString().trim().toLowerCase();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="page-header">
        <h1>All Users Management</h1>
        <p>
          Monitor user registration roles, profile details, and account active
          states
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <DotLoading />
        </div>
      ) : (
        <div className="db-table-wrap bg-white dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="db-table">
              <thead>
                <tr>
                  <th className="db-th">Avatar</th>
                  <th className="db-th">User Profile</th>
                  <th className="db-th">Role</th>
                  <th className="db-th">Account Status</th>
                  <th className="db-th text-center">Manage Role & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y db-border">
                {allUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="db-tr transition-colors duration-150"
                  >
                    {/* User Avatar */}
                    <td className="db-td">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-red-500/10">
                        <img
                          src={
                            user.image ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                          }
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Email / Name */}
                    <td className="db-td">
                      <div>
                        <div className="font-semibold db-text text-sm">
                          {user.name}
                        </div>
                        <div className="text-xs db-text-muted mt-0.5">
                          {user.email}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="db-td">
                      <span
                        className={`badge ${
                          user.role === "Admin"
                            ? "badge-done"
                            : user.role === "Volunteer"
                              ? "badge-pending"
                              : "badge-draft"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="db-td">
                      <span
                        className={`badge ${
                          user.status === "Active"
                            ? "badge-active"
                            : "badge-blocked"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "Active"
                              ? "bg-green-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="db-td text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {normalizeRole(user.role) !== "admin" && (
                          <button
                            onClick={() => handleAdmin(user._id)}
                            className="btn-ghost py-1 px-3 text-xs flex items-center gap-1 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400"
                            title="Make Admin"
                          >
                            <FontAwesomeIcon
                              icon={faUserShield}
                              className="text-[10px]"
                            />
                            Admin
                          </button>
                        )}
                        {normalizeRole(user.role) === "volunteer" && (
                          <button
                            onClick={() => handleDonor(user._id)}
                            className="btn-ghost py-1 px-3 text-xs flex items-center gap-1 hover:bg-indigo-500/10 hover:text-indigo-500 dark:hover:text-indigo-400"
                            title="Make Donor"
                          >
                            <FontAwesomeIcon
                              icon={faUserGraduate}
                              className="text-[10px]"
                            />
                            Donor
                          </button>
                        )}
                        {normalizeRole(user.role) !== "volunteer" && (
                          <button
                            onClick={() => handleVolunteer(user._id)}
                            className="btn-ghost py-1 px-3 text-xs flex items-center gap-1 hover:bg-sky-500/10 hover:text-sky-500 dark:hover:text-sky-400"
                            title="Make Volunteer"
                          >
                            <FontAwesomeIcon
                              icon={faUserGraduate}
                              className="text-[10px]"
                            />
                            Volunteer
                          </button>
                        )}
                        {user.status !== "Active" ? (
                          <button
                            onClick={() => handleUnblock(user._id)}
                            className="btn-ghost py-1 px-3 text-xs flex items-center gap-1 hover:bg-green-500/10 hover:text-green-500 dark:hover:text-green-400"
                            title="Unblock User"
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-[10px]"
                            />
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(user._id)}
                            className="btn-ghost py-1 px-3 text-xs flex items-center gap-1 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
                            title="Block User"
                          >
                            <FontAwesomeIcon
                              icon={faBan}
                              className="text-[10px]"
                            />
                            Block
                          </button>
                        )}
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
