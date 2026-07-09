import { useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaTint, FaUserCircle } from "react-icons/fa";
import districts from "../../data/districts.json";
import upazillas from "../../data/upazillas.json";
import useAllUsers from "../../hooks/useAllUsers";

const allDistricts = districts[2]?.data || [];
const allUpazillas = upazillas[2]?.data || [];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Search() {
  const [districtUpazillas, setDistrictUpazillas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazilla, setSelectedUpazilla] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const allUsers = useAllUsers();

  const handleDistrict = (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setSelectedUpazilla("");

    const selectedDistrictData = allDistricts.find(
      (district) => district.name === districtName
    );

    if (selectedDistrictData) {
      const filteredUpazillas = allUpazillas.filter(
        (upazilla) => upazilla.district_id === selectedDistrictData.id
      );
      setDistrictUpazillas(filteredUpazillas);
    } else {
      setDistrictUpazillas([]);
    }
  };

  const handleSearch = () => {
    const usersWithFilters = allUsers.filter(
      (user) =>
        (selectedDistrict ? user.district === selectedDistrict : true) &&
        (selectedUpazilla ? user.upazilla === selectedUpazilla : true) &&
        (selectedBloodGroup ? selectedBloodGroup === user.bloodGroup : true)
    );
    setFilteredUsers(usersWithFilters);
    setHasSearched(true);
  };

  return (
    <main className="bg-slate-50">
      <section className="bg-[#fff7f5] border-b border-red-100">
        <div className="container mx-auto px-6 py-14">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Find donors
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Search donors by location and blood group
          </h1>
          <p className="mt-3 max-w-2xl leading-8 text-slate-600">
            Narrow donor lists by district, upazilla, and blood type so urgent
            outreach starts with the most relevant people.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                District
              </label>
              <select
                name="district"
                className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                defaultValue=""
                onChange={handleDistrict}
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

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Upazilla
              </label>
              <select
                name="upazilla"
                className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                value={selectedUpazilla}
                onChange={(e) => setSelectedUpazilla(e.target.value)}
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

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                defaultValue=""
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
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

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              <FaSearch />
              Search
            </button>
          </form>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Donor results
              </h2>
              <p className="mt-1 text-slate-600">
                {hasSearched
                  ? `${filteredUsers.length} donor(s) matched your filters.`
                  : "Choose filters and search to see matching donors."}
              </p>
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredUsers.map((user) => (
                <article
                  key={user._id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-50"
                >
                  <div className="flex items-start gap-4">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-14 w-14 text-slate-300" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xl font-extrabold text-slate-950">
                        {user.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-slate-600">
                        <FaMapMarkerAlt className="text-teal-700" />
                        {user.district}, {user.upazilla}
                      </p>
                    </div>
                    <span className="rounded-md bg-red-600 px-3 py-1 font-extrabold text-white">
                      {user.bloodGroup}
                    </span>
                  </div>
                  <p className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 p-3 font-bold text-red-700">
                    <FaTint />
                    Available as registered donor
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-950">
                {hasSearched ? "No donors found" : "No search yet"}
              </h3>
              <p className="mt-2 text-slate-600">
                {hasSearched
                  ? "Try changing district, upazilla, or blood group."
                  : "Use the search panel above to find matching donors."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
