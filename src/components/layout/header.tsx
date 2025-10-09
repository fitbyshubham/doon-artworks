"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Artists", href: "/about-artists" },
    { name: "Artworks", href: "#artworks-section" },
    { name: "About the Exhibition", href: "/palettes-of-promise" },
  ];

  return (
    <header className="sticky top-6 z-50 px-4 mb-10">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto rounded-full bg-white px-8 py-4 shadow-lg">
        {/* Logo + Branding */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo-header.png" // ✅ Update this path to your actual logo
              alt="Palettes of Promise Logo"
              width={48} // Adjust size as needed
              height={48}
              className="object-contain"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href="/"
              className="font-bold text-xl md:text-2xl text-[#004276] tracking-wide"
            >
              Palettes of Promise
            </Link>
            <span className="text-xs md:text-sm text-[#004276] italic opacity-90 mt-1">
              Where Every Brushstroke Funds a Future
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[#004276] font-medium text-sm md:text-base hover:opacity-80 transition-opacity"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <button
          onClick={() => {
            // Add scroll-to-pledge or modal logic here if needed
          }}
          className="bg-[#CBC3BA] text-[#004276] font-bold py-2 px-6 rounded-full hover:bg-[#c2b9b0] transition-colors"
        >
          Make Your Pledge
        </button>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white rounded-full shadow-lg">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo-header.png" // ✅ Same logo path
              alt="Palettes of Promise Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
          <Link
            href="/"
            className="font-bold text-lg text-[#004276] tracking-wide"
          >
            Palettes of Promise
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="flex flex-col gap-1 p-2"
          aria-label="Toggle menu"
        >
          <div
            className={`w-6 h-0.5 bg-[#004276] transition-transform ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-[#004276] transition-opacity ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-[#004276] transition-transform ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white mt-2 rounded-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen
            ? "max-h-[250px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[#004276] font-medium text-base hover:opacity-80 transition-opacity py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <button className="mt-2 w-full bg-[#CBC3BA] text-[#004276] font-bold py-2 px-4 rounded-full hover:bg-[#c2b9b0] transition-colors">
            Make Your Pledge
          </button>
        </div>
      </div>
    </header>
  );
}
