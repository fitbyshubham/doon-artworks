// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  currentBid: number;
  image: string;
  description: string;
  category: string;
}

// Custom styles object for the social media icons to use the actual icons
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
  ), // Placeholder for general icon
};

export default function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Generate 29 mock artworks across different categories
    const categories = [
      "Abstract",
      "Modern",
      "Nature",
      "Digital",
      "Classical",
      "Surreal",
      "Minimalist",
      "Pop Art",
      "Impressionist",
    ];
    const artists = [
      "Alex Rivera",
      "Maya Chen",
      "Elena Petrova",
      "Jordan Lee",
      "Sophia Kim",
      "Marcus Johnson",
      "Aisha Patel",
      "Thomas Wright",
      "Luna Garcia",
      "Hiroshi Tanaka",
    ];
    const titles = [
      "Abstract Expression",
      "Urban Landscape",
      "Nature's Whisper",
      "Digital Dreams",
      "Classical Harmony",
      "Surreal Journey",
      "Minimalist Vision",
      "Pop Culture",
      "Impressionist Light",
      "Cosmic Flow",
      "Ocean Depths",
      "Mountain Majesty",
      "Desert Dreams",
      "Forest Whispers",
      "City Lights",
      "Starry Night",
      "Golden Hour",
      "Winter Solstice",
      "Spring Awakening",
      "Summer Heat",
      "Autumn Colors",
      "Eternal Flame",
      "Silent Echo",
      "Vibrant Chaos",
      "Peaceful Mind",
      "Dynamic Energy",
      "Serene Waters",
      "Mystical Forest",
      "Celestial Bodies",
    ];

    const mockArtworks: Artwork[] = Array.from({ length: 29 }, (_, i) => ({
      id: i + 1,
      title: titles[i] || `Artwork ${i + 1}`,
      artist: artists[Math.floor(Math.random() * artists.length)],
      currentBid: Math.floor(Math.random() * 5000) + 500,
      image: `/images/artwork${(i % 4) + 1}.jpg`,
      description: `A captivating piece that explores the boundaries of ${categories[
        Math.floor(Math.random() * categories.length)
      ].toLowerCase()} art.`,
      category: categories[Math.floor(Math.random() * categories.length)],
    }));

    setArtworks(mockArtworks);
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleExploreClick = (id: number) => {
    router.push(`/artwork/${id}`);
  };

  const handleBidClick = (id: number) => {
    router.push(`/artwork/${id}`);
  };

  if (loading) {
    // The loading spinner remains the same
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

  // --- Main Layout Rendering ---
  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily:
          '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        /* Add a custom font */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');
        
        /* Global font for better resemblance */
        body {
            font-family: 'Montserrat', sans-serif !important;
        }
        
        /* Keyframe for button hover on Hero left */
        @keyframes button-arrow-move {
            0% { transform: translateX(0); }
            50% { transform: translateX(6px); }
            100% { transform: translateX(0); }
        }
        
        /* For the REGISTER button */
        .register-btn:hover .arrow-icon {
            animation: button-arrow-move 0.7s infinite;
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
            padding: "0 0",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "800",
              letterSpacing: "1px",
              color: "#ffffff",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            The Doon Art Auctions
          </div>

          <nav
            style={{
              display: "flex",
              gap: "40px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {["HOME", "ABOUT", "ARTWORKS"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  textDecoration: "none",
                  color:
                    item === "HOME" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  position: "relative",
                  transition: "color 0.3s ease",
                  letterSpacing: "1.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    item === "HOME" ? "#ffffff" : "rgba(255, 255, 255, 0.7)";
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <a
              href="#"
              style={{
                textDecoration: "none",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "14px",
                letterSpacing: "1.5px",
              }}
            >
              LOGIN
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0",
        }}
      >
        {/* Hero Section - Split Layout (As per screenshot) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            marginBottom: "0",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {/* Left Hero - Dark with Image Background */}
          <div
            style={{
              backgroundImage: "url('/images/artwork4.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* Dark Overlay to make text readable */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding: "100px 80px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                The Doon Art Auctions
              </div>
              <h1
                style={{
                  fontSize: "clamp(48px, 5vw, 68px)",
                  fontWeight: "900",
                  lineHeight: "1.1",
                  marginBottom: "24px",
                  letterSpacing: "-2px",
                  textTransform: "uppercase",
                  maxWidth: "550px",
                }}
              >
                A STUDIO OF
                <br />
                TIMELESS CREATIONS
              </h1>

              <p
                style={{
                  fontSize: "17px",
                  maxWidth: "450px",
                  marginBottom: "40px",
                  lineHeight: "1.7",
                  color: "rgba(255, 255, 255, 0.75)",
                  fontWeight: "500",
                }}
              >
                Our art studio is a creative sanctuary where imagination meets
                craftsmanship. We provide a welcoming space for artists of all
                levels to explore their passion.
              </p>

              <button
                className="register-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 30px",
                  background: "transparent",
                  border: "1px solid #ffffff",
                  borderRadius: "2px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  width: "fit-content",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                REGISTER
                <svg
                  className="arrow-icon"
                  style={{
                    width: "20px",
                    height: "20px",
                    transition: "transform 0.4s ease",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Hero - Light Background */}
          <div
            style={{
              background: "#f4f4f4",
              color: "#0a0a0a",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Image Placeholder [1] to [4] */}
            <div
              style={{
                position: "relative",
                padding: "80px",
                paddingBottom: "40px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "350px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  border: "1px solid #ddd",
                }}
              >
                <img
                  src="/images/artwork1.jpg"
                  alt="Featured Art"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(100%) brightness(80%)",
                  }}
                />
              </div>
              {/* Image box number indicators */}
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  left: "60px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                [1]
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "60px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                [4]
              </div>
            </div>

            {/* Right Hero Text and Socials */}
            <div
              style={{
                padding: "0 80px 80px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "#333",
                  lineHeight: "1.7",
                  maxWidth: "400px",
                  marginBottom: "60px",
                }}
              >
                More than just a studio, we are a community of creators. Our
                space is designed to inspire and nurture artistic excellence.
              </p>

              <div
                style={{
                  borderTop: "1px solid #ccc",
                  paddingTop: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#333",
                    letterSpacing: "1px",
                  }}
                >
                  FOLLOW US
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["f", "t", "in", "behance"].map((key) => (
                    <button
                      key={key}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "none",
                        border: "1px solid #ccc",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#000";
                        e.currentTarget.style.color = "#000";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ccc";
                        e.currentTarget.style.color = "#333";
                      }}
                    >
                      {socialIcons[key as keyof typeof socialIcons]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Dark Background with Boxes (As per screenshot) */}
        <div
          style={{
            background: "#0a0a0a",
            padding: "100px 80px",
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "80px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ maxWidth: "450px" }}>
              <p
                style={{
                  fontSize: "17px",
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: "1.7",
                }}
              >
                A place where creativity has no rules! Whether you are picking
                up a brush for the first time or refining your skills.
              </p>
            </div>
            <h2
              style={{
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: "900",
                maxWidth: "600px",
                textAlign: "right",
                lineHeight: "1.1",
                letterSpacing: "-1px",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              INSPIRING CREATIVITY, ONE BRUSH AT A TIME
            </h2>
          </div>

          {/* Cards for Middle Section */}
          <div
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
                style={{
                  background: card.isSpecial
                    ? "#ffffff"
                    : card.isImageTop
                    ? "#ffffff"
                    : "transparent",
                  color:
                    card.isSpecial || card.isImageTop ? "#0a0a0a" : "#ffffff",
                  border: card.isSpecial
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.1)",
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Number/Title on top-left (for text-only card) or bottom-left (for special card) */}
                <div
                  style={{
                    position: "absolute",
                    top: card.isImageTop || card.isSpecial ? "25px" : "auto",
                    bottom: card.isImageTop ? "auto" : "25px",
                    left: "25px",
                    color: card.isSpecial ? "#333" : "#ffffff",
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
                        color: "#0a0a0a",
                        lineHeight: "1",
                      }}
                    >
                      {card.number}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: "1.5",
                      }}
                    >
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
                        color: card.isImageTop
                          ? "#333"
                          : "rgba(255, 255, 255, 0.9)",
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

        {/* -------------------- NEW SECTION 1: ALL ARTWORKS GALLERY -------------------- */}
        <section
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "80px",
            paddingTop: "100px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(36px, 4vw, 48px)",
              fontWeight: "900",
              marginBottom: "60px",
              textAlign: "left",
              letterSpacing: "-1px",
              color: "#ffffff",
              textTransform: "uppercase",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "15px",
            }}
          >
            Artworks Gallery
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                style={{
                  borderRadius: "0", // Square edges
                  overflow: "hidden",
                  position: "relative",
                  background:
                    hoveredCard === artwork.id
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  transform:
                    hoveredCard === artwork.id
                      ? "translateY(-5px)"
                      : "translateY(0)",
                }}
                onMouseEnter={() => setHoveredCard(artwork.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "75%",
                    overflow: "hidden",
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
                      transition: "transform 0.6s ease",
                      transform:
                        hoveredCard === artwork.id ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 50%)",
                    }}
                  />
                </div>

                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      marginBottom: "5px",
                      color: "#ffffff",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {artwork.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: "15px",
                    }}
                  >
                    by {artwork.artist}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      paddingTop: "15px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "rgba(255, 255, 255, 0.6)",
                        textTransform: "uppercase",
                      }}
                    >
                      Current Bid
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "900",
                        color: "#8b5cf6", // Accent color
                      }}
                    >
                      ${artwork.currentBid.toLocaleString()}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() => handleBidClick(artwork.id)}
                      style={{
                        flex: 1,
                        padding: "10px 15px",
                        background: "#8b5cf6",
                        border: "none",
                        borderRadius: "2px",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        transition: "background 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#7c3aed";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#8b5cf6";
                      }}
                    >
                      Bid Now
                    </button>
                    <button
                      onClick={() => handleExploreClick(artwork.id)}
                      style={{
                        flex: 1,
                        padding: "10px 15px",
                        background: "transparent",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "2px",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        transition: "background 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- NEW SECTION 2: TRENDING ARTWORK -------------------- */}
        <section
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "80px",
            paddingTop: "100px",
            paddingBottom: "120px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(36px, 4vw, 48px)",
              fontWeight: "900",
              marginBottom: "60px",
              textAlign: "left",
              letterSpacing: "-1px",
              color: "#ffffff",
              textTransform: "uppercase",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "15px",
            }}
          >
            Trending Art for the Week
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr", // A main trending piece and two smaller ones
              gap: "30px",
              minHeight: "500px",
            }}
          >
            {/* Main Trending Card */}
            <div
              style={{
                backgroundImage: "url('/images/artwork3.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: "0",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 80%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  left: "30px",
                  zIndex: 1,
                  maxWidth: "80%",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#8b5cf6",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Featured | Top Bid $8,900
                </p>
                <h3
                  style={{
                    fontSize: "36px",
                    fontWeight: "900",
                    lineHeight: "1.2",
                    color: "white",
                  }}
                >
                  Silent Echo in Digital Dreams
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginTop: "5px",
                  }}
                >
                  By Elena Petrova
                </p>
              </div>
            </div>

            {/* Side Trending Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: "1fr 1fr",
                gap: "30px",
              }}
            >
              {[
                {
                  title: "Cosmic Flow",
                  artist: "Maya Chen",
                  image: "/images/artwork2.jpg",
                },
                {
                  title: "Ocean Depths",
                  artist: "Alex Rivera",
                  image: "/images/artwork4.jpg",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    borderRadius: "0",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      zIndex: 1,
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "white",
                        lineHeight: "1.2",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginTop: "5px",
                      }}
                    >
                      By {item.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
