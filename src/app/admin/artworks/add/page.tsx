// "use client";

// import React, { useState, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Loader2, Upload, X, CheckCircle } from "lucide-react";

// // --- TEMPORARY STUBS FOR CANVAS ENVIRONMENT ---
// // In a local Next.js project, these should be replaced with actual implementations.
// const createSupabaseBrowserClient = () => ({
//   storage: {
//     from: (bucket: string) => ({
//       upload: async (path: string, file: File) => {
//         console.log(`SIMULATION: Uploading ${file.name} to ${bucket}/${path}`);
//         return { error: null };
//       },
//       getPublicUrl: (path: string) => ({
//         data: { publicUrl: `https://mock-cdn.com/${path}` },
//       }),
//     }),
//   },
// });
// const useRouter = () => ({
//   push: (path: string) => console.log(`SIMULATION: Navigating to ${path}`),
// });
// // --- END STUBS ---

// // --- VALIDATION SCHEMA ---
// // Updated validation messages to use the Rupee symbol (₹)
// const artworkSchema = z.object({
//   title: z
//     .string()
//     .min(2, "Title is required and must be at least 2 characters."),
//   artistName: z.string().min(2, "Artist name is required."),
//   lot: z.string().min(1, "Lot number is required (e.g., L001)."),
//   medium: z.string().min(2, "Medium is required (e.g., Oil on Canvas)."),
//   dimension: z
//     .string()
//     .min(2, "Dimensions are required (e.g., 73.7 cm × 92.1 cm)."),
//   startingBid: z
//     .number()
//     .min(50, "Starting bid must be at least ₹50.")
//     .max(1000000, "Starting bid limit reached."),
//   minIncrement: z
//     .number()
//     .min(5, "Minimum increment must be at least ₹5.")
//     .max(10000, "Increment limit reached."),
// });

// type ArtworkFormData = z.infer<typeof artworkSchema>;

// // --- REUSABLE COMPONENTS ---

// interface ImageUploaderProps {
//   label: string;
//   preview: string | null;
//   onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onRemove: () => void;
//   id: string;
//   required?: boolean;
//   fileError: string | null; // Added prop for specific file errors
// }

// const ImageUploader: React.FC<ImageUploaderProps> = ({
//   label,
//   preview,
//   onFileChange,
//   onRemove,
//   id,
//   required = false,
//   fileError = null,
// }) => {
//   return (
//     <div>
//       <label
//         htmlFor={id}
//         className="block text-base font-semibold text-gray-800 mb-2"
//       >
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div
//         // Reduced p-8 to p-6 and h-64 to h-56 to save vertical space
//         className={`border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 transition-all duration-200 cursor-pointer h-56 flex flex-col justify-center items-center relative
//           ${
//             fileError
//               ? "border-red-500"
//               : "border-gray-300 hover:border-teal-400"
//           }`}
//       >
//         {preview ? (
//           <div className="relative w-full h-full">
//             <img
//               src={preview}
//               alt={`${label} preview`}
//               className="w-full h-full object-cover rounded-lg shadow-md"
//               onError={(e) => {
//                 e.currentTarget.onerror = null;
//                 e.currentTarget.src =
//                   "https://placehold.co/300x200/cccccc/333333?text=Image+Load+Error";
//               }}
//             />
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onRemove();
//               }}
//               className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-colors"
//               aria-label={`Remove ${label}`}
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center">
//             <Upload className="h-10 w-10 text-gray-500" />
//             <p className="mt-3 text-sm text-gray-700 font-medium">
//               Drag & Drop or{" "}
//               <span className="text-teal-600 hover:text-teal-800">
//                 Click to Upload
//               </span>
//             </p>
//             <p className="text-xs text-gray-500 mt-1">PNG, JPG, Max 10MB</p>
//           </div>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onFileChange}
//           className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
//           id={id}
//           required={required && !preview}
//         />
//       </div>
//       {fileError && (
//         <p className="text-red-500 text-xs mt-2 font-medium">{fileError}</p>
//       )}
//     </div>
//   );
// };

// // --- MAIN FORM COMPONENT ---

// export default function AddArtworkPage() {
//   const router = useRouter();

//   // States for image files and previews
//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [mainImage, setMainImage] = useState<File | null>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);
//   const [mainPreview, setMainPreview] = useState<string | null>(null);

//   // State for image-specific errors (to display below uploader)
//   const [coverError, setCoverError] = useState<string | null>(null);
//   const [mainError, setMainError] = useState<string | null>(null);

//   // General submission states
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     clearErrors,
//   } = useForm<ArtworkFormData>({
//     resolver: zodResolver(artworkSchema),
//     defaultValues: {
//       startingBid: 500,
//       minIncrement: 50,
//     },
//   });

//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "cover" | "main"
//   ) => {
//     const file = e.target.files?.[0];
//     const setFileError = type === "cover" ? setCoverError : setMainError;
//     const setFile = type === "cover" ? setCoverImage : setMainImage;
//     const setPreview = type === "cover" ? setCoverPreview : setMainPreview;

