// src/app/page.tsx
// IMPORTANT: "use client" MUST be the FIRST LINE in the file.
"use client";

import { artworks as artworkData } from "@/data/artworks.json";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createAnonymousSupabaseClient } from "@/lib/supabase-client";
import Link from "next/link"; // Import Link from next/link
import * as React from "react";

// --- Interfaces ---
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
  startingBid: number;
  minimumIncrement: number;
  page: number;
  image: string;
}

interface Artwork {
  id: string;
  lotNumber: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: string;
  startingBid: number;
  minimumIncrement: number;
  page: number;
  image: string;
}

interface SupabasePledge {
  id: string;
  name: string;
  pledge_amount: number;
  created_at: string;
  artwork_id: string; // Add this to link pledges to artworks
}

const HomePage = () => {
  const router = useRouter();
  // State to hold fetched pledges for all artworks
  const [allPledges, setAllPledges] = useState<SupabasePledge[]>([]);
  const [isFetchingAllPledges, setIsFetchingAllPledges] = useState(true);

  // Memoized anonymous client
  const supabase = useMemo(() => {
    return createAnonymousSupabaseClient();
  }, []);

  // Fetch pledges for *all* artworks
  useEffect(() => {
    const fetchAllPledges = async () => {
      setIsFetchingAllPledges(true);
      const { data, error } = await supabase
        .from("pledges")
        .select("id, name, pledge_amount, created_at, artwork_id");

      if (error) {
        console.error("Error fetching all pledges from Supabase:", error);
        setAllPledges([]);
      } else {
        setAllPledges(data || []);
      }
      setIsFetchingAllPledges(false);
    };

    fetchAllPledges();
  }, [supabase]);

  // Calculate the effective next minimum pledge for each artwork based on its pledges
  const artworksWithEffectiveMin = useMemo(() => {
    if (isFetchingAllPledges) {
      // If pledges are still loading, use the static starting bid
      return artworkData.map((art) => ({
        id: art.id,
        lotNumber: art.lotNumber,
        title: art.title,
        artist: art.artist,
        medium: art.medium,
        dimensions: art.dimensions.formatted,
        startingBid: art.startingBid,
        minimumIncrement: art.minimumIncrement,
        page: art.page,
        image: art.image,
        effectiveNextMinPledge: art.startingBid, // Use starting bid while loading
      }));
    }

    return artworkData.map((art) => {
      // Find pledges for the current artwork
      const artPledges = allPledges.filter(
        (pledge) => pledge.artwork_id === art.id
      );

      let highestPledgeForArtwork = art.startingBid;
      if (artPledges.length > 0) {
        // Find the maximum pledge amount for this specific artwork
        highestPledgeForArtwork = Math.max(
          ...artPledges.map((pledge) => pledge.pledge_amount)
        );
      }

      // Calculate the effective next minimum pledge
      const effectiveNextMinPledge =
        highestPledgeForArtwork + art.minimumIncrement;

      return {
        id: art.id,
        lotNumber: art.lotNumber,
        title: art.title,
        artist: art.artist,
        medium: art.medium,
        dimensions: art.dimensions.formatted,
        startingBid: art.startingBid,
        minimumIncrement: art.minimumIncrement,
        page: art.page,
        image: art.image,
        effectiveNextMinPledge, // Add the calculated effective minimum
      };
    });
  }, [artworkData, allPledges, isFetchingAllPledges]);

  const handleArtworkClick = (id: string) => {
    router.push(`/artworks/${id}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #FFFFFF; color: #111827; margin: 0; }
        .page-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #E5E7EB; }
        .header-logo { font-weight: 700; font-size: 1.5rem; letter-spacing: 2px; color: #000000; }
        .header-nav { display: none; gap: 1.5rem; }
        @media (min-width: 768px) { .header-nav { display: flex; } }
        .header-nav a { text-decoration: none; color: #4B5563; } /* This style targets the Link component too */
        .header-icons { display: flex; gap: 1rem; }
        .header-icons button { background: none; border: 1px solid #D1D5DB; border-radius: 4px; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.9rem; }

        .hero { padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 2.5rem; font-weight: 700; color: #004276; margin-bottom: 1rem; }
        .hero p { font-size: 1.125rem; color: #4B5563; max-width: 600px; margin: 0 auto; }

        .gallery { padding: 2rem 0; }
        .gallery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; }
        .artwork-card { border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s; }
        .artwork-card:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .artwork-image { width: 100%; height: 200px; object-fit: cover; }
        .artwork-info { padding: 1rem; }
        .card-lot-number { font-size: 0.875rem; color: #6B7280; }
        .card-title { font-size: 1rem; font-weight: 600; margin: 0.25rem 0; }
        .card-artist { font-size: 0.875rem; color: #4B5563; margin: 0.25rem 0; }
        .card-bid-info { display: flex; justify-content: space-between; margin-top: 0.5rem; }
        .bid-label { font-size: 0.75rem; color: #6B7280; }
        .bid-value { font-size: 0.875rem; font-weight: 600; color: #004276; }

        .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8f9fa; color: #333; }
        .spinner { width: 50px; height: 50px; border: 3px solid rgba(0,0,0,0.1); border-top-color: #111; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page-container">
        <header className="header">
          <div className="header-logo">
            <Link href="/" className="logo-link">
              Palettes of Promise
            </Link>{" "}
            {/* Use Link for the logo */}
          </div>
          <nav className="header-nav">
            <Link href="/">Home</Link> {/* Use Link for Home */}
            <Link href="/about">About</Link> {/* Use Link for About */}
            <Link href="/contact">Contact</Link> {/* Use Link for Contact */}
          </nav>
          <div className="header-icons">
            <button onClick={() => console.log("Viewing Cart")}>
              Cart (0)
            </button>
          </div>
        </header>

        <section className="hero">
          <h1>Discover Extraordinary Art</h1>
          <p>
            Browse our curated collection of unique artworks and make a pledge
            today.
          </p>
        </section>

        <section className="gallery">
          <div className="gallery-header">
            <h2>Artwork Gallery</h2>
          </div>

          {isFetchingAllPledges ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Loading artworks and pledges...</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {artworksWithEffectiveMin.map((artwork) => (
                <div
                  key={artwork.id}
                  className="artwork-card"
                  onClick={() => handleArtworkClick(artwork.id)}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="artwork-image"
                  />
                  <div className="artwork-info">
                    <div className="card-lot-number">{artwork.lotNumber}</div>
                    <h3 className="card-title">{artwork.title}</h3>
                    <div className="card-artist">{artwork.artist}</div>
                    <div className="card-bid-info">
                      <div>
                        <div className="bid-label">Next Minimum Pledge</div>
                        <div className="bid-value">
                          ₹{artwork.effectiveNextMinPledge.toLocaleString()}{" "}
                          {/* Display the calculated effective minimum */}
                        </div>
                      </div>
                      {/* Optionally, you could also show the starting bid */}
                      {/* <div>
                        <div className="bid-label">Starting</div>
                        <div className="bid-value">₹{artwork.startingBid.toLocaleString()}</div>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default HomePage;
