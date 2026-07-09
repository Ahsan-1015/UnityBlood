import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import React, { useContext, useEffect, useState } from "react";
import districts from "../../data/districts.json";
import upazillas from "../../data/upazillas.json";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";

const allDistricts = districts[2]?.data;
const allUpazillas = upazillas[2]?.data;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditRequest() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const params = useParams();

  const [donationRequest, setDonationRequest] = useState(null);
  const [districtUpazillas, setDistrictUpazillas] = useState([]);


  useEffect(() => {
    axiosSecure
      .get(`/donationRequest/${params.id}`)
      .then((res) => {
        setDonationRequest(res.data);

     
        const selectedDistrict = res.data.district;
        if (selectedDistrict) {
          const selectedDistrictData = allDistricts.find(
            (district) => district.name === selectedDistrict
          );
          if (selectedDistrictData) {
            const filteredUpazillas = allUpazillas.filter(
              (upazilla) => upazilla.district_id === selectedDistrictData.id
            );
            setDistrictUpazillas(filteredUpazillas);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [axiosSecure, params.id]);

  const handleDistrict = (e) => {
    const selectedDistrict = e.target.value;

    const selectedDistrictData = allDistricts.find(
      (district) => district.name === selectedDistrict
    );

    if (selectedDistrictData) {
      const filteredUpazillas = allUpazillas.filter(
        (upazilla) => upazilla.district_id === selectedDistrictData.id
      );
      setDistrictUpazillas(filteredUpazillas);
    }

    setDonationRequest((prev) => ({
      ...prev,
      district: selectedDistrict,
      upazilla: "", 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosSecure.patch(`/requestUpdate/${params.id}`,donationRequest).then((res)=>{
      if(res.data.modifiedCount){
        Swal.fire({
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      }else if(!res.data.modifiedCount){
        Swal.fire({
          icon: "error",
          title: "No changes made!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
  };

  if (!donationRequest) return <p>Loading...</p>;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-8 sm:mt-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Donation Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Requester Name
            </label>
            <input
              type="text"
              name="requesterName"
              value={user?.displayName || ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Requester Email
            </label>
            <input
              type="email"
              name="requesterEmail"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Recipient Name
            </label>
            <input
              type="text"
              defaultValue={donationRequest.recipientName}
              onChange={(e) =>
                setDonationRequest((prev) => ({
                  ...prev,
                  recipientName: e.target.value,
                }))
              }
              name="recipientName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Write recipient name"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">
                Recipient District
              </label>
              <select
                name="district"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                defaultValue={donationRequest.district || ""}
                onChange={handleDistrict}
                required
              >
                <option value="" disabled>
                  Select district
                </option>
                {allDistricts.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">
                Recipient Upazilla
              </label>
              <select
                name="upazilla"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={donationRequest.upazilla || ""}
                onChange={(e) =>
                  setDonationRequest((prev) => ({
                    ...prev,
                    upazilla: e.target.value,
                  }))
                }
                required
              >
                <option value="" disabled>
                  Select upazilla
                </option>
                {districtUpazillas.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
    <div className="w-1/2">
      <label className="block text-gray-700 font-medium mb-2">
        Hospital Name
      </label>
      <input
        type="text"
        name="hospitalName"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="Enter hospital name"
        defaultValue={donationRequest.hospital || ""}
        onChange={(e) =>
          setDonationRequest((prev) => ({
            ...prev,
            hospital: e.target.value,
          }))
        }
        required
      />
    </div>

    <div className="w-1/2">
      <label className="block text-gray-700 font-medium mb-2">
        Blood Group
      </label>
      <select
        name="bloodGroup"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        defaultValue={donationRequest.bloodGroup || ""}
        onChange={(e) =>
          setDonationRequest((prev) => ({
            ...prev,
            bloodGroup: e.target.value,
          }))
        }
        required
      >
        <option value="" disabled>
          Select blood group
        </option>
        {bloodGroups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>
  </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Address
            </label>
            <input
              type="text"
              name="hospitalAddress"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter hospital address"
              defaultValue={donationRequest.fullAddress || ""}
              onChange={(e) =>
                setDonationRequest((prev) => ({
                  ...prev,
                  fullAddress: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="flex gap-4">
    <div className="w-1/2">
      <label className="block text-gray-700 font-medium mb-2">Date</label>
      <input
        type="date"
        name="date"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        defaultValue={donationRequest.date || ""}
        onChange={(e) =>
          setDonationRequest((prev) => ({
            ...prev,
            date: e.target.value,
          }))
        }
        required
      />
    </div>

    <div className="w-1/2">
      <label className="block text-gray-700 font-medium mb-2">Time</label>
      <input
        type="time"
        name="time"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        defaultValue={donationRequest.time || ""}
        onChange={(e) =>
          setDonationRequest((prev) => ({
            ...prev,
            time: e.target.value,
          }))
        }
        required
      />
    </div>
  </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Requester Message
            </label>
            <textarea
              name="notes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter additional notes"
              defaultValue={donationRequest.message || ""}
              onChange={(e) =>
                setDonationRequest((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-success w-full"
          >
            Update Request
          </button>
        </form>
      </div>
    </div>
  );
}
