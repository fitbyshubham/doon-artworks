// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component
import { artworks as artworkData } from "@/data/artworks.json";

// 🔸 Updated interface to match your JSON
interface Artwork {
  id: string;
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
  // Add the 'weight' property as optional if it exists in the JSON but is sometimes undefined
  weight?: string; // Or whatever the correct type is, if it can be undefined
  // Add other potentially optional properties from your JSON here if necessary
}

export default function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // 🔸 Type assertion to ensure compatibility
    setArtworks(artworkData as Artwork[]);
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
        background: "#ffffff",
        color: "#000000",
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

      <main style={{ maxWidth: "100%", margin: "0 auto", padding: "0" }}>
        {/* Hero Section - Split Layout (As per screenshot) */}
        {/* Hero Section - Split Layout */}
        <style jsx>{`
          .hero-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 60px;
            min-height: calc(100vh - 80px);
          }

          .hero-content {
            position: relative;
            z-index: 1;
            padding: 80px 60px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .hero-container {
              grid-template-columns: 1fr;
              gap: 16px;
              padding: 16px;
              min-height: auto;
            }

            .hero-content {
              padding: 40px 24px;
            }

            .hero-heading {
              font-size: 16px;
              margin-bottom: 12px;
            }

            .hero-artist {
              font-size: 22px !important;
              margin-bottom: 6px;
            }

            .hero-title {
              font-size: 24px !important;
              margin-bottom: 20px;
            }

            .view-lots-btn {
              padding: 6px 16px;
              font-size: 11px;
            }
          }
        `}</style>

        <div className="hero-container">
          {/* Left Hero */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            {heroArtworkLeft ? (
              <Image
                src={heroArtworkLeft.image}
                alt={heroArtworkLeft.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            ) : (
              <Image
                src="/images/artwork4.jpg"
                alt="Default Hero"
                fill
                style={{ objectFit: "cover" }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                zIndex: 0,
              }}
            />
            <div className="hero-content">
              <h2
                className="hero-heading"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "16px",
                  opacity: 0.9,
                }}
              >
                Artwork With Most Pledge
              </h2>
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
                MAKE YOUR PLEDGE
              </button>
            </div>
          </div>

          {/* Right Hero */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            {heroArtworkRight ? (
              <Image
                src={heroArtworkRight.image}
                alt={heroArtworkRight.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            ) : (
              <Image
                src="/images/artwork1.jpg"
                alt="Default Hero"
                fill
                style={{ objectFit: "cover" }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                zIndex: 0,
              }}
            />
            <div className="hero-content">
              <h2
                className="hero-heading"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "16px",
                  opacity: 0.9,
                }}
              >
                Artwork With Highest Pledge
              </h2>
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
                MAKE YOUR PLEDGE
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Styles (Add to your global CSS or in a <style> tag) */}
        <style jsx>{`
          @media (max-width: 900px) {
            .hero-container {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }

            .hero-content {
              padding: 50px 30px !important;
            }

            .hero-artist {
              font-size: 22px !important;
            }

            .hero-title {
              font-size: 26px !important;
            }

            /* Optional: reduce heading size on mobile */
            .hero-content h2 {
              font-size: 18px !important;
            }
          }

          @media (max-width: 500px) {
            .hero-content {
              padding: 40px 20px !important;
            }

            .hero-artist {
              font-size: 20px !important;
            }

            .hero-title {
              font-size: 22px !important;
            }

            .hero-content h2 {
              font-size: 16px !important;
            }
          }
        `}</style>

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
                  borderRadius: "0",
                }}
                onMouseEnter={() => setHoveredCard(artwork.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleExploreClick(artwork.id)}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "100%",
                    overflow: "hidden",
                    background: "#f9f9f9",
                  }}
                >
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      transform:
                        hoveredCard === artwork.id ? "scale(1.02)" : "scale(1)",
                    }}
                  />
                </div>

                <div style={{ padding: "16px 0" }}>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#000000",
                      marginBottom: "4px",
                      margin: "0 0 4px 0",
                      lineHeight: "1.3",
                    }}
                  >
                    {artwork.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#333333",
                      marginBottom: "8px",
                      margin: "0 0 8px 0",
                      textTransform: "none",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {artwork.artist}
                  </p>
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
                        color: "#004276",
                        margin: 0,
                        display: "inline-block",
                        opacity: 1,
                        animation: "pulse 1.5s infinite ease-in-out",
                      }}
                    >
                      Starting Pledge: ₹{artwork.startingBid.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBidClick(artwork.id); // or handlePledgeClick if you have a separate function
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#CBC3BA",
                      border: "1px solid #CBC3BA",
                      borderRadius: "0",
                      color: "#004276", // ✅ blue text as requested
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                      transition: "background 0.2s ease, color 0.2s ease",
                      fontFamily: "Georgia, serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#004276";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "#004276";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#CBC3BA";
                      e.currentTarget.style.color = "#004276";
                      e.currentTarget.style.borderColor = "#CBC3BA";
                    }}
                  >
                    Make Your Pledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
        {/* // Middle Section - Light Background with Boxes (As per screenshot) */}

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
                Not only a celebration of art, but also an opportunity to
                transform lives
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
              BUILDING FUTURES WITH EACH BRUSHSTROKE
            </h2>
          </div>
          {/* Cards for Middle Section */}
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "30px",
              position: "relative",
              zIndex: 1,
              alignItems: "stretch",
            }}
          >
            {[
              {
                number: "1",
                title: "Palettes of Promise",
                isSpecial: false,
                path: "/palettes-of-promise",
              },
              {
                number: "2",
                title: "View the Gallery",
                isSpecial: false,
                path: "/gallery",
              },
              {
                number: "3",
                title: "About the Artists",
                isSpecial: true,
                path: "/about-artists",
              },
              {
                number: "4",
                title: "Terms & Conditions",
                isSpecial: false,
                path: "/terms",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="card"
                style={{
                  background: card.isSpecial ? "#000000" : "#ffffff",
                  color: card.isSpecial ? "#ffffff" : "#000000",
                  border: card.isSpecial
                    ? "none"
                    : "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  padding: "40px 30px",
                  height: "320px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: card.isSpecial
                    ? "0 15px 35px rgba(0, 0, 0, 0.3)"
                    : "0 10px 25px rgba(0, 0, 0, 0.05)",
                  transform: "perspective(1000px) translateZ(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) perspective(1000px) translateZ(10px)";
                  e.currentTarget.style.boxShadow = card.isSpecial
                    ? "0 20px 40px rgba(0, 0, 0, 0.4)"
                    : "0 15px 30px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) translateZ(0)";
                  e.currentTarget.style.boxShadow = card.isSpecial
                    ? "0 15px 35px rgba(0, 0, 0, 0.3)"
                    : "0 10px 25px rgba(0, 0, 0, 0.05)";
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    marginBottom: "20px",
                    color: card.isSpecial ? "#ffffff" : "#004276",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: card.isSpecial
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,66,118,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {card.number}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "20px",
                    lineHeight: "1.3",
                    zIndex: 1,
                  }}
                >
                  {card.title}
                </h3>
                <button
                  style={{
                    padding: "12px 24px",
                    background: card.isSpecial ? "#ffffff" : "#CBC3BA",
                    border: "1px solid transparent",
                    borderRadius: "4px",
                    color: card.isSpecial ? "#000000" : "#004276",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                  onClick={() => router.push(card.path)}
                  onMouseEnter={(e) => {
                    const button = e.currentTarget;
                    if (card.isSpecial) {
                      button.style.background = "#004276";
                      button.style.color = "#ffffff";
                    } else {
                      button.style.background = "#004276";
                      button.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const button = e.currentTarget;
                    if (card.isSpecial) {
                      button.style.background = "#ffffff";
                      button.style.color = "#000000";
                    } else {
                      button.style.background = "#CBC3BA";
                      button.style.color = "#004276";
                    }
                  }}
                >
                  READ MORE
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
