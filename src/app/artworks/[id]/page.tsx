// src/app/artwork/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
// import { supabase } from "@/lib/supabase"; // Commented out as it's not provided

interface Artwork {
  id: number;
  title: string;
  artist: string;
  lotNumber: string;
  startingBid: number;
  minimumIncrement: number;
  topBid: number;
  medium: string;
  dimensions: string;
  description: string;
  image: string;
  coverImage: string;
}

interface BidFormData {
  name: string;
  email: string;
  phone: string;
  bidAmount: string;
}

export default function ArtworkDetailPage() {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState<BidFormData>({
    name: "",
    email: "",
    phone: "",
    bidAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [activeImage, setActiveImage] = useState<"main" | "cover">("main");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Fetch artwork data based on ID
    const fetchArtwork = async () => {
      const artworkId = params.id as string;
      const idNum = parseInt(artworkId);

      // Mock data for demonstration - expanded to handle more IDs
      const mockArtworks: Artwork[] = [
        {
          id: 1,
          title: "Abstract Expression",
          artist: "Alex Rivera",
          lotNumber: "LOT-001",
          startingBid: 2500,
          minimumIncrement: 100,
          topBid: 2800,
          medium: "Acrylic on Canvas",
          dimensions: '48" x 36"',
          description:
            "A bold exploration of color and form that challenges traditional boundaries. This piece represents a journey through emotional landscapes, where vibrant hues collide with subtle textures to create a visual symphony that speaks to the soul. Its abstract nature invites multiple interpretations, making it a powerful statement piece for any modern collection. The layers of paint build depth and intensity, reflecting the complexity of urban life and raw emotion.",
          image: "/images/artwork1.jpg",
          coverImage: "/images/artwork2.jpg",
        },
        {
          id: 2,
          title: "Urban Landscape",
          artist: "Maya Chen",
          lotNumber: "LOT-002",
          startingBid: 1800,
          minimumIncrement: 50,
          topBid: 2100,
          medium: "Oil on Canvas",
          dimensions: '36" x 24"',
          description:
            "Capturing the energy and rhythm of city life through dynamic brushstrokes. The interplay of light and shadow creates a mesmerizing dance that reflects the constant motion and vibrancy of urban existence. The artist uses a palette knife to give texture to the concrete jungles and a soft brush for the fleeting city lights, merging classical technique with contemporary subject matter.",
          image: "/images/artwork2.jpg",
          coverImage: "/images/artwork3.jpg",
        },
        {
          id: 3,
          title: "Cosmic Flow",
          artist: "Elena Petrova",
          lotNumber: "LOT-003",
          startingBid: 5000,
          minimumIncrement: 200,
          topBid: 5600,
          medium: "Digital Print on Aluminium",
          dimensions: '60" x 40"',
          description:
            "An immersive digital creation that simulates the vast, swirling beauty of a nebula. 'Cosmic Flow' utilizes deep blues and purples punctuated by bursts of starlight, inviting the viewer to contemplate the infinite. It is a fusion of technology and abstract space art, perfect for a high-tech modern interior.",
          image: "/images/artwork3.jpg",
          coverImage: "/images/artwork4.jpg",
        },
        {
          id: 4,
          title: "Nature's Whisper",
          artist: "Jordan Lee",
          lotNumber: "LOT-004",
          startingBid: 1200,
          minimumIncrement: 50,
          topBid: 1450,
          medium: "Watercolor on Paper",
          dimensions: '20" x 16"',
          description:
            "A serene and delicate piece capturing the subtle movements of a forest in morning mist. The soft, translucent layers of watercolor evoke a sense of peace and natural harmony. This artwork brings a tranquil, organic feel to any space, highlighting the beauty of fleeting moments in nature.",
          image: "/images/artwork4.jpg",
          coverImage: "/images/artwork1.jpg",
        },
      ];

      // To ensure continuity, cycle through mock data if ID is out of range (like for 29 cards)
      const foundArtwork =
        mockArtworks.find((art) => art.id === idNum) ||
        mockArtworks[(idNum - 1) % mockArtworks.length];

      if (foundArtwork) {
        setArtwork(foundArtwork);
        // Set minimum bid amount in form
        setFormData((prev) => ({
          ...prev,
          bidAmount: (
            foundArtwork.topBid + foundArtwork.minimumIncrement
          ).toString(),
        }));
      }
    };

    if (params.id) {
      fetchArtwork();
    }
  }, [params.id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.bidAmount) {
      newErrors.bidAmount = "Bid amount is required";
    } else {
      const bidAmount = parseFloat(formData.bidAmount);
      if (isNaN(bidAmount)) {
        newErrors.bidAmount = "Please enter a valid amount";
      } else if (
        artwork &&
        bidAmount < artwork.topBid + artwork.minimumIncrement
      ) {
        newErrors.bidAmount = `Bid must be at least $${(
          artwork.topBid + artwork.minimumIncrement
        ).toLocaleString()}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !artwork) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would submit this to your Supabase database
      console.log("Submitting bid:", {
        ...formData,
        artworkId: artwork.id,
        bidAmount: parseFloat(formData.bidAmount),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        bidAmount: (artwork.topBid + artwork.minimumIncrement).toString(),
      });
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!artwork) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", // Monochromatic background
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(100, 100, 100, 0.1), transparent 50%)", // Monochromatic effect
            animation: "rotate 20s linear infinite",
          }}
        />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(100, 100, 100, 0.2)", // Monochromatic loader
              borderTopColor: "#ffffff",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 24px",
              boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)",
            }}
          />
          <div style={{ color: "white", fontSize: "18px", fontWeight: "500" }}>
            Loading artwork details...
          </div>
        </div>
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

  const minimumBid = artwork.topBid + artwork.minimumIncrement;

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)", // Monochromatic background
        color: "#ffffff",
        fontFamily:
          '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        /* Custom Font and Global Styles */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');
        body { font-family: 'Montserrat', sans-serif !important; }

        /* Animation Keyframes */
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes gradient { /* This will be a subtle grayscale gradient now */
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Bid Form Input Styling */
        .bid-input {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          margin-top: 5px;
          font-family: 'Montserrat', sans-serif;
        }

        .bid-input:focus {
          outline: none;
          border-color: #ffffff; /* White focus border */
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* White shadow */
          background: rgba(255, 255, 255, 0.1);
        }

        .bid-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          display: block;
          margin-bottom: 5px;
        }

        .error-text {
          color: #ff5555; /* A subtle red for error, still fits monochrome */
          font-size: 12px;
          margin-top: 5px;
          height: 15px; /* Reserve space for error message */
        }
      `}</style>

      {/* Animated background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(100, 100, 100, 0.08), transparent 50%), radial-gradient(circle at 80% 50%, rgba(150, 150, 150, 0.08), transparent 50%)", // Monochromatic particles
          pointerEvents: "none",
          animation: "pulse 10s ease-in-out infinite",
        }}
      />

      {/* Full-Screen Image Zoom Modal */}
      {imageZoom && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.3s ease",
            cursor: "zoom-out",
          }}
          onClick={() => setImageZoom(false)}
        >
          <img
            src={activeImage === "main" ? artwork.image : artwork.coverImage}
            alt={artwork.title}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)", // Subtle white shadow
              transform: "scale(1)",
              transition: "transform 0.3s ease",
              filter: "grayscale(100%)", // Make images grayscale
            }}
          />
          <button
            style={{
              position: "absolute",
              top: "40px",
              right: "40px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setImageZoom(false);
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(10, 10, 10, 0.7)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
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
            style={{
              fontSize: "28px",
              fontWeight: "900",
              letterSpacing: "1px",
              background:
                "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 50%, #ffffff 100%)", // Monochromatic gradient for logo
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
              animation: "gradient 3s ease infinite",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            The Doon Art Auctions
          </div>

          <button
            style={{
              padding: "10px 24px",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.1))", // Monochromatic button background
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "100px",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => router.push("/")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(200, 200, 200, 0.2))";
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.1))";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            BACK TO GALLERY
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(200, 200, 200, 0.03))", // Monochromatic background
            borderRadius: "32px",
            padding: "48px",
            marginBottom: "48px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 70%)", // Monochromatic light source
              animation: "float 6s ease-in-out infinite",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: "900",
                  marginBottom: "12px",
                  letterSpacing: "-1px",
                  background:
                    "linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.9))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {artwork.title}
              </h1>
              <p
                style={{
                  fontSize: "20px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                by
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.7))", // Monochromatic for artist name
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "700",
                  }}
                >
                  {artwork.artist}
                </span>
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #ffffff, #cccccc)", // Monochromatic lot number tag
                padding: "10px 24px",
                borderRadius: "100px",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "1px",
                boxShadow: "0 8px 24px rgba(255, 255, 255, 0.1)", // Subtle shadow
                color: "#333", // Dark text for contrast
              }}
            >
              {artwork.lotNumber}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "32px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Images Section */}
            <div>
              <div
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                  marginBottom: "20px",
                  position: "relative",
                  cursor: "zoom-in",
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.1))", // Monochromatic placeholder
                }}
                onClick={() => setImageZoom(true)}
              >
                <img
                  src={
                    activeImage === "main" ? artwork.image : artwork.coverImage
                  }
                  alt={artwork.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: imageZoom ? "scale(1.05)" : "scale(1)",
                    filter: "grayscale(100%)", // Make main image grayscale
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    background: "rgba(10, 10, 10, 0.8)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    padding: "8px 16px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Click to zoom
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "120px",
                    cursor: "pointer",
                    border:
                      activeImage === "main"
                        ? "2px solid #ffffff" // White border for active
                        : "2px solid transparent",
                    transition: "all 0.3s ease",
                    boxShadow:
                      activeImage === "main"
                        ? "0 0 10px rgba(255, 255, 255, 0.5)"
                        : "none",
                  }}
                  onClick={() => setActiveImage("main")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={artwork.image}
                    alt="Main view"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)", // Make thumbnail grayscale
                    }}
                  />
                </div>
                <div
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "120px",
                    cursor: "pointer",
                    border:
                      activeImage === "cover"
                        ? "2px solid #ffffff" // White border for active
                        : "2px solid transparent",
                    transition: "all 0.3s ease",
                    boxShadow:
                      activeImage === "cover"
                        ? "0 0 10px rgba(255, 255, 255, 0.5)"
                        : "none",
                  }}
                  onClick={() => setActiveImage("cover")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={artwork.coverImage}
                    alt="Cover view"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)", // Make thumbnail grayscale
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bidding Info Cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Current Bid Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #444444, #666666)", // Dark gray gradient
                  borderRadius: "24px",
                  padding: "32px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      opacity: 0.9,
                      marginBottom: "8px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "#eee",
                    }}
                  >
                    Current Top Bid
                  </div>
                  <div
                    style={{
                      fontSize: "42px",
                      fontWeight: "900",
                      marginBottom: "20px",
                      textShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    ${artwork.topBid.toLocaleString()}
                  </div>
                  <div
                    style={{
                      padding: "12px 20px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.9,
                        marginBottom: "4px",
                      }}
                    >
                      Minimum next bid
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "700" }}>
                      ${minimumBid.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bid Details */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "24px",
                  padding: "24px",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "14px",
                      }}
                    >
                      Starting Bid
                    </span>
                    <span style={{ fontSize: "18px", fontWeight: "700" }}>
                      ${artwork.startingBid.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "14px",
                      }}
                    >
                      Bid Increment
                    </span>
                    <span style={{ fontSize: "18px", fontWeight: "700" }}>
                      +${artwork.minimumIncrement}
                    </span>
                  </div>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(200, 200, 200, 0.2))", // Monochromatic button
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "16px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    document
                      .getElementById("bid-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(200, 200, 200, 0.3))";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(200, 200, 200, 0.2))";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  PLACE A BID →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          {/* Description Card */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.05))",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "24px",
                background:
                  "linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.8))", // Monochromatic gradient for heading
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              </svg>
              Description
            </h2>
            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.8",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              {artwork.description}
            </p>
          </div>

          {/* Technical Specs Card */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(200, 200, 200, 0.08))", // Monochromatic background
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                marginBottom: "32px",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Specifications
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {[
                { label: "Medium", value: artwork.medium, icon: "🎨" },
                { label: "Dimensions", value: artwork.dimensions, icon: "📐" },
                { label: "Artist", value: artwork.artist, icon: "👤" },
                { label: "Lot Number", value: artwork.lotNumber, icon: "🏷️" },
              ].map((spec, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{spec.icon}</span>
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "14px",
                      }}
                    >
                      {spec.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bid Form Section */}
        <div
          id="bid-form"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(200, 200, 200, 0.05))", // Monochromatic background
            borderRadius: "32px",
            padding: "48px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-150px",
              left: "-150px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 70%)", // Monochromatic light source
              animation: "float 8s ease-in-out infinite",
            }}
          />

          <h2
            style={{
              fontSize: "36px",
              fontWeight: "900",
              marginBottom: "16px",
              textAlign: "center",
              background:
                "linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.9))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-1px",
            }}
          >
            Place Your Bid
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "40px",
              fontSize: "16px",
            }}
          >
            Your bid must be at least **${minimumBid.toLocaleString()}** to be
            valid.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="bid-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bid-input"
                  placeholder="John Doe"
                />
                <div className="error-text">{errors.name}</div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="bid-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bid-input"
                  placeholder="john.doe@example.com"
                />
                <div className="error-text">{errors.email}</div>
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="bid-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bid-input"
                  placeholder="+1 (555) 123-4567"
                />
                <div className="error-text">{errors.phone}</div>
              </div>

              {/* Bid Amount Input */}
              <div>
                <label htmlFor="bidAmount" className="bid-label">
                  Your Bid Amount (USD)
                </label>
                <input
                  type="number"
                  id="bidAmount"
                  name="bidAmount"
                  value={formData.bidAmount}
                  onChange={handleInputChange}
                  className="bid-input"
                  placeholder={minimumBid.toString()}
                  min={minimumBid}
                />
                <div className="error-text">{errors.bidAmount}</div>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "16px",
                background: isSubmitting
                  ? "#666666" // Darker gray when submitting
                  : "linear-gradient(90deg, #bbbbbb 0%, #dddddd 100%)", // Light gray gradient
                border: "none",
                borderRadius: "16px",
                color: isSubmitting ? "#cccccc" : "#333333", // Dark text for contrast
                fontWeight: "700",
                fontSize: "18px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 10px 30px rgba(255, 255, 255, 0.1)", // Subtle white shadow
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255, 255, 255, 0.5)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  SUBMITTING BID...
                </>
              ) : (
                "CONFIRM BID"
              )}
            </button>

            {/* Success Message */}
            {submitSuccess && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "rgba(100, 200, 100, 0.1)", // Subtle green for success
                  border: "1px solid #77bb77",
                  borderRadius: "12px",
                  color: "#77bb77",
                  textAlign: "center",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Bid submitted successfully! Thank you.
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer
        style={{
          padding: "40px 40px",
          textAlign: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          marginTop: "40px",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} The Doon ART AUCTIONS. All Rights Reserved.
      </footer>
    </div>
  );
}
