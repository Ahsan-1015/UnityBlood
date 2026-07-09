import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import districts from "../../data/districts.json";
import upazillas from "../../data/upazillas.json";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import DotLoading from "./DotLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes, faSave, faUser, faEnvelope, faTint, faMapMarkerAlt, faShieldAlt } from "@fortawesome/free-solid-svg-icons";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const allDistricts = districts[2]?.data || [];
const allUpazillas = upazillas[2]?.data || [];

export default function Profile() {
  const { user, updateProfileInfo } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [district, setDistrict] = useState({});
  const [loading, setLoading] = useState(false);
  const [districtUpazillas, setDistrictUpazillas] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  const [isEditable, setIsEditable] = useState(false);
  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/user?email=${user?.email}`)
        .then((res) => {
          setUserData(res?.data);
          setPhotoURL(res?.data?.image || "");
          const selectedDistrict = allDistricts.find(
            (item) => item.name === res?.data?.district
          );
          setDistrict(selectedDistrict || {});
          if (selectedDistrict) {
            const filteredUpazillas = allUpazillas.filter(
              (item) => item.district_id === selectedDistrict.id
            );
            setDistrictUpazillas(filteredUpazillas);
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [user?.email, axiosSecure]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDistrict = (e) => {
    const selectedId = e.target.value;
    const selectedDistrict = allDistricts.find(
      (item) => item.id === selectedId
    );
    setDistrict(selectedDistrict || {});
    const filteredUpazillas = allUpazillas.filter(
      (item) => item.district_id === selectedId
    );
    setDistrictUpazillas(filteredUpazillas);
  };

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;

    const formData = new FormData();
    formData.append("image", photo);

    try {
      let finalImageUrl = photoURL;

      if (photo) {
        const response = await axios.post(image_hosting_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          finalImageUrl = response.data.data.display_url;
        }
      }

      const updatedInfo = {
        name: form.name.value,
        bloodGroup: form.bloodGroup.value,
        district: district.name || userData.district,
        upazilla: form.upazilla.value,
        image: finalImageUrl,
      };

      await updateProfileInfo(updatedInfo.name, updatedInfo.image);
      const res = await axiosSecure.patch(
        `/user-update/${userData._id}`,
        updatedInfo
      );
      if (res?.data?.modifiedCount) {
        Swal.fire({
          icon: "success",
          title: "Profile updated successfully!",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPhotoURL(updatedInfo.image);
          toggleEdit();
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "No changes made",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header section */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your account settings and blood donor information</p>
        </div>
        <div>
          <button
            type="button"
            onClick={toggleEdit}
            className={`btn-ghost flex items-center gap-2 ${
              isEditable ? "text-red-500 hover:text-red-600" : "text-emerald-500 hover:text-emerald-600"
            }`}
          >
            <FontAwesomeIcon icon={isEditable ? faTimes : faEdit} />
            {isEditable ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>
      </div>

      {userData && Object.keys(userData).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Card Left: User details avatar overview */}
          <div className="db-card p-6 flex flex-col items-center text-center">
            <div className="relative mb-6 group">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-red-500/20 dark:ring-red-500/10 p-1 bg-white/10">
                <img
                  src={photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-slate-900 ${
                userData.status === "Active" ? "bg-emerald-500" : "bg-red-500"
              }`} />
            </div>

            <h3 className="text-xl font-bold db-text">{userData.name}</h3>
            <p className="text-sm db-text-muted mt-1 flex items-center gap-1.5 justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-red-500" />
              {userData.email}
            </p>

            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40">
                <span className="text-xs font-semibold db-text-muted">Status</span>
                <span className={`badge ${
                  userData.status === "Active" ? "badge-active" : "badge-blocked"
                }`}>
                  {userData.status}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40">
                <span className="text-xs font-semibold db-text-muted">Blood Group</span>
                <span className="badge badge-done">
                  <FontAwesomeIcon icon={faTint} className="text-red-500 mr-1" />
                  {userData.bloodGroup}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40">
                <span className="text-xs font-semibold db-text-muted">Role</span>
                <span className="badge badge-pending capitalize">
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-1 text-amber-500" />
                  {userData.role}
                </span>
              </div>
            </div>
          </div>

          {/* Card Right: Information Form */}
          <div className="db-card p-6 lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <DotLoading />
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="db-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      defaultValue={userData.name}
                      readOnly={!isEditable}
                      className={`db-input ${!isEditable ? "db-input-ro" : ""}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="db-label">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      readOnly
                      className="db-input db-input-ro"
                      required
                    />
                  </div>
                  <div>
                    <label className="db-label">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      defaultValue={userData.bloodGroup}
                      disabled={!isEditable}
                      className="db-select"
                      required
                    >
                      <option value="" disabled>Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="db-label">
                      District
                    </label>
                    <select
                      name="district"
                      defaultValue={district?.id || ""}
                      onChange={handleDistrict}
                      disabled={!isEditable}
                      className="db-select"
                      required
                    >
                      <option value="" disabled>Select District</option>
                      {allDistricts.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="db-label">
                      Upazilla
                    </label>
                    <select
                      name="upazilla"
                      defaultValue={userData?.upazilla || ""}
                      disabled={!isEditable}
                      className="db-select"
                      required
                    >
                      <option value="" disabled>Select Upazilla</option>
                      {districtUpazillas.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isEditable && (
                  <div>
                    <label className="db-label">
                      Profile Photo (Leave empty to keep current)
                    </label>
                    <input
                      name="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-500/10 file:text-red-500 hover:file:bg-red-500/20 db-input"
                    />
                  </div>
                )}

                {isEditable && (
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="btn-red flex items-center gap-2">
                      <FontAwesomeIcon icon={faSave} />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
