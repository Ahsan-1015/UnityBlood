import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import districts from "../../data/districts.json";
import upazillas from "../../data/upazillas.json";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faInfoCircle, faUser, faEnvelope, faHospital, faMapMarkerAlt, faClock, faCalendarAlt, faComment } from "@fortawesome/free-solid-svg-icons";

const allDistricts = districts[2]?.data || [];
const allUpazillas = upazillas[2]?.data || [];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateDonation() {
  const [userInfo, setUserInfo] = useState({});
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/user?email=${user?.email}`)
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [user?.email, axiosSecure]);

  const [district1, setDistrict] = useState({});
  const [districtUpazillas, setDistrictUpazillas] = useState([]);

  const handleDistrict = (e) => {
    e.preventDefault();
    const selectedId = e.target.value;
    const selectedDistrict = allDistricts.find(
      (item) => item.id === selectedId
    );
    const upazillas = allUpazillas.filter(
      (item) => item.district_id === selectedId
    );
    setDistrict(selectedDistrict || {});
    setDistrictUpazillas(upazillas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInfo.status === "Blocked") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are blocked and cannot make blood donation requests!",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
      return;
    }
    const form = e.target;
    const donationRequest = {
      requesterPhoto: user?.photoURL,
      requesterEmail: form.requesterEmail.value,
      requesterName: form.requesterName.value,
      district: district1.name || "",
      upazilla: form.upazilla.value,
      hospital: form.hospital.value,
      recipientName: form.recipientName.value,
      bloodGroup: form.bloodGroup.value,
      fullAddress: form.fullAddress.value,
      date: form.date.value,
      time: form.time.value,
      message: form.message.value,
      donationStatus: "pending",
    };

    axiosSecure
      .post("/createDonationRequest", donationRequest)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Donation Request Created!",
          text: "The request has been listed for potential donors.",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
          showConfirmButton: false,
          timer: 2000,
        });
        form.reset();
        setDistrict({});
        setDistrictUpazillas([]);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Something went wrong! Please try again.",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
        });
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header section */}
      <div className="page-header">
        <h1>Create Donation Request</h1>
        <p>Fill out the emergency contact and requirement details to look for a matching blood donor</p>
      </div>

      {userInfo.status === "Blocked" && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
          <FontAwesomeIcon icon={faInfoCircle} className="text-lg flex-shrink-0" />
          <span className="text-sm font-semibold">
            Your account is currently Blocked. You are not allowed to submit any blood donation requests.
          </span>
        </div>
      )}

      <div className="db-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section: Requester Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="db-label flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUser} className="text-red-500" />
                Requester Name
              </label>
              <input
                type="text"
                name="requesterName"
                value={user?.displayName || ""}
                readOnly
                className="db-input db-input-ro"
              />
            </div>
            <div>
              <label className="db-label flex items-center gap-1.5">
                <FontAwesomeIcon icon={faEnvelope} className="text-red-500" />
                Requester Email
              </label>
              <input
                type="email"
                name="requesterEmail"
                value={user?.email || ""}
                readOnly
                className="db-input db-input-ro"
              />
            </div>
          </div>

          <hr className="db-border" />

          {/* Section: Recipient info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="db-label">
                Recipient Name
              </label>
              <input
                type="text"
                name="recipientName"
                required
                className="db-input"
                placeholder="Name of patient or receiver"
              />
            </div>
            <div>
              <label className="db-label">
                Required Blood Group
              </label>
              <select
                name="bloodGroup"
                defaultValue=""
                className="db-select"
                required
              >
                <option value="" disabled>Select blood group</option>
                {bloodGroups.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Upazilla */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="db-label">
                Recipient District
              </label>
              <select
                name="district"
                className="db-select"
                defaultValue=""
                onChange={handleDistrict}
                required
              >
                <option value="" disabled>Select district</option>
                {allDistricts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="db-label">
                Recipient Upazilla
              </label>
              <select
                name="upazilla"
                className="db-select"
                defaultValue=""
                required
              >
                <option value="" disabled>Select upazilla</option>
                {districtUpazillas.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="db-label flex items-center gap-1.5">
                <FontAwesomeIcon icon={faHospital} className="text-red-500" />
                Hospital Name
              </label>
              <input
                type="text"
                name="hospital"
                required
                className="db-input"
                placeholder="e.g. Dhaka Medical College Hospital"
              />
            </div>
            <div>
              <label className="db-label flex items-center gap-1.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" />
                Full Address Details
              </label>
              <input
                type="text"
                name="fullAddress"
                required
                className="db-input"
                placeholder="e.g. Zahir Raihan Rd, Dhaka"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="db-label flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-red-500" />
                Donation Date
              </label>
              <input
                type="date"
                name="date"
                required
                className="db-input"
              />
            </div>
            <div>
              <label className="db-label flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-red-500" />
                Preferred Time
              </label>
              <input
                type="time"
                name="time"
                required
                className="db-input"
              />
            </div>
          </div>

          {/* message */}
          <div>
            <label className="db-label flex items-center gap-1.5">
              <FontAwesomeIcon icon={faComment} className="text-red-500" />
              Requester Message
            </label>
            <textarea
              name="message"
              required
              rows="3"
              className="db-input resize-none"
              placeholder="Provide extra info about the condition, contact numbers, etc."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={userInfo.status === "Blocked"}
              className={`w-full btn-red flex items-center justify-center gap-2 py-3 ${
                userInfo.status === "Blocked" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              Submit Donation Request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
