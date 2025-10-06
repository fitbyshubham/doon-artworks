// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { artworks as artworkData } from "@/data/artworks.json"; // ✅ Real data

// 🔸 Updated interface to match your JSON
interface Artwork {
  id: string; // e.g., "01", "29"
  lotNumber: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: {
    height: string;
    width: string;
    formatted: string;
  };
  startingBid: number;
  minimumIncrement: number;
  page: number;
  image: string;
}

// Custom styles object for the social media icons
const socialIcons = {
  f: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 10h-2V9c0-.46.34-.73.74-.73h1.68V6.15A20.35 20.35 0 0 0 12.87 6c-2.3 0-3.87 1.28-3.87 4.07v1.86h-2V14h2v7h3v-7h2l1-3z" />
    </svg>
  ),
  t: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.46 6a8.55 8.55 0 0 1-2.48.68A4.27 4.27 0 0 0 21.6 4.75a8.7 8.7 0 0 1-2.73 1.05A4.3 4.3 0 0 0 15 4a4.28 4.28 0 0 0-4.3 4.3A12.23 12.23 0 0 0 3 5.4a4.28 4.28 0 0 0 1.32 5.73 4.19 4.19 0 0 1-1.95-.54v.05A4.29 4.29 0 0 0 8.05 15a4.34 4.34 0 0 1-2.14.08 4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 3 18.23a12.23 12.23 0 0 0 6.64 1.95c8 0 12.38-6.6 12.38-12.38 0-.2.01-.4.01-.6a8.8 8.8 0 0 0 2.22-2.3z" />
    </svg>
  ),
  in: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.03 21h3.48V9.38H2.03V21zM3.77 7.9c1.23 0 2.15-.92 2.15-2.07C5.92 4.67 5 3.75 3.77 3.75 2.54 3.75 1.62 4.67 1.62 5.83c0 1.15.92 2.07 2.15 2.07zM22 21h-3.47v-5.61c0-1.33-.49-2.24-1.66-2.24-.91 0-1.46.61-1.71 1.2V21H11.6V9.38h3.46v1.54h.04c.54-.92 1.87-1.89 3.86-1.89 4.13 0 4.88 2.7 4.88 6.22V21z" />
    </svg>
  ),
  behance: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  ),
};

