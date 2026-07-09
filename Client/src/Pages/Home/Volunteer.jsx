import {
  FaBullhorn,
  FaCalendarCheck,
  FaHandsHelping,
  FaHospital,
  FaTruck,
} from "react-icons/fa";

const volunteerRoles = [
  {
    title: "Event Organizer",
    description: "Plan donation drives and coordinate local campaign days.",
    icon: FaCalendarCheck,
  },
  {
    title: "Outreach Coordinator",
    description: "Reach new donors and keep community groups informed.",
    icon: FaBullhorn,
  },
  {
    title: "Donation Center Assistant",
    description: "Support donors with guidance, queues, and basic help.",
    icon: FaHospital,
  },
  {
    title: "Transport Volunteer",
    description: "Help move blood units and urgent supplies where needed.",
    icon: FaTruck,
  },
];

const Volunteer = () => {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-teal-600 text-white shadow-lg shadow-teal-100">
              <FaHandsHelping />
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
              Volunteer program
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Give time, skills, and coordination to save more lives.
            </h2>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              Volunteers keep the network active beyond a single donation. They
              organize drives, guide donors, and help urgent requests reach the
              right people.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {volunteerRoles.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-lg border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-red-950/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <Icon />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Volunteer;
