import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const partners = [
  {
    name: "DMC Hospital",
    icon: "https://img.icons8.com/?size=100&id=rBh1fuOC6Bjx&format=png&color=000000",
  },
  {
    name: "Public Welfare Association",
    icon: "https://img.icons8.com/?size=100&id=121193&format=png&color=000000",
  },
  {
    name: "Red Foundation",
    icon: "https://img.icons8.com/?size=100&id=8mUEYCITnqJU&format=png&color=000000",
  },
  {
    name: "Blood Support ORG",
    icon: "https://img.icons8.com/?size=100&id=WELFrnfAT3Y3&format=png&color=000000",
  },
  {
    name: "We Care Org",
    icon: "https://img.icons8.com/?size=100&id=fRmL0OK6Sr9V&format=png&color=000000",
  },
];

const PartnersSupporters = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Partners and supporters
          </p>
          <h2
            className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl"
            data-aos="fade-up"
          >
            Built with organizations that care about fast response.
          </h2>
          <p
            className="mt-4 text-lg leading-8 text-slate-600"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Hospitals, welfare groups, and community teams help make donation
            support more dependable.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-red-200 hover:bg-white hover:shadow-lg hover:shadow-red-50"
              data-aos="zoom-in"
              data-aos-delay={index * 80}
            >
              <img
                src={partner.icon}
                alt={partner.name}
                className="h-16 w-16 object-contain"
              />
              <p className="mt-4 text-sm font-extrabold text-slate-800">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSupporters;
