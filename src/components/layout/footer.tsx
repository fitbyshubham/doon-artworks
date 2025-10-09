"use client";

import { useState } from "react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="bg-white text-gray-800 py-10 px-6 md:px-12 mt-16"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo.jpg"
            alt="Palettes of Promise Logo"
            width={120}
            height={120}
            className="rounded-md"
          />
        </div>

        {/* Center: Title + Slogan */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#004276]">
            Palettes of Promise
          </h2>
          <p className="text-lg italic text-[#004276] leading-relaxed">
            Where Every Brush Stroke Funds a Future
          </p>
        </div>

        {/* Right: About Us, Support, Social Columns */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-8 md:mt-0">
          {/* Desktop: Three Columns */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold mb-4 text-[#004276] tracking-wide">
              About Us
            </h3>
            <ul className="space-y-2 text-base leading-relaxed">
              <li>
                <a
                  href="/palettes-of-promise"
                  className="hover:underline text-[#004276]"
                >
                  Mission
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-lg font-bold mb-4 text-[#004276] tracking-wide">
              Artists
            </h3>
            <ul className="space-y-2 text-base leading-relaxed">
              <li>
                <a
                  href="/about-artists"
                  className="hover:underline text-[#004276]"
                >
                  View All Artists
                </a>
              </li>
            </ul>
          </div>

          {/* <div className="hidden md:block">
            <h3 className="text-lg font-bold mb-4 text-[#004276] tracking-wide">
              Social
            </h3>
            <ul className="space-y-2 text-base leading-relaxed">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[#004276]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[#004276]"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[#004276]"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div> */}

          {/* Mobile: Single Row */}
          <div className="md:hidden flex flex-wrap justify-center gap-10 text-base leading-relaxed">
            <div className="flex flex-col items-center space-y-3">
              <h4 className="font-bold text-[#004276] tracking-wide">
                About Us
              </h4>
              <a href="/about" className="hover:underline text-[#004276]">
                Mission
              </a>
              <a href="/team" className="hover:underline text-[#004276]">
                Team
              </a>
              <a href="/newsletter" className="hover:underline text-[#004276]">
                Newsletter
              </a>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <h4 className="font-bold text-[#004276] tracking-wide">
                Support
              </h4>
              <a href="/contact" className="hover:underline text-[#004276]">
                Contact
              </a>
              <a
                href="/refund-policy"
                className="hover:underline text-[#004276]"
              >
                Refund Policy
              </a>
              <a href="/faq" className="hover:underline text-[#004276]">
                FAQ’s
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Title + Slogan + Quick Links */}
      <div className="md:hidden max-w-7xl mx-auto flex flex-col items-center space-y-4 mt-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#004276]">
          Palettes of Promise
        </h2>
        <p className="text-base italic text-[#004276] leading-relaxed">
          Where Every Stroke Funds a Future
        </p>
      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-300 my-6"></div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-base leading-relaxed">
        <div className="text-[#004276]">Copyright © Palettes of Promise</div>
        <div>
          <a href="/terms" className="hover:underline text-[#004276]">
            Terms of Service
          </a>
        </div>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 hover:underline text-[#004276]"
        >
          Back to top
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
