import { FaHeartbeat, FaHospitalUser, FaMedkit, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: FaHeartbeat,
    title: "Emergency Ready",
    description:
      "Urgent requests are organized by blood group, location, hospital, date, and time so donors can respond quickly.",
    accent: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: FaHospitalUser,
    title: "Clear Request Flow",
    description:
      "Recipients can publish donation needs, track status, and keep every important detail in one reliable place.",
    accent: "text-teal-700",
    bg: "bg-teal-50",
  },
  {
    icon: FaUsers,
    title: "Community Network",
    description:
      "Donors, volunteers, and admins work together with role-based dashboards and simple management tools.",
    accent: "text-amber-700",
    bg: "bg-amber-50",
  },
];

export default function FeaturedSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-red-600 text-white shadow-lg shadow-red-100">
            <FaMedkit />
          </div>
          <p className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
            Why UnityBlood
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            A calmer, faster way to manage blood donation needs.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            The platform is designed around real donation workflows: request,
            verify, match, donate, and record the impact.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description, accent, bg }) => (
            <div
              key={title}
              className="group rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-500/40 dark:hover:shadow-red-950/30"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-md ${bg} ${accent}`}
              >
                <Icon className="text-xl" />
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
