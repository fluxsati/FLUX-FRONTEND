import React, { useState } from 'react';

const faqData = [
  {
    question: "Is Wi-Fi available during the event?",
    answer: "Yes, high-speed Wi-Fi network credentials will be provided to all registered participants at the venue."
  },
  {
    question: "Will snacks or refreshments be provided?",
    answer: "Yes, refreshments and meals will be provided to participants throughout the hackathon schedule."
  },
  {
    question: "Are hardware components available for teams?",
    answer: "Basic hardware components like development boards and sensors are available in limited quantities on a first-come, first-served basis."
  },
  {
    question: "If hardware components are provided, do they need to be returned after the event?",
    answer: "Yes, all hardware components issued by the organizing team must be returned intact after the evaluation round."
  },
  {
    question: "Can we bring our own hardware and tools?",
    answer: "Absolutely! Teams working on IoT or hardware projects are encouraged to bring their own microcontrollers, sensors, and toolkits."
  },
  {
    question: "Will charging points and extension boards be available?",
    answer: "Power sockets will be available at every team desk. However, bringing your own extension board is highly recommended."
  },
  {
    question: "Is internet access available throughout the hackathon?",
    answer: "Yes, uninterrupted internet connection will be active throughout the entire duration of the hackathon."
  }
];

const FluxWaveFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-slate-900 text-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-slate-700 pb-3">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left flex justify-between items-center py-3 text-lg font-medium hover:text-cyan-300 transition-colors"
            >
              <span>{item.question}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="text-slate-300 mt-2 pl-2 text-sm leading-relaxed">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FluxWaveFAQ;