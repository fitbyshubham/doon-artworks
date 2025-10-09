// src/app/artworks/[id]/page.tsx
// IMPORTANT: "use client" MUST be the FIRST LINE in the file.
"use client";

import { notFound } from "next/navigation";
import { artworks as artworkData } from "@/data/artworks.json";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

// --- Interfaces matching your JSON structure ---
interface ArtworkJSON {
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
  startingBid: number; // Represents starting pledge
  minimumIncrement: number; // Represents minimum pledge increment
  page: number;
  image: string;
}

// Internal interface for the component
interface Artwork {
  id: string;
  lotNumber: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: string; // Using the formatted string
  startingBid: number; // Starting pledge amount
  minimumIncrement: number; // Minimum pledge increment
  page: number;
  image: string;
  topBid: number; // Represents current top pledge (starts as startingBid)
}

// Interface for pledge items fetched from Supabase
interface SupabasePledge {
  id: string; // UUID from Supabase
  name: string;
  pledge_amount: number;
  created_at: string; // ISO string
}

// --- CLIENT COMPONENT ---
const ArtworkDetailClient = ({ artwork }: { artwork: Artwork }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pledgeAmount: (artwork.topBid + artwork.minimumIncrement).toString(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);

  // --- NEW STATES FOR SUPABASE INTEGRATION ---
  const [pledges, setPledges] = useState<SupabasePledge[]>([]);
  const [isFetchingPledges, setIsFetchingPledges] = useState(true);
  // --- END NEW STATES ---

  // --- INITIALIZE SUPABASE CLIENT ---
  const supabase = createSupabaseBrowserClient();
  // --- END INITIALIZE SUPABASE CLIENT ---

  // --- FETCH PLEDGES FROM SUPABASE ---
  useEffect(() => {
    const fetchPledges = async () => {
      setIsFetchingPledges(true);
      const { data, error } = await supabase
        .from("pledges")
        .select("id, name, pledge_amount, created_at")
        .eq("artwork_id", artwork.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pledges from Supabase:", error);
        setPledges([]);
      } else {
        setPledges(data || []);
      }
      setIsFetchingPledges(false);
    };

    fetchPledges();
  }, [supabase, artwork.id]);
  // --- END FETCH PLEDGES ---

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.pledgeAmount) {
      newErrors.pledgeAmount = "Pledge amount is required";
    } else {
      const pledgeAmount = parseFloat(formData.pledgeAmount);
      if (isNaN(pledgeAmount)) {
        newErrors.pledgeAmount = "Please enter a valid amount";
      } else if (pledgeAmount < artwork.topBid + artwork.minimumIncrement) {
        newErrors.pledgeAmount = `Pledge must be at least ₹${(
          artwork.topBid + artwork.minimumIncrement
        ).toLocaleString()}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Inside ArtworkDetailClient component

  // --- UPDATE YOUR handleSubmit FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // --- 1. Prepare Pledge Data ---
      const pledgeData = {
        artwork_id: artwork.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        pledge_amount: parseFloat(formData.pledgeAmount),
      };

      console.log(
        "Preparing to submit pledge data to Supabase (Anonymously):",
        pledgeData
      );

      // --- 2. Create a Dedicated Anonymous Supabase Client Instance ---
      // This ensures the operation uses the ANON key only, ignoring any session token.
      // It's a robust way to enforce public access for this specific write operation.
      const anonSupabaseClient = createSupabaseBrowserClient(); // Use your existing client creator
      // Note: The client created by `createSupabaseBrowserClient` using `@supabase/ssr`
      // and the ANON key from env vars is designed to be anonymous-first.
      // However, if a session cookie exists, it might still be used.
      // To be absolutely sure, we can explicitly clear the session for this client instance.
      // While `@supabase/ssr` handles much of this, explicitly signing out the temp client
      // guarantees no session is used for the insert.
      await anonSupabaseClient.auth.signOut(); // Force sign out to ensure anonymity

      // --- 3. Submit to Supabase USING the Anonymous Client ---
      const { data, error: insertError } = await anonSupabaseClient // <-- Use anon client
        .from("pledges")
        .insert([pledgeData])
        .select(); // Optionally select the inserted row

      if (insertError) {
        console.error(
          "Error submitting pledge to Supabase (Anonymously):",
          insertError
        );
        // Provide user feedback
        alert(
          `Failed to submit pledge: ${
            insertError.message || "Please try again."
          }`
        );
        // Consider setting a specific error state if needed for UI
      } else {
        console.log(
          "Pledge submitted successfully to Supabase (Anonymously):",
          data
        );
        setSubmitSuccess(true);

        // --- 4. Reset Form ---
        setFormData({
          name: "",
          email: "",
          phone: "",
          pledgeAmount: (artwork.topBid + artwork.minimumIncrement).toString(),
        });
        setErrors({});

        // --- 5. Re-fetch Pledges to Update the List ---
        // Use the main `supabase` client instance for fetching.
        // Fetching might require RLS policy for SELECT (e.g., `TO public` or `TO authenticated`)
        const { data: newPledgesData, error: fetchError } = await supabase
          .from("pledges")
          .select("id, name, pledge_amount, created_at")
          .eq("artwork_id", artwork.id)
          .order("created_at", { ascending: false });

        if (!fetchError && newPledgesData) {
          setPledges(newPledgesData);
        } else if (fetchError) {
          console.error("Error re-fetching pledges:", fetchError);
          // Optionally, inform the user the list might not be updated
          // alert("Pledge submitted, but list update failed. Refresh the page.");
        }
      }
    } catch (error) {
      console.error("Unexpected error during pledge submission:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END UPDATED handleSubmit ---

  const minimumPledge = artwork.topBid + artwork.minimumIncrement;
  const pledgeIncrements = [
    minimumPledge,
    minimumPledge + artwork.minimumIncrement,
    minimumPledge + artwork.minimumIncrement * 2,
    minimumPledge + artwork.minimumIncrement * 3,
  ];

  // --- RENDER ---
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #FFFFFF; color: #111827; margin: 0; }
        .page-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .main-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; padding: 2rem 0; }
        @media (min-width: 1024px) { .main-grid { grid-template-columns: 1fr 0.8fr; } }
        .left-column, .right-column { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #E5E7EB; }
        .header-logo { font-weight: 700; font-size: 1.5rem; letter-spacing: 2px; color: #000000; }
        .header-nav { display: none; gap: 1.5rem; }
        @media (min-width: 768px) { .header-nav { display: flex; } }
        .header-nav a { text-decoration: none; color: #4B5563; }
        .header-icons { display: flex; gap: 1rem; }
        .header-icons button { background: none; border: 1px solid #D1D5DB; border-radius: 4px; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.9rem; }
        
        .artwork-image-main { width: 100%; height: auto; object-fit: cover; border: 1px solid #E5E7EB; cursor: zoom-in; }
        .artwork-description { color: #374151; line-height: 1.6; }
        
        .artwork-info { display: flex; flex-direction: column; gap: 0.5rem; }
        .info-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .lot-number { font-size: 1.25rem; font-weight: 600; color: #000000; }
        .artist-name { font-size: 1.25rem; font-weight: 600; color: #374151; }
        .artwork-title { font-size: 1.75rem; font-weight: 700; color: #004276; display: inline-block; animation: shimmer 2s infinite linear; background: linear-gradient(90deg, #004276, #8B5CF6, #004276); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        
        .auction-details { border: 1px solid #E5E7EB; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; }
        .detail-row:not(:last-child) { border-bottom: 1px solid #E5E7EB; }
        .detail-label { color: #4B5563; }
        .detail-value { font-weight: 600; }
        .current-pledge-value { color: #004276; }
        .met-status { padding: 1rem; color: #004276; font-weight: 600; font-size: 0.875rem; border-top: 1px solid #E5E7EB; }
        
        .pledge-form-section { display: flex; flex-direction: column; gap: 1.5rem; }
        .pledge-increments { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
         @media (min-width: 480px) { .pledge-increments { grid-template-columns: repeat(4, 1fr); } }
        .pledge-increment-btn { padding: 0.75rem; border-radius: 4px; border: 1px solid #D1D5DB; background-color: #FFFFFF; cursor: pointer; font-weight: 500; text-align: center; transition: background-color 0.2s, color 0.2s; }
        .pledge-increment-btn.active { background-color: #111827; color: #FFFFFF; border-color: #111827; }
        
        .form-inputs-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .form-inputs-grid { grid-template-columns: 1fr 1fr; } }
        .form-field { display: flex; flex-direction: column; }
        .form-label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
        .form-input-wrapper { display: flex; align-items: center; }
        .form-input-prefix { padding: 0.6rem 0.5rem; border: 1px solid #D1D5DB; border-right: none; border-radius: 4px 0 0 4px; background-color: #F3F4F6; color: #6B7280; }
        .form-input { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid #D1D5DB; border-left: none; border-radius: 0 4px 4px 0; box-sizing: border-box; font-size: 1rem; }
        .error-text { color: #EF4444; font-size: 0.75rem; margin-top: 0.25rem; height: 1em; }
        
        .action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .place-pledge-btn, .set-max-pledge-btn { padding: 0.875rem; border-radius: 4px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
        .place-pledge-btn { background-color: #F3F4F6; border: 1px solid #D1D5DB; color: #111827; }
        .place-pledge-btn:hover { background-color: #E5E7EB; }
        .set-max-pledge-btn { background-color: #111827; border: 1px solid #111827; color: #FFFFFF; }
        .set-max-pledge-btn:hover { background-color: #000000; }
        
        .pledge-history { border-top: 1px solid #E5E7EB; padding-top: 1.5rem; }
        .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .history-item { display: flex; justify-content: space-between; padding: 0.25rem 0; align-items: center; }
        .history-pledge { font-weight: 500; }
        .history-time { color: #6B7280; font-size: 0.9rem; }
        
        .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8f9fa; color: #333; }
        .spinner { width: 50px; height: 50px; border: 3px solid rgba(0,0,0,0.1); border-top-color: #111; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .zoom-modal { position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
        .zoom-modal img { max-width: 90%; max-height: 90%; object-fit: contain; }
      `}</style>

      {imageZoom && (
        <div className="zoom-modal" onClick={() => setImageZoom(false)}>
          <img src={artwork.image} alt={artwork.title} />
        </div>
      )}

      <div className="page-container">
        <header className="header">
          <div className="header-logo">Palettes of Promise</div>
          <nav className="header-nav"></nav>
          <div className="header-icons">
            <button onClick={() => router.push("/")}>Back to Gallery</button>
          </div>
        </header>
      </div>

      <main className="page-container">
        <div className="main-grid">
          <div className="left-column">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="artwork-image-main"
              onClick={() => setImageZoom(true)}
            />
            <div className="artwork-description">
              <p>
                {artwork.artist} - {artwork.medium} - {artwork.dimensions}
              </p>
            </div>
          </div>

          <div className="right-column">
            <div className="artwork-info">
              <div className="info-header">
                <div className="lot-number">{artwork.lotNumber}</div>
              </div>
              <h1 className="artwork-title">{artwork.title}</h1>
              <h2 className="artist-name">{artwork.artist}</h2>
            </div>

            <div className="auction-details">
              <div className="detail-row">
                <span className="detail-label">Pledge closes</span>
                <span className="detail-value">Oct. 31, 2025 at 12:00 AM</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Starting pledge</span>
                <span className="detail-value current-pledge-value">
                  ₹{artwork.startingBid.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Minimum Increment</span>
                <span className="detail-value">
                  ₹{artwork.minimumIncrement.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Next Minimum Pledge</span>
                <span className="detail-value">
                  ₹
                  {(
                    artwork.startingBid + artwork.minimumIncrement
                  ).toLocaleString()}
                </span>
              </div>
              <div className="met-status">Accepted minimum price is met</div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="pledge-form-section"
              noValidate
            >
              <div className="pledge-increments">
                {pledgeIncrements.map((amount) => (
                  <button
                    type="button"
                    key={amount}
                    className={`pledge-increment-btn ${
                      formData.pledgeAmount === amount.toString()
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        pledgeAmount: amount.toString(),
                      }))
                    }
                  >
                    ₹{amount.toLocaleString()}
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
                  <div className="form-input-wrapper">
                    <span className="form-input-prefix">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="9876543210"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="error-text">{errors.phone}</div>
                </div>
                <div className="form-field">
                  <label htmlFor="pledgeAmount" className="form-label">
                    Your Pledge
                  </label>
                  <input
                    type="number"
                    id="pledgeAmount"
                    name="pledgeAmount"
                    value={formData.pledgeAmount}
                    onChange={handleInputChange}
                    className="form-input"
                    min={minimumPledge}
                  />
                  <div className="error-text">{errors.pledgeAmount}</div>
                </div>
              </div>
              <div className="action-buttons">
                <button
                  type="submit"
                  className="place-pledge-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Pledging..." : "Place pledge"}
                </button>
                <button
                  type="submit"
                  className="set-max-pledge-btn"
                  disabled={isSubmitting}
                >
                  Set max pledge
                </button>
              </div>
              {submitSuccess && (
                <p
                  style={{
                    color: "#004276",
                    textAlign: "center",
                    fontWeight: "600",
                    padding: "10px",
                    backgroundColor: "#e6f4ea",
                    borderRadius: "4px",
                    border: "1px solid #004276",
                    marginTop: "10px",
                  }}
                >
                  Thank you for your pledge!
                </p>
              )}
            </form>

            {/* --- PLEDGE HISTORY (UPDATED TO USE SUPABASE DATA) --- */}
            <div className="pledge-history">
              <div className="history-header">
                <span style={{ fontWeight: "600" }}>Pledge history</span>
              </div>

              {isFetchingPledges ? (
                <p>Loading pledges...</p>
              ) : pledges.length > 0 ? (
                pledges.map((pledge) => (
                  <div key={pledge.id} className="history-item">
                    <span className="history-pledge">
                      {pledge.name
                        ? `${pledge.name.charAt(0)}. ${
                            pledge.name.split(" ").pop() || ""
                          }`
                        : "Anonymous"}
                    </span>
                    <span className="history-pledge">
                      ₹{pledge.pledge_amount.toLocaleString("en-IN")}
                    </span>
                    <span className="history-time">
                      {new Date(pledge.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p>No pledges yet. Be the first!</p>
              )}
            </div>
            {/* --- END PLEDGE HISTORY --- */}
          </div>
        </div>
      </main>
    </>
  );
};
// --- END CLIENT COMPONENT ---

// --- SERVER LOGIC WRAPPER ---
export default function ArtworkDetailPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id: artworkId } = resolvedParams;

  const foundArtworkJSON = artworkData.find((art) => art.id === artworkId);

  if (!foundArtworkJSON) {
    return <div>Artwork not found</div>;
  }

  const artwork: Artwork = {
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
    topBid: foundArtworkJSON.startingBid,
  };

  return <ArtworkDetailClient artwork={artwork} />;
}
// --- END SERVER LOGIC WRAPPER ---

// Import React at the top for `React.use`
import * as React from "react";
// --- END IMPORTS ---