//     // Clear previous errors
//     setFileError(null);
//     setError(null);

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setFileError(
//         "Invalid file type. Please upload an image file (JPEG, PNG)."
//       );
//       e.target.value = "";
//       return;
//     }

//     // Max file size check (10MB)
//     const MAX_SIZE = 10 * 1024 * 1024;
//     if (file.size > MAX_SIZE) {
//       setFileError(
//         "File size exceeds 10MB limit. Please choose a smaller image."
//       );
//       e.target.value = "";
//       return;
//     }

//     setFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const removeImage = (type: "cover" | "main") => {
//     if (type === "cover") {
//       setCoverImage(null);
//       setCoverPreview(null);
//       setCoverError(null); // Clear error on removal
//     } else {
//       setMainImage(null);
//       setMainPreview(null);
//       setMainError(null); // Clear error on removal
//     }
//   };

//   const onSubmit = async (data: ArtworkFormData) => {
//     if (!coverImage || !mainImage) {
//       setError(
//         "Critical: Both cover and main images must be uploaded to proceed."
//       );
//       if (!coverImage) setCoverError("Cover image is missing.");
//       if (!mainImage) setMainError("Main image is missing.");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setSuccessMessage(null);
//     clearErrors(); // Clear form field errors on submit attempt

//     try {
//       const supabase = createSupabaseBrowserClient();

//       // Upload cover image
//       const coverPath = `artworks/${Date.now()}_cover_${coverImage.name}`;
//       const { error: coverErrorResult } = await supabase.storage
//         .from("artworks")
//         .upload(coverPath, coverImage, { upsert: true });

//       if (coverErrorResult) throw coverErrorResult;

//       // Upload main image
//       const mainPath = `artworks/${Date.now()}_main_${mainImage.name}`;
//       const { error: mainErrorResult } = await supabase.storage
//         .from("artworks")
//         .upload(mainPath, mainImage, { upsert: true });

//       if (mainErrorResult) throw mainErrorResult;

//       // Generate public URLs (used for database entry)
//       const { data: coverUrlData } = supabase.storage
//         .from("artworks")
//         .getPublicUrl(coverPath);
//       const { data: mainUrlData } = supabase.storage
//         .from("artworks")
//         .getPublicUrl(mainPath);

//       // --- LOGIC SIMULATION: Data saved to DB ---
//       const finalData = {
//         ...data,
//         coverImageUrl: coverUrlData.publicUrl,
//         mainImageUrl: mainUrlData.publicUrl,
//       };
//       console.log("SUCCESS: Artwork data prepared for DB:", finalData);

//       setSuccessMessage(
//         `Artwork "${data.title}" was successfully added to the auction inventory!`
//       );
//       // Redirect after a brief moment to allow user to see success message
//       setTimeout(() => {
//         router.push("/admin/artworks");
//       }, 1500);
//     } catch (err: any) {
//       console.error(err);
//       setError(
//         err.message ||
//           "Failed to upload artwork. Please check network connection and try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reduced formGroupStyle padding from p-8 to p-6
//   const formGroupStyle =
//     "p-6 bg-white rounded-3xl shadow-xl border border-gray-50";
//   const inputStyle =
//     "w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm text-base placeholder:text-gray-400";

//   return (
//     // Removed min-h-screen and reduced padding
//     <div className="bg-gray-50 p-4 md:p-6 font-sans">
//       <div className="max-w-5xl mx-auto">
//         {/* Header Block: Reduced margin-bottom (mb-12 to mb-6) and padding (p-8 to p-6) */}
//         <div className="mb-6 p-6 bg-white rounded-3xl shadow-xl border-t-4 border-teal-600">
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             Add New Artwork
//           </h1>
//           <p className="text-gray-500 mt-1 text-base">
//             Complete the form to submit a new piece for upcoming auctions. All
//             fields marked with * are mandatory.
//           </p>
//         </div>

//         {/* Global Feedback: Reduced margin-bottom (mb-8 to mb-6) and padding (p-5 to p-4) */}
//         {(error || successMessage) && (
//           <div
//             className={`mb-6 p-4 rounded-xl font-semibold flex items-start shadow-lg transition-opacity duration-300 ${
//               error
//                 ? "bg-red-100 text-red-800 border-l-4 border-red-600"
//                 : "bg-teal-100 text-teal-800 border-l-4 border-teal-600"
//             }`}
//           >
//             {error ? (
//               <X className="h-5 w-5 mr-3 flex-shrink-0" />
//             ) : (
//               <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
//             )}
//             <span className="pt-0.5 text-sm">{error || successMessage}</span>
//           </div>
//         )}

//         {/* --- FORM START (Reduced space-y-10 to space-y-6) --- */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* 1. IMAGE ASSETS SECTION */}
//           <div className={formGroupStyle}>
//             <h2 className="text-xl font-bold text-teal-800 mb-6 pb-2 border-b border-gray-100">
//               1. Image Assets
//             </h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <ImageUploader
//                 label="Cover Image (Primary View)"
//                 preview={coverPreview}
//                 onFileChange={(e) => handleFileChange(e, "cover")}
//                 onRemove={() => removeImage("cover")}
//                 id="cover-image"
//                 required
//                 fileError={coverError}
//               />

//               <ImageUploader
//                 label="Main Image (High-Resolution Detail)"
//                 preview={mainPreview}
//                 onFileChange={(e) => handleFileChange(e, "main")}
//                 onRemove={() => removeImage("main")}
//                 id="main-image"
//                 required
//                 fileError={mainError}
//               />
//             </div>
//           </div>

//           {/* 2. ARTWORK METADATA SECTION */}
//           <div className={formGroupStyle}>
//             <h2 className="text-xl font-bold text-teal-800 mb-6 pb-2 border-b border-gray-100">
//               2. Artwork Metadata
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Title */}
//               <div>
//                 <label
//                   htmlFor="title"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Title *
//                 </label>
//                 <input
//                   id="title"
//                   {...register("title")}
//                   className={inputStyle}
//                   placeholder="e.g., Starry Night"
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-xs mt-1 font-medium">
//                     {errors.title.message}
//                   </p>
//                 )}
//               </div>

