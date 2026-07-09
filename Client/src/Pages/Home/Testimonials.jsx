import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "The request details were clear, and I could contact the recipient quickly. It made donating feel simple and meaningful.",
    name: "Arif Rahman",
    role: "Regular Donor",
    image:
      "https://img.freepik.com/premium-photo/excited-man-pointing-chest_251859-1951.jpg",
  },
  {
    quote:
      "During a stressful hospital moment, UnityBlood helped us find donors faster than calling people one by one.",
    name: "Nusrat Jahan",
    role: "Recipient Family",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSucZOUE43Dq9zm9MJqxub3XQy_Ukq2wl2nnA&s",
  },
  {
    quote:
      "The dashboard keeps donation requests organized. I can see status, history, and next actions without confusion.",
    name: "Alex Brown",
    role: "Volunteer",
    image:
      "https://as1.ftcdn.net/jpg/03/21/51/22/220_F_321512215_iLQIdpoXLd9gVYCtX4EZ9dyhJNz3BbTk.jpg",
  },
];

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-slate-100 py-20 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div data-aos="fade-up">
            <p className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-300">
              Community stories
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              People trust UnityBlood when timing matters.
            </h2>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              Real donation work depends on clarity, speed, and confidence.
              These stories reflect the experience we are designing for.
            </p>
            <Link
              to="/registration"
              className="mt-7 inline-flex rounded-md bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Become a Donor
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <div
                key={item.name}
                className="rounded-lg border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/[0.07] dark:shadow-black/10 dark:hover:bg-white/[0.11]"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                <FaQuoteLeft className="text-2xl text-red-300" />
                <div className="mt-4 flex gap-1 text-amber-500 dark:text-amber-300">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar key={starIndex} className="text-sm" />
                  ))}
                </div>
                <p className="mt-5 leading-7 text-slate-700 dark:text-slate-200">
                  {item.quote}
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
