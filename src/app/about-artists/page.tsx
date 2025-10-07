"use client";

import { useState, useEffect } from "react";

export default function ArtistsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Artist data (you can move this to a separate file or CMS later)
  const artists = [
    {
      name: "Neeraja Divate",
      bio: "is a non-figurative multimedia artist from Andhra Pradesh. She trained under Rameshwar Broota at Triveni Kala Sangam in New Delhi and was awarded a senior fellowship by the Ministry of Culture for 2017–2019. Neeraja’s mixed-media works have appeared in exhibitions both in India and abroad and often reflect contemplative minimalism and abstraction rooted in day-to-day forms.",
    },
    {
      name: "Renuka Sondhi Gulati",
      bio: "is a Delhi-based painter and sculptor. She has held numerous solo exhibitions in India and the USA, and her awards include a gold medal at the 2005 Agnipath National Competition and a Sculpture Prize at the 2011 International Art Biennale in Malta. Renuka’s work often explores themes of spirituality and nature and reflects her colorful, organic abstraction.",
    },
    {
      name: "Dilesh Hazare",
      bio: "is a versatile artist and designer known for his abstract paintings, watercolours and sculptures. A graduate of Goa College of Art and DACA (CDAC) Pune, his work spans diverse media—watercolour, oil, acrylic, charcoal and dry pastels—covering landscapes, portraits and abstracts. Hazare’s ‘Purushartha’ series are nudes that explore human endeavours through fluid, merged forms.",
    },
    {
      name: "Alka Jhamb",
      bio: "is a Delhi-based abstract painter whose work is inspired by the city’s architecture. She studied under eminent artist Rameshwar Broota and developed a unique abstract language. Her compositions use layered geometric forms and muted palettes, creating a restrained, lyrical constructivism. Jhamb has exhibited widely in India and her measured, minimalist style has earned recognition in contemporary Indian art circles. Her signature style balances hard-edged structure with soft colour to evoke urban forms.",
    },
    {
      name: "Anju Kaushik",
      bio: "is a Delhi-based artist known for transforming discarded materials into evocative sculptural reliefs. She embeds metal, wood, concrete and found objects into her works, creating tactile, high-relief surfaces that comment on urban waste and the environment and provoke reflection on consumption and decay. Kaushik studied under Rameshwar Broota and has held numerous exhibitions. Among her notable honours are a senior scholarship from India’s Ministry of Culture (2019) and a Gallery Art Positive fellowship (2012). Her works can be found in prominent collections at Vadebra Gallery, Sabitya Kala Parishad and Lalit Kala Akademi.",
    },
    {
      name: "Pratham Kaushik",
      bio: "is from Dehradun and presently in his final year at Shantiniketan. He is considered amongst the finest prospects in his class and has been an assistant to S.K. Sabajahan.",
    },
    {
      name: "Sudesh Mahan",
      bio: "is a renowned Indian visual artist educated at St. Aloysius College. His artistic journey began with a two-man exhibition at age 18, followed by group and street exhibitions across coastal Karnataka and Bangalore. Mahan transitioned from a career as an art director in theatre, film and television to focus on painting. His multifaceted career reflects a deep commitment to artistic expression across various media.",
    },
    {
      name: "S.K. Sahajahan",
      bio: "is a contemporary Indian painter and educator presently serving as an assistant professor of painting at Kala Bhavana, Visva Bharati University, Shantiniketan. His works reflect his focus on human relationships and contemporary sociopolitical themes. Sahajahan has held solo exhibitions and participated in many group shows globally. His honours include two Elizabeth Greenshield Foundation Grants (in 1998 and 2000) and the Avantika Award (bronze medal in 1998).",
    },
    {
      name: "Victor Selvaraj",
      bio: "was a painter known for his vibrant portrait and abstract paintings that reflect a deep connection to his Tamil heritage. A former head artist at Lalit Kala Akademi in Lucknow, his works are held in various collections and adorn homes, offices and museums in India, Germany, Canada, France and Japan.",
    },
    {
      name: "Aloke Tirtha Bhowmick",
      bio: "is the former head of the Art Department at The Doon School. He holds a Master of Fine Arts degree from Shantiniketan.",
    },
    {
      name: "Pradiptaa Chakraborty",
      bio: "is an abstract painter trained in graphics at Kala Bhavana, Shantiniketan and painting at Rabindra Bharati University. His vibrant works often draw on literature and performing arts (notably Bengali street theatre). He has held solo shows across India and participated in international group exhibitions, and his works are included in private collections of individuals such as Shashi Tharoor and Kalki Koechlin.",
    },
    {
      name: "Dr Dipto Narayan Chattopadhyay",
      bio: "is an internationally acclaimed contemporary artist who has held over 500 exhibitions worldwide (solo and group). His mixed-media paintings and sculptures often explore human forms and narrative themes. His global exposure and recognition place him among India’s most exhibited artists. Dipto holds a Master of Fine Arts from Jiwaji University in Gwalior.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-blue-800 font-serif leading-relaxed p-4 md:p-12 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/10 to-white -z-10"></div>

      {/* Title */}
      <h1
        className={`text-3xl md:text-4xl font-bold mb-8 text-center transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        About the Artists
      </h1>

      {/* Artist Cards */}
      <div className="max-w-4xl mx-auto space-y-8">
        {artists.map((artist, index) => (
          <div
            key={index}
            className={`relative p-6 md:p-8 rounded-lg border-4 border-blue-600 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#1e40af";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(30, 64, 175, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1d4ed8";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(30, 64, 175, 0.1)";
            }}
          >
            {/* Decorative Corner Lines */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-600 -ml-4 -mt-4"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-600 -mr-4 -mt-4"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-600 -ml-4 -mb-4"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-600 -mr-4 -mb-4"></div>

            {/* Content */}
            <p className="text-lg md:text-xl mb-4">
              <span className="font-bold italic">{artist.name}</span>{" "}
              {artist.bio}
            </p>

            {/* Hover Highlight */}
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-sm text-blue-600 italic">
        These artists represent a constellation of vision, technique, and spirit
        — each contributing uniquely to the legacy of Indian art.
      </div>

      {/* Optional: Floating decorative dots */}
      <div className="absolute top-10 left-5 w-3 h-3 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-2 h-2 bg-blue-300 rounded-full opacity-40 animate-bounce"></div>
    </div>
  );
}