//               {/* Artist Name */}
//               <div>
//                 <label
//                   htmlFor="artistName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Artist Name *
//                 </label>
//                 <input
//                   id="artistName"
//                   {...register("artistName")}
//                   className={inputStyle}
//                   placeholder="e.g., Vincent van Gogh"
//                 />
//                 {errors.artistName && (
//                   <p className="text-red-500 text-xs mt-1 font-medium">
//                     {errors.artistName.message}
//                   </p>
//                 )}
//               </div>

//               {/* Lot Number */}
//               <div>
//                 <label
//                   htmlFor="lot"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Lot Number *
//                 </label>
//                 <input
//                   id="lot"
//                   {...register("lot")}
//                   className={inputStyle}
//                   placeholder="e.g., L001 / AU-2025-05"
//                 />
//                 {errors.lot && (
//                   <p className="text-red-500 text-xs mt-1 font-medium">
//                     {errors.lot.message}
//                   </p>
//                 )}
//               </div>

//               {/* Medium */}
//               <div>
//                 <label
//                   htmlFor="medium"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Medium *
//                 </label>
//                 <input
//                   id="medium"
//                   {...register("medium")}
//                   className={inputStyle}
//                   placeholder="e.g., Oil on canvas, Bronze"
//                 />
//                 {errors.medium && (
//                   <p className="text-red-500 text-xs mt-1 font-medium">
//                     {errors.medium.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Dimensions (Full Width for Clarity) */}
//             <div className="mt-6">
//               <label
//                 htmlFor="dimension"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Dimensions *
//               </label>
//               <input
//                 id="dimension"
//                 {...register("dimension")}
//                 className={inputStyle}
//                 placeholder="e.g., 73.7 cm × 92.1 cm or 29 × 36.25 in"
//               />
//               {errors.dimension && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">
//                   {errors.dimension.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* 3. AUCTION PRICING SECTION */}
//           <div className={formGroupStyle}>
//             <h2 className="text-xl font-bold text-teal-800 mb-6 pb-2 border-b border-gray-100">
//               3. Auction Pricing (in Indian Rupees)
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Starting Bid */}
//               <div>
//                 <label
//                   htmlFor="startingBid"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Starting Bid (₹) *
//                 </label>
//                 <input
//                   id="startingBid"
//                   type="number"
//                   {...register("startingBid", { valueAsNumber: true })}
//                   className={inputStyle}
//                   placeholder="e.g., 50000"
//                 />
//                 {errors.startingBid && (
//                   <p className="text-red-500 text-xs mt-1 font-medium">
//                     {errors.startingBid.message}
//                   </p>
//                 )}
//               </div>

//               {/* Minimum Increment */}
//               <div>
//                 <label
//                   htmlFor="minIncrement"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Minimum Increment (₹) *
//                 </label>
//                 <input
//                   id="minIncrement"
//                   type="number"
//                   {...register("minIncrement", { valueAsNumber: true })}
//                   className={inputStyle}
//                   placeholder="e.g., 500"
//                 />
//                 {errors.minIncrement && (
//                   <p className="text-red-500 text-xs mt-1 font-medium">
//                     {errors.minIncrement.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* SUBMIT BUTTON */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-2xl shadow-teal-300/50 hover:bg-teal-700 transition-all duration-200 disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="animate-spin h-5 w-5 mr-3" />
//                   Processing Submission...
//                 </>
//               ) : (
//                 "Add Artwork to Inventory"
//               )}
//             </button>
//           </div>
//         </form>
//         {/* --- FORM END --- */}
//       </div>
//     </div>
//   );
// }
