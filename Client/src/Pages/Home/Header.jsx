import { useContext } from "react";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import header_img from "../../assets/images/header_img.webp";
import { AuthContext } from "../../providers/AuthProvider";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(185,28,28,0.10),rgba(13,148,136,0.08),rgba(255,255,255,0))]"></div>
      <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-80px)] grid-cols-1 items-center gap-10 px-6 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-md border border-red-200 bg-white/90 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm lg:mx-0 dark:border-red-500/20 dark:bg-slate-900/80 dark:text-red-300">
            <FaShieldAlt className="text-red-600" />
            Trusted blood donation network
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:mx-0 lg:text-6xl dark:text-white">
            Find blood donors faster when every minute matters.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-700 lg:mx-0 dark:text-slate-300">
            UnityBlood connects donors, recipients, volunteers, and admins in
            one organized platform built for urgent requests and community care.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            {!user && (
              <Link
                to="/registration"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
              >
                Become a Donor
                <FaArrowRight />
              </Link>
            )}
            <Link
              to="/searchDonors"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 shadow-sm transition hover:border-red-300 hover:text-red-700"
            >
              <FaSearch />
              Search Donors
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-left">
            {[
              ["24/7", "Requests"],
              ["64", "Districts"],
              ["3x", "Life impact"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-lg border border-red-100 bg-white/85 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
              >
                <p className="text-2xl font-extrabold text-red-700 dark:text-red-400">
                  {value}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-red-100 dark:border-slate-700 dark:bg-slate-900">
            <img
              src={header_img}
              alt="Blood donation volunteer supporting a donor"
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
            />
          </div>
          <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-slate-200/70 bg-white/95 p-5 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal-600 text-white">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                  Local response
                </p>
                <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  Match blood group, district, and upazilla in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
