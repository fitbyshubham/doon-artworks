// src/app/artwork/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { artworks as artworkData } from "@/data/artworks.json"; // Import the JSON data

// --- UPDATED INTERFACES TO MATCH YOUR JSON STRUCTURE ---
interface ArtworkJSON {
  id: string; // JSON uses string IDs like "01", "29"
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
  image: string; // Assuming this is the main image
  // coverImage is not in your JSON, so we'll use 'image' or add a field if needed
}

// --- INTERFACES & STATE (Keeping original structure for form handling) ---
interface Artwork {
  // Create an internal structure that includes 'topBid' for logic
  id: string;
  lotNumber: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: string; // Using the formatted string
  startingBid: number;
  minimumIncrement: number;
  page: number;
  image: string;
  topBid: number; // Calculate or derive this
}

interface BidFormData {
  name: string;
  email: string;
  phone: string; // Will handle +91 prefix separately
  bidAmount: string;
}

// --- MOCK BID HISTORY GENERATION ---
interface BidHistoryItem {
  id: number;
  bid: number;
  time: string; // e.g., "X hours/days ago"
}

// Function to generate mock bid history based on artwork data
const generateMockBidHistory = (
  startingBid: number,
  minimumIncrement: number,
  count: number = 5
): BidHistoryItem[] => {
  const history: BidHistoryItem[] = [];
  let currentBid = startingBid; // Start from the starting bid

  for (let i = 0; i < count; i++) {
    // Randomly increase the bid by at least minimumIncrement and up to a few increments
    const incrementToAdd = Math.floor(Math.random() * 5) + 1; // 1 to 5 increments
    const newBid = currentBid + minimumIncrement * incrementToAdd;
    currentBid = newBid; // Update for the next iteration

    // Generate a random time string (e.g., "1h ago", "30m ago", "2d ago")
    const timeUnits = ["m", "h", "d"]; // minutes, hours, days
    const timeUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
    const timeValue = Math.floor(Math.random() * 10) + 1; // 1 to 10 units
    const timeString = `${timeValue}${timeUnit} ago`;

    history.push({
      id: i + 1,
      bid: newBid,
      time: timeString,
    });
  }

  // Reverse to show most recent first
  return history.reverse();
};

