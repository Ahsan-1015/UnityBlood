import Lottie from "lottie-react";
import FAQLottie from "../../assets/faqLottie.json";

const faqs = [
  {
    question: "Who can donate blood?",
    answer:
      "Most healthy adults who meet the age, weight, and health requirements can donate. Donors should be free from active infection and should follow the recommended waiting period after a previous donation.",
  },
  {
    question: "Is it safe to donate blood?",
    answer:
      "Yes. Donation centers use sterile, single-use equipment, and trained staff guide donors through screening, donation, and short recovery.",
  },
  {
    question: "How long does the donation process take?",
    answer:
      "A regular whole-blood donation visit usually takes around 45 minutes to 1 hour, including registration, health screening, donation, and rest.",
  },
  {
    question: "What should I do before donating blood?",
    answer:
      "Eat a healthy meal, drink enough water, sleep well, avoid alcohol, and bring a valid ID or any required documents.",
  },
  {
    question: "How often can I donate blood?",
    answer:
      "For whole blood, many guidelines recommend waiting around 56 days. Platelet and plasma donation schedules can differ by center and medical guidance.",
  },
];

const FAQ = () => {
  return (
    <section id="faqContainer" className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
            Questions
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            Donation basics, answered clearly.
          </h2>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
            Simple answers help donors feel prepared before they respond to a
            request or visit a donation center.
          </p>
          <Lottie
            animationData={FAQLottie}
            loop={true}
            autoplay={true}
            className="mx-auto mt-6 max-w-sm lg:mx-0"
          />
        </div>

        <div className="join join-vertical w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="collapse collapse-arrow join-item border-b border-slate-200 last:border-b-0 dark:border-slate-700"
            >
              <input
                type="radio"
                name="home-faq-accordion"
                defaultChecked={index === 0}
              />
              <div className="collapse-title text-lg font-extrabold text-slate-900 dark:text-white">
                {faq.question}
              </div>
              <div className="collapse-content leading-7 text-slate-600 dark:text-slate-300">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
