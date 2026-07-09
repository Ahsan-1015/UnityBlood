import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from "react-icons/fa";

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!");
  };

  return (
    <section className="bg-teal-950 py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-red-300">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Need help with a donation request or partnership?
          </h2>
          <p className="mt-4 leading-8 text-slate-300">
            Reach the UnityBlood team for support, campaign coordination, or
            organization-level collaboration.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            data-aos="fade-right"
            className="rounded-lg border border-white/10 bg-white p-7 text-slate-900 shadow-2xl shadow-black/20"
          >
            <h3 className="text-2xl font-extrabold text-slate-950">
              Send a message
            </h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="7"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  placeholder="Write your message here"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
              >
                Send Message
              </button>
            </form>
          </div>

          <div
            data-aos="fade-left"
            className="rounded-lg border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur"
          >
            <h3 className="text-2xl font-extrabold">Contact information</h3>

            <div className="mt-6 space-y-4">
              <a
                href="tel:+88012222222222"
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.09]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-600 text-white">
                  <FaPhoneAlt />
                </span>
                <span>
                  <span className="block text-sm text-slate-400">Phone</span>
                  <span className="font-bold">+880 1222 222 2222</span>
                </span>
              </a>

              <a
                href="mailto:unityBlood@gmail.com"
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.09]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-red-600 text-white">
                  <FaEnvelope />
                </span>
                <span>
                  <span className="block text-sm text-slate-400">Email</span>
                  <span className="font-bold">unityBlood@gmail.com</span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-700 text-white">
                  <FaMapMarkerAlt />
                </span>
                <span>
                  <span className="block text-sm text-slate-400">Address</span>
                  <span className="font-bold">Savar DOHS, Dhaka-1216, BD</span>
                </span>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-500 text-slate-950">
                  <FaRegClock />
                </span>
                <span>
                  <span className="block text-sm text-slate-400">
                    Working hours
                  </span>
                  <span className="font-bold">
                    Mon - Fri: 9:00 AM - 6:00 PM
                    <br />
                    Sat: 10:00 AM - 4:00 PM
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.564763018799!2d90.3652604154316!3d23.834557791497834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1d915066277%3A0xcc8bc67523a50b7!2sSavar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1632927350000!5m2!1sen!2sbd"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="UnityBlood office map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
