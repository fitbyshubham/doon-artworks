"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ArtisticLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Optional: Parallax effect on scroll (only on desktop)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const img1 = document.getElementById("palette-img");
      const img2 = document.getElementById("paletteOne-img");

      if (img1 && window.innerWidth >= 768) {
        img1.style.transform = `translateY(${scrollTop * 0.05}px)`;
      }
      if (img2 && window.innerWidth >= 768) {
        img2.style.transform = `translateY(${-scrollTop * 0.03}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-blue-800 font-serif leading-relaxed p-4 md:p-12 relative overflow-hidden">
      {/* Subtle artistic texture for mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-white -z-10"></div>

      {/* Desktop-only floating images */}
      <div
        id="palette-img"
        className="hidden md:block absolute top-10 right-0 w-48 md:w-72 opacity-70 hover:opacity-90 transition-opacity duration-300 z-0 pointer-events-none"
        style={{ transform: "translateY(0px)" }}
      >
        <Image
          src="/images/palette.png"
          alt="Art Palette Design Element"
          width={280}
          height={280}
          className="rounded-lg shadow-lg"
          priority={false}
          loading="lazy"
        />
      </div>

      <div
        id="paletteOne-img"
        className="hidden md:block absolute bottom-10 left-0 w-40 md:w-64 opacity-60 hover:opacity-80 transition-opacity duration-300 z-0 pointer-events-none"
        style={{ transform: "translateY(0px)" }}
      >
        <Image
          src="/images/paletteOne.png"
          alt="Second Art Palette Element"
          width={240}
          height={240}
          className="rounded-lg shadow-md"
          priority={false}
          loading="lazy"
        />
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="max-w-4xl mx-auto relative z-10">
        {/* First Text Block */}
        <div className="mb-8">
          <p className="text-base md:text-lg mb-4">
            From 15th to 29th June 2025, The Doon School welcomed 11
            distinguished artists from across India for our Artists in Residency
            programme,{" "}
            <strong className="font-bold">Palettes of Promise</strong>. Over two
            transformative weeks, the campus became both studio and sanctuary—a
            space where artistic practice met the rhythms of school life.
          </p>
          <p className="text-base md:text-lg mb-4">
            The works created during this period—more than 25 pieces across
            varied mediums—are not merely outcomes of individual expression, but
            reflections of dialogue, experimentation and the fertile exchange
            between tradition and contemporaneity. Each artist responded
            uniquely to School’s atmosphere, its history and its spirit,
            producing a body of work that resonates with both personal vision
            and collective experience.
          </p>
          <p className="text-base md:text-lg">
            This collection presents those creations as more than objects; they
            are moments captured in form, colour and texture, bearing witness to
            the possibilities that unfold when education and creativity
            intersect. The residency stands as a reminder that schools are not
            only places of learning but also crucibles of culture, where art
            deepens our understanding of the world and ourselves.
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-blue-200 pt-6"></div>

        {/* Second Text Block */}
        <div className="mb-8">
          <p className="text-base md:text-lg mb-4">
            This is not only a celebration of art but also an opportunity to
            transform lives. Those who donate to the Scholarship Fund through
            this initiative will receive their chosen artwork from the
            collection as a token of appreciation. Each piece thus becomes more
            than art—it becomes a symbol of opportunity, empowerment and the
            enduring Dosco spirit.
          </p>
          <p className="text-base md:text-lg mb-4">
            All contributions will go directly to the Scholarship Fund, which
            enables talented boys from diverse financial and social backgrounds
            to benefit from a Doon School education. Our scholarships are
            merit-based, ensuring that excellence and potential are never
            limited by circumstance.
          </p>
          <p className="text-base md:text-lg">
            We invite you to give generously and join us in extending the gift
            of education. Together, we can uphold School’s founding vision and
            ensure that future generations of boys, regardless of means, may
            walk through the gates of Chandbagh and carry forward the light of
            knowledge.
          </p>
        </div>

        {/* Signatures Section */}
        <div className="flex flex-row justify-between mt-8 gap-4">
          <div className="flex flex-col items-center w-1/2">
            <div className="text-xs text-blue-700 text-center">
              <strong>Mr Anoop Singh Bishnoi</strong>
              <br />
              Chairman
              <br />
              The Doon School (IPSS)
            </div>
          </div>
          <div className="flex flex-col items-center w-1/2">
            <div className="text-xs text-blue-700 text-center">
              <strong>Dr Jagpreet Singh</strong>
              <br />
              Headmaster
              <br />
              The Doon School
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only decorative dots */}
      <div className="block md:hidden absolute top-10 left-5 w-4 h-4 bg-blue-200 rounded-full opacity-30"></div>
      <div className="block md:hidden absolute bottom-10 right-5 w-3 h-3 bg-blue-300 rounded-full opacity-40"></div>
    </div>
  );
}