// --- UPDATED PAGE COMPONENT ---
export default function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState<BidFormData>({
    name: "",
    email: "",
    phone: "", // User will enter only the 10-digit number
    bidAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  // const [activeImage, setActiveImage] = useState<"main" | "cover">("main"); // Assuming single image for now
  const router = useRouter();

  // --- UPDATED DATA FETCHING & LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      const artworkId = resolvedParams.id;

      // Find the artwork based on the ID from the URL in the imported JSON data
      const foundArtworkJSON = artworkData.find((art) => art.id === artworkId);

      if (foundArtworkJSON) {
        // Map JSON data to the internal Artwork interface
        // For now, assume topBid is the startingBid or derive it differently if needed
        const mappedArtwork: Artwork = {
          id: foundArtworkJSON.id,
          lotNumber: foundArtworkJSON.lotNumber,
          title: foundArtworkJSON.title,
          artist: foundArtworkJSON.artist,
          medium: foundArtworkJSON.medium,
          dimensions: foundArtworkJSON.dimensions.formatted,
          startingBid: foundArtworkJSON.startingBid,
          minimumIncrement: foundArtworkJSON.minimumIncrement,
          page: foundArtworkJSON.page,
          image: foundArtworkJSON.image,
          topBid: foundArtworkJSON.startingBid, // Using starting bid as initial top bid
        };

        setArtwork(mappedArtwork);

        // Set initial bid amount to starting bid + minimum increment
        setFormData((prev) => ({
          ...prev,
          bidAmount: (
            mappedArtwork.topBid + mappedArtwork.minimumIncrement
          ).toString(),
        }));
      } else {
        // Handle case where artwork is not found
        console.error(`Artwork with ID ${artworkId} not found in JSON data.`);
        // You could redirect to a 404 page or set an error state
        // router.push('/404'); // Example redirect
      }
    };

    fetchData();
  }, [params]);

  // --- UPDATED VALIDATION (Using mapped artwork's topBid and minimumIncrement) ---
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate phone number (10 digits after +91)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      // Check for exactly 10 digits
      newErrors.phone = "Please enter a valid 10-digit phone number";
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
        newErrors.bidAmount = `Bid must be at least ₹${(
          artwork.topBid + artwork.minimumIncrement
        ).toLocaleString()}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- UPDATED INPUT HANDLER (For phone, only store digits) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only digits and limit to 10
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !artwork) return;
    setIsSubmitting(true);
    try {
      console.log("Submitting bid:", {
        ...formData,
        artworkId: artwork.id,
        bidAmount: parseFloat(formData.bidAmount),
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
      setFormData({
        name: "",
        email: "",
        phone: "", // Clear only the number part
        bidAmount: (artwork.topBid + artwork.minimumIncrement).toString(),
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting bid:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOADING STATE (UNCHANGED) ---
  if (!artwork) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
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
              "radial-gradient(circle at 30% 30%, rgba(100, 100, 100, 0.1), transparent 50%)",
            animation: "rotate 20s linear infinite",
          }}
        />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(100, 100, 100, 0.2)",
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

  // Calculate minimum required bid
  const minimumBid = artwork.topBid + artwork.minimumIncrement;
  // Example bid increments based on minimumBid
  const bidIncrements = [
    minimumBid,
    minimumBid + artwork.minimumIncrement,
    minimumBid + artwork.minimumIncrement * 2,
    minimumBid + artwork.minimumIncrement * 3,
  ];

  // Generate mock bid history
  const mockBidHistory = generateMockBidHistory(
    artwork.startingBid,
    artwork.minimumIncrement
  );

  // --- RENDER (Updated to use artwork data and Indian Rupee symbol) ---
  return (
    <>
      <style>{`
        /* --- STYLES TO MATCH THE TARGET UI --- */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #FFFFFF; color: #111827; margin: 0; }
        .page-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .main-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; padding: 2rem 0; }
        @media (min-width: 1024px) { .main-grid { grid-template-columns: 1fr 0.8fr; } }
        .left-column, .right-column { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #E5E7EB; }
        .header-logo { font-weight: 700; font-size: 1.5rem; letter-spacing: 2px; }
        .header-nav { display: none; gap: 1.5rem; }
        @media (min-width: 768px) { .header-nav { display: flex; } }
        .header-nav a { text-decoration: none; color: #4B5563; }
        .header-icons { display: flex; gap: 1rem; }
        
        .artwork-image-main { width: 100%; height: auto; object-fit: cover; border: 1px solid #E5E7EB; cursor: zoom-in; }
        .artwork-description { color: #374151; line-height: 1.6; }
        
        .artwork-info { display: flex; flex-direction: column; gap: 0.5rem; }
        .info-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .lot-number { font-size: 1.25rem; font-weight: 600; }
        .artist-name { font-size: 1.25rem; font-weight: 600; color: #374151; } /* Smaller, less prominent font for artist */
        .artwork-title { font-size: 1.5rem; font-weight: 700; color: #004276; /* Larger, bold, and colored */ display: inline-block; /* Required for animation */ animation: shimmer 2s infinite linear; }
        .auction-details { border: 1px solid #E5E7EB; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; }
        .detail-row:not(:last-child) { border-bottom: 1px solid #E5E7EB; }
        .detail-label { color: #4B5563; }
        .detail-value { font-weight: 600; }
        .current-bid-value { color: #004276; }
        .met-status { padding: 1rem; color: #004276; font-weight: 600; font-size: 0.875rem; border-top: 1px solid #E5E7EB; }
        
        .bid-form-section { display: flex; flex-direction: column; gap: 1.5rem; }
        .bid-increments { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
         @media (min-width: 480px) { .bid-increments { grid-template-columns: repeat(4, 1fr); } }
        .bid-increment-btn { padding: 0.75rem; border-radius: 4px; border: 1px solid #D1D5DB; background-color: #FFFFFF; cursor: pointer; font-weight: 500; text-align: center; }
        .bid-increment-btn.active { background-color: #111827; color: #FFFFFF; border-color: #111827; }
        
        .form-inputs-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .form-inputs-grid { grid-template-columns: 1fr 1fr; } }
        .form-field { display: flex; flex-direction: column; }
        .form-label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
        .form-input { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 4px; box-sizing: border-box; font-size: 1rem; }
        .error-text { color: #EF4444; font-size: 0.75rem; margin-top: 0.25rem; height: 1em; }
        
        .action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .place-bid-btn, .set-max-bid-btn { padding: 0.875rem; border-radius: 4px; font-weight: 600; font-size: 1rem; cursor: pointer; }
        .place-bid-btn { background-color: #F3F4F6; border: 1px solid #D1D5DB; color: #111827; }
        .set-max-bid-btn { background-color: #111827; border: 1px solid #111827; color: #FFFFFF; }
        
        .bid-history { border-top: 1px solid #E5E7EB; padding-top: 1.5rem; }
        .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        
        .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8f9fa; color: #333; }
        .spinner { width: 50px; height: 50px; border: 3px solid rgba(0,0,0,0.1); border-top-color: #111; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .zoom-modal { position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
        .zoom-modal img { max-width: 90%; max-height: 90%; object-fit: contain; }
        /* Shimmer animation */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {imageZoom && (
        <div className="zoom-modal" onClick={() => setImageZoom(false)}>
          <img
            src={artwork.image} // Use the main image from JSON
            alt={artwork.title}
          />
        </div>
      )}

      <div className="page-container">
        <header className="header">
          <div className="header-logo">Palettes of Promise</div>{" "}
          {/* Updated logo text */}
          <nav className="header-nav">
            {/* Removed Auctions, Buy & Selling, Private sales */}
          </nav>
          <div className="header-icons">
            {/* Removed search icon */}
            <button onClick={() => router.push("/")}>Back to Gallery</button>
          </div>
        </header>
        {/* Removed breadcrumbs line */}
      </div>

      <main className="page-container">
        <div className="main-grid">
          <div className="left-column">
            <img
              src={artwork.image} // Use the main image from JSON
              alt={artwork.title}
              className="artwork-image-main"
              onClick={() => setImageZoom(true)}
            />
            <div className="artwork-description">
              {/* Assuming description is not in your JSON, using a placeholder or artist info */}
              <p>
                {artwork.artist} - {artwork.medium} - {artwork.dimensions}
              </p>
              {/* Add a description field to your JSON if needed */}
            </div>
          </div>

          <div className="right-column">
            <div className="artwork-info">
              <div className="info-header">
                <div className="lot-number">{artwork.lotNumber}</div>
              </div>
              {/* Order changed: Title first, then Artist */}
              <h2 className="artwork-title">{artwork.title}</h2>{" "}
              {/* Shimmering title */}
              <h1 className="artist-name">{artwork.artist}</h1>{" "}
              {/* Smaller, less prominent */}
            </div>

            <div className="auction-details">
              <div className="detail-row">
                <span className="detail-label">Auction closes</span>
                <span className="detail-value">Dec. 4 at 6:30 PM</span>{" "}
                {/* Placeholder */}
              </div>
              {/* Changed label from "Current bid" to "Starting bid" */}
              <div className="detail-row">
                <span className="detail-label">Starting bid</span>
                <span className="detail-value current-bid-value">
                  ₹{artwork.startingBid.toLocaleString()}{" "}
                  {/* Use Rupee symbol */}
                </span>
              </div>
              {/* Changed label from "Estimate" to "Minimum Increment" */}
              <div className="detail-row">
                <span className="detail-label">Minimum Increment</span>
                <span className="detail-value">
                  ₹{artwork.minimumIncrement.toLocaleString()}{" "}
                  {/* Use Rupee symbol */}
                </span>
              </div>
              {/* Added new row for Starting Bid + Minimum Increment */}
              <div className="detail-row">
                <span className="detail-label">Next Minimum Bid</span>
                <span className="detail-value">
                  ₹
                  {(
                    artwork.startingBid + artwork.minimumIncrement
                  ).toLocaleString()}{" "}
                  {/* Use Rupee symbol */}
                </span>
              </div>
              <div className="met-status">Accepted minimum price is met</div>{" "}
              {/* Placeholder */}
            </div>

            <form
              onSubmit={handleSubmit}
              className="bid-form-section"
              noValidate
            >
              <div className="bid-increments">
                {bidIncrements.map((amount) => (
                  <button
                    type="button"
                    key={amount}
                    className={`bid-increment-btn ${
                      formData.bidAmount === amount.toString() ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bidAmount: amount.toString(),
                      }))
                    }
                  >
                    ₹{amount.toLocaleString()} {/* Use Rupee symbol */}
                  </button>
                ))}
              </div>
              <div className="form-inputs-grid">
                <div className="form-field">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="John Doe"
                  />
                  <div className="error-text">{errors.name}</div>
                </div>
                <div className="form-field">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="john.doe@example.com"
                  />
                  <div className="error-text">{errors.email}</div>
                </div>
                <div className="form-field">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "0.6rem 0.5rem",
                        border: "1px solid #D1D5DB",
                        borderRight: "none",
                        borderRadius: "4px 0 0 4px",
                        backgroundColor: "#F3F4F6",
                        color: "#6B7280",
                      }}
                    >
                      +91 {/* Static prefix */}
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone} // Only the 10-digit number
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="9876543210" // Placeholder for the number part only
                      style={{
                        borderRadius: "0 4px 4px 0",
                        borderLeft: "none",
                      }} // Adjust border radius
                      inputMode="numeric" // Hint for numeric keyboard on mobile
                      pattern="[0-9]{10}" // HTML5 validation pattern (not strictly enforced by all browsers)
                    />
                  </div>
                  <div className="error-text">{errors.phone}</div>
                </div>
                <div className="form-field">
                  <label htmlFor="bidAmount" className="form-label">
                    Your Bid
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    name="bidAmount"
                    value={formData.bidAmount}
                    onChange={handleInputChange}
                    className="form-input"
                    min={minimumBid} // HTML5 min validation
                  />
                  <div className="error-text">{errors.bidAmount}</div>
                </div>
              </div>
              <div className="action-buttons">
                <button
                  type="submit"
                  className="place-bid-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing..." : "Place bid"}
                </button>
                <button
                  type="submit"
                  className="set-max-bid-btn"
                  disabled={isSubmitting}
                >
                  Set max bid
                </button>
              </div>
              {submitSuccess && (
                <p style={{ color: "#004276", textAlign: "center" }}>
                  Bid placed successfully!
                </p>
              )}
            </form>

            <div className="bid-history">
              <div className="history-header">
                <span>Bid history</span>
                <span>See all</span>
              </div>
              {mockBidHistory.map((bid) => (
                <div
                  key={bid.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.25rem 0",
                  }}
                >
                  <span>₹{bid.bid.toLocaleString()}</span>{" "}
                  {/* Use Rupee symbol */}
                  <span style={{ color: "#6B7280" }}>{bid.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