export default function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null); // 🔸 string
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu
  const router = useRouter();

  useEffect(() => {
    // ✅ Use real data
    setArtworks(artworkData);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleExploreClick = (id: string) => {
    router.push(`/artworks/${id}`);
  };

  const handleBidClick = (id: string) => {
    router.push(`/artworks/${id}`);
  };

  // Get the two specific artworks for the hero section
  const heroArtworkLeft = artworks.find((artwork) => artwork.id === "01");
  const heroArtworkRight = artworks.find((artwork) => artwork.id === "02");

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0f1f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.1), transparent 50%), radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.1), transparent 50%)",
            animation: "rotate 20s linear infinite",
          }}
        />
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "3px solid rgba(139, 92, 246, 0.2)",
            borderTopColor: "#8b5cf6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff", // ✅ Changed to white background for light theme
        color: "#000000", // ✅ Changed to black text for light theme
        fontFamily:
          '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');
        body { font-family: 'Montserrat', sans-serif !important; }
        @keyframes button-arrow-move {
          0% { transform: translateX(0); }
          50% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
        .register-btn:hover .arrow-icon {
          animation: button-arrow-move 0.7s infinite;
        }
        
        /* Mobile menu styles */
        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          flex-direction: column;
          padding: 20px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 999;
        }
        
        .mobile-menu.open {
          display: flex;
        }
        
        .mobile-menu a {
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          text-decoration: none;
          color: #000;
          font-size: 16px;
        }
        
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 30px;
          height: 30px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }
        
        .hamburger-line {
          width: 100%;
          height: 2px;
          background: #000;
          transition: all 0.3s;
        }
        
        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }
          
          nav {
            display: none;
          }
          
          .logo {
            font-size: 22px !important;
          }
          
          .header-icons {
            gap: 15px !important;
          }
          
          .hero-container {
            padding: 10px !important;
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            min-height: 60vh !important;
          }
          
          .hero-content {
            padding: 40px 20px !important;
          }
          
          .hero-title {
            font-size: 22px !important;
            margin-bottom: 15px !important;
          }
          
          .hero-artist {
            font-size: 20px !important;
            margin-bottom: 5px !important;
          }
          
          .view-lots-btn {
            padding: 6px 15px !important;
            font-size: 11px !important;
          }
          
          .middle-section {
            padding: 60px 20px !important;
          }
          
          .middle-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          
          .middle-text {
            max-width: 100% !important;
          }
          
          .middle-title {
            text-align: left !important;
            margin-top: 20px !important;
          }
          
          .cards-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          
          .card {
            height: auto !important;
            min-height: 200px !important;
          }
          
          .artworks-section {
            padding: 40px 20px !important;
          }
          
          .section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          
          .view-all-link {
            align-self: flex-end !important;
          }
          
          .gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
        }
      `}</style>

      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          position: "relative",
          top: 0,
          zIndex: 1000,
          background: "transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            className="logo"
            style={{
              fontSize: "28px",
              fontWeight: "800",
              letterSpacing: "1px",
              color: "#000000",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Palettes of Promise
          </div>

          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>

          <nav
            className="desktop-nav"
            style={{
              display: "flex",
              gap: "40px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {["HOME", "ARTWORKS"].map((item) => (
              <a
                key={item}
                href={item === "ARTWORKS" ? "#artworks-section" : "#"}
                style={{
                  textDecoration: "none",
                  color: item === "HOME" ? "#000000" : "rgba(0, 0, 0, 0.7)", // ✅ Changed to black/gray
                  position: "relative",
                  transition: "color 0.3s ease",
                  letterSpacing: "1.5px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    item === "HOME" ? "#000000" : "rgba(0, 0, 0, 0.7)")
                }
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div
            className="mobile-logo"
            style={{
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "1px",
              color: "#000000",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "center",
              marginBottom: "20px",
              padding: "10px 0",
            }}
            onClick={() => {
              router.push("/");
              setIsMenuOpen(false);
            }}
          >
            Palettes of Promise
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {["HOME", "ARTWORKS"].map((item) => (
              <a
                key={item}
                href={item === "ARTWORKS" ? "#artworks-section" : "#"}
                style={{
                  textDecoration: "none",
                  color: item === "HOME" ? "#000000" : "rgba(0, 0, 0, 0.7)",
                  position: "relative",
                  transition: "color 0.3s ease",
                  letterSpacing: "1.5px",
                  textAlign: "center",
                  padding: "8px 0",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </header>
      <main style={{ maxWidth: "100%", margin: "0 auto", padding: "0" }}>
        {/* Hero Section - Split Layout (As per screenshot) */}
        <div
          className="hero-container"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "60px",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {/* Left Hero */}
          <div
            style={{
              backgroundImage: heroArtworkLeft
                ? `url(${heroArtworkLeft.image})`
                : "url('/images/artwork4.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                zIndex: 0,
              }}
            />

            <div
              className="hero-content"
              style={{
                position: "relative",
                zIndex: 1,
                padding: "80px 60px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="hero-artist"
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  lineHeight: "1.2",
                }}
              >
                {heroArtworkLeft?.artist || "ARTIST NAME"}
              </div>
              <h1
                className="hero-title"
                style={{
                  fontSize: "32px",
                  fontWeight: "500",
                  color: "#ffffff",
                  marginBottom: "24px",
                  lineHeight: "1.3",
                  letterSpacing: "0.5px",
                }}
              >
                {heroArtworkLeft?.title || "ARTWORK TITLE"}
              </h1>

              <button
                className="view-lots-btn"
                style={{
                  display: "inline-block",
                  padding: "8px 20px",
                  background: "white",
                  border: "none",
                  borderRadius: "0",
                  color: "#000000",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "background 0.2s ease",
                }}
                onClick={() =>
                  heroArtworkLeft && handleExploreClick(heroArtworkLeft.id)
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                VIEW LOTS
              </button>
            </div>
          </div>

          {/* Right Hero */}
          <div
            style={{
              backgroundImage: heroArtworkRight
                ? `url(${heroArtworkRight.image})`
                : "url('/images/artwork1.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                zIndex: 0,
              }}
            />

            <div
              className="hero-content"
              style={{
                position: "relative",
                zIndex: 1,
                padding: "80px 60px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="hero-artist"
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  lineHeight: "1.2",
                }}
              >
                {heroArtworkRight?.artist || "ARTIST NAME"}
              </div>
              <h1
                className="hero-title"
                style={{
                  fontSize: "32px",
                  fontWeight: "500",
                  color: "#ffffff",
                  marginBottom: "24px",
                  lineHeight: "1.3",
                  letterSpacing: "0.5px",
                }}
              >
                {heroArtworkRight?.title || "ARTWORK TITLE"}
              </h1>

              <button
                className="view-lots-btn"
                style={{
                  display: "inline-block",
                  padding: "8px 20px",
                  background: "white",
                  border: "none",
                  borderRadius: "0",
                  color: "#000000",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "background 0.2s ease",
                }}
                onClick={() =>
                  heroArtworkRight && handleExploreClick(heroArtworkRight.id)
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                VIEW LOTS
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the content remains the same... */}
        {/* Middle Section - Light Background with Boxes (As per screenshot) */}
        <div
          className="middle-section"
          style={{
            background: "#ffffff",
            padding: "100px 80px",
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
            color: "#000000",
          }}
        >
          {" "}
          {/* ✅ Changed background */}
          <div
            className="middle-content"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "80px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="middle-text" style={{ maxWidth: "450px" }}>
              <p
                style={{
                  fontSize: "17px",
                  color: "rgba(0, 0, 0, 0.8)",
                  lineHeight: "1.7",
                }}
              >
                {" "}
                {/* ✅ Changed color */}A place where creativity has no rules!
                Whether you are picking up a brush for the first time or
                refining your skills.
              </p>
            </div>
            <h2
              className="middle-title"
              style={{
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: "900",
                maxWidth: "600px",
                textAlign: "right",
                lineHeight: "1.1",
                letterSpacing: "-1px",
                color: "#000000",
                textTransform: "uppercase",
              }}
            >
              {" "}
              {/* ✅ Changed color */}
              INSPIRING CREATIVITY, ONE BRUSH AT A TIME
            </h2>
          </div>
          {/* Cards for Middle Section */}
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              position: "relative",
              zIndex: 1,
              alignItems: "stretch",
            }}
          >
            {[
              {
                number: "[1]",
                title: "Our studio is a vibrant haven",
                text: "Our studio is a vibrant haven where imagination meets skill. We provide a creative space for artists of all levels to explore.",
                image: "/images/artwork2.jpg",
                isSpecial: false,
                isImageTop: true,
              },
              {
                number: "[2]",
                title: "With an inspiring atmosphere",
                text: "With an inspiring atmosphere, expert guidance, and top-quality materials, we nurture artistic growth and bring unique visions to life.",
                image: "/images/artwork3.jpg",
                isSpecial: false,
                isImageTop: false,
              },
              {
                number: "15+ Year",
                title: "15+ Years",
                text: "The studio offers a warm and welcoming space where artists of all skill levels can practice painting, drawing, sculpture, and more.",
                image: "/images/artwork4.jpg",
                isSpecial: true,
                isImageTop: false,
              },
              {
                number: "[3]",
                title: "Whether you're creating for passion",
                text: "Whether you're creating for passion, learning new techniques, or preparing for exhibitions, our studio is the perfect place to turn your ideas into reality.",
                image: "/images/artwork1.jpg",
                isSpecial: false,
                isImageTop: true,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="card"
                style={{
                  background: card.isSpecial
                    ? "#000000"
                    : card.isImageTop
                    ? "#f9f9f9"
                    : "#ffffff", // ✅ Changed backgrounds
                  color:
                    card.isSpecial || card.isImageTop ? "#000000" : "#000000", // ✅ Changed colors
                  border: card.isSpecial
                    ? "none"
                    : "1px solid rgba(0, 0, 0, 0.1)", // ✅ Changed border color
                  borderRadius: "0",
                  padding: "25px",
                  height: "400px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: card.isSpecial
                    ? "0 10px 30px rgba(0, 0, 0, 0.2)"
                    : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* Number/Title on top-left (for text-only card) or bottom-left (for special card) */}
                <div
                  style={{
                    position: "absolute",
                    top: card.isImageTop || card.isSpecial ? "25px" : "auto",
                    bottom: card.isImageTop ? "auto" : "25px",
                    left: "25px",
                    color: card.isSpecial ? "#ffffff" : "#000000", // ✅ Changed color
                    fontSize: "14px",
                    fontWeight: "700",
                    zIndex: 2,
                  }}
                >
                  {card.number}
                </div>

                {card.isSpecial ? (
                  // Special Card Content
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      height: "100%",
                      padding: "20px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "42px",
                        fontWeight: "900",
                        marginBottom: "10px",
                        color: "#ffffff",
                        lineHeight: "1",
                      }}
                    >
                      {" "}
                      {/* ✅ Changed color */}
                      {card.number}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: "1.5",
                      }}
                    >
                      {" "}
                      {/* ✅ Changed color */}
                      {card.text}
                    </p>
                  </div>
                ) : (
                  // Standard Card Content
                  <>
                    {/* Image Box */}
                    {card.isImageTop && (
                      <div
                        style={{
                          width: "100%",
                          height: "60%",
                          overflow: "hidden",
                          marginBottom: "20px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={card.image}
                          alt="Card Image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    {/* Text Content */}
                    <p
                      style={{
                        fontSize: "15px",
                        color: card.isImageTop ? "#333" : "rgba(0, 0, 0, 0.9)",
                        lineHeight: "1.6",
                        flexGrow: 1,
                      }}
                    >
                      {card.text}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Artworks Gallery - Light Theme */}
        <section
          id="artworks-section"
          className="artworks-section"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "80px 80px 120px",
            background: "#ffffff",
          }}
        >
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "400",
                color: "#000000",
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              Artworks Gallery
            </h2>
            <a
              href="#"
              className="view-all-link"
              style={{
                fontSize: "14px",
                color: "#666666",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
            >
              View all
            </a>
          </div>

          <div
            className="gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                style={{
                  background: "#ffffff",
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border:
                    hoveredCard === artwork.id
                      ? "1px solid #e0e0e0"
                      : "1px solid transparent",
                  borderRadius: "0", // Square edges as in reference
                }}
                onMouseEnter={() => setHoveredCard(artwork.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleExploreClick(artwork.id)}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "100%", // Square aspect ratio
                    overflow: "hidden",
                    background: "#f9f9f9",
                  }}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      transform:
                        hoveredCard === artwork.id ? "scale(1.02)" : "scale(1)",
                    }}
                  />
                </div>

                <div style={{ padding: "16px 0" }}>
                  {/* Title - Bold, First */}
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "700", // Bold
                      color: "#000000",
                      marginBottom: "4px",
                      margin: "0 0 4px 0",
                      lineHeight: "1.3",
                    }}
                  >
                    {artwork.title}
                  </h3>
                  {/* Artist Name - Second */}
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#333333",
                      marginBottom: "8px",
                      margin: "0 0 8px 0",
                      textTransform: "none", // Remove uppercase
                      letterSpacing: "0.2px",
                    }}
                  >
                    {artwork.artist}
                  </p>
                  {/* Pulsing Starting Bid - Third */}
                  <div
                    style={{
                      marginBottom: "12px",
                      padding: "4px 0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#004276", // Primary color
                        margin: 0,
                        display: "inline-block",
                        // --- Pulsing Effect ---
                        opacity: 1,
                        animation: "pulse 1.5s infinite ease-in-out",
                      }}
                    >
                      Starting Bid: ₹{artwork.startingBid.toLocaleString()}
                    </p>
                  </div>
                  {/* Buttons - Fourth */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExploreClick(artwork.id);
                      }} // Stop click propagation to card
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#CBC3BA", // Background color
                        border: "1px solid #CBC3BA", // Border color
                        borderRadius: "0", // Square button
                        color: "#000000", // Text color
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "12px",
                        transition: "background 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#004276"; // Primary color on hover
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.borderColor = "#004276"; // Border color on hover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#CBC3BA";
                        e.currentTarget.style.color = "#000000";
                        e.currentTarget.style.borderColor = "#CBC3BA";
                      }}
                    >
                      Explore Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBidClick(artwork.id);
                      }} // Stop click propagation to card
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#004276", // Primary color
                        border: "1px solid #004276", // Border color
                        borderRadius: "0", // Square button
                        color: "#ffffff", // Text color
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "12px",
                        transition: "background 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ffffff"; // White on hover
                        e.currentTarget.style.color = "#004276"; // Primary color text on hover
                        e.currentTarget.style.borderColor = "#004276"; // Border color on hover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#004276";
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.borderColor = "#004276";
                      }}
                    >
                      Bid Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add the pulse animation to the style tag */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7; /* Adjust this value for the depth of the pulse */
            }
          }
        `}</style>
      </main>
    </div>
  );
}
