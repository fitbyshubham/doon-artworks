"use client";

import { useState, useEffect } from "react";

export default function TermsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const terms = [
    {
      number: "1.",
      title: "Purpose",
      content: [
        "This Palettes of Promise is a silent art pledge, and a fundraising initiative to support Scholarships at The Doon School.",
        "Each artwork displayed has been generously presented by renowned artists for this initiative.",
      ],
    },
    {
      number: "2.",
      title: "Pledges",
      content: [
        "You may pledge a donation amount for any artwork either on the webpage that will be provided by writing it on the Pledge Sheet placed alongside the artwork.",
        "Multiple pledges may be made for the same artwork.",
        "Once recorded, a pledge cannot be withdrawn or reduced.",
      ],
    },
    {
      number: "3.",
      title: "Highest Pledge Recognition",
      content: [
        "At the close of the pledge period, the donor with the highest valid pledge for each artwork will be recognised, and the artwork will be presented to that donor as a token of gratitude for their generosity.",
        "In case of a tie, the organizers may invite donors to revise their pledge or use another fair method of determination.",
      ],
    },
    {
      number: "4.",
      title: "Closing Time",
      content: [
        "The silent art pledge will close on 30 October 2025 at midnight (IST). Pledges submitted after the official closing will not be considered.",
      ],
    },
    {
      number: "5.",
      title: "Donations & Payments",
      content: [
        "Pledges must be honoured in full within 30 days of confirmation.",
        "As this is a charitable contribution, payments are treated as donations, and applicable receipts will be issued.",
      ],
    },
    {
      number: "6.",
      title: "Collection of Artwork",
      content: [
        "Artworks may be collected after confirmation of donation from The School, with prior arrangement.",
        "Delivery/shipping, if required, will be the responsibility of the donor.",
      ],
    },
    {
      number: "7.",
      title: "Rights of the Organizers",
      content: [
        "The organizers reserve the right to withdraw or reassign any artwork in unforeseen circumstances.",
        "All proceeds will go toward The Doon School Scholarship Fund.",
        "The decision of The School in all matters will be final.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-blue-800 font-serif leading-relaxed p-4 md:p-12 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/5 to-white -z-10"></div>

      {/* Main Container */}
      <div
        className={`max-w-4xl mx-auto bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6 md:p-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-900 tracking-wide">
          Terms & Conditions
        </h1>

        {/* Divider */}
        <div className="border-t border-blue-200 my-6"></div>

        {/* Terms List */}
        <div className="space-y-8">
          {terms.map((term, index) => (
            <div key={index} className="group">
              {/* Section Header */}
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-start gap-2 text-blue-800">
                <span className="font-bold text-blue-600">{term.number}</span>
                <span>{term.title}</span>
              </h2>

              {/* Content */}
              <div className="space-y-3 mb-6">
                {term.content.map((paragraph, i) => (
                  <p key={i} className="text-base md:text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Section Divider (except last) */}
              {index < terms.length - 1 && (
                <div className="border-b border-blue-200 my-6 group-hover:border-blue-300 transition-colors"></div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-10 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
          <p className="text-lg md:text-xl">
            For any queries or assistance, please contact{" "}
            <a
              href="mailto:dar@doonschool.com"
              className="text-blue-700 underline hover:text-blue-900 transition-colors font-medium"
            >
              dar@doonschool.com
            </a>
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-blue-600 italic">
          These terms govern participation in the Palettes of Promise
          initiative. By pledging, you agree to these conditions.
        </div>
      </div>

      {/* Optional Decorative Elements */}
      <div className="absolute top-10 left-5 w-3 h-3 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-2 h-2 bg-blue-300 rounded-full opacity-40 animate-bounce"></div>
    </div>
  );
}
