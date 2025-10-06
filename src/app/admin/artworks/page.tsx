// src/app/admin/artworks/add/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";

// Validation schema
const artworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artistName: z.string().min(1, "Artist name is required"),
  lot: z.string().min(1, "Lot number is required"),
  startingBid: z.number().min(1, "Starting bid must be at least $1"),
  minIncrement: z.number().min(1, "Minimum increment must be at least $1"),
  medium: z.string().min(1, "Medium is required"),
  dimension: z.string().min(1, "Dimensions are required"),
});

type ArtworkFormData = z.infer<typeof artworkSchema>;

export default function AddArtworkPage() {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      startingBid: 100,
      minIncrement: 10,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "main"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (type === "cover") {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file));
    }
    setError(null);
  };

  const removeImage = (type: "cover" | "main") => {
    if (type === "cover") {
      setCoverImage(null);
      setCoverPreview(null);
    } else {
      setMainImage(null);
      setMainPreview(null);
    }
  };

  const onSubmit = async (data: ArtworkFormData) => {
    if (!coverImage || !mainImage) {
      setError("Both cover and main images are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      // Upload cover image
      const coverPath = `artworks/${Date.now()}_cover_${coverImage.name}`;
      const { error: coverError } = await supabase.storage
        .from("artworks")
        .upload(coverPath, coverImage, { upsert: true });

      if (coverError) throw coverError;

      // Upload main image
      const mainPath = `artworks/${Date.now()}_main_${mainImage.name}`;
      const { error: mainError } = await supabase.storage
        .from("artworks")
        .upload(mainPath, mainImage, { upsert: true });

      if (mainError) throw mainError;

      // Generate public URLs
      const { data: coverUrlData } = supabase.storage
        .from("artworks")
        .getPublicUrl(coverPath);
      const { data: mainUrlData } = supabase.storage
        .from("artworks")
        .getPublicUrl(mainPath);

      // TODO: Save to Supabase `artworks` table via API route or server action
      console.log("Artwork data to save:", {
        ...data,
        coverImageUrl: coverUrlData.publicUrl,
        mainImageUrl: mainUrlData.publicUrl,
      });

      // For now, redirect after upload
      alert("Artwork uploaded successfully!");
      router.push("/admin/artworks");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload artwork");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Artwork</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to list a new artwork for auction.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <X className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("cover")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "cover")}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="mt-4 inline-block bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Choose Cover Image
              </label>
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
              {mainPreview ? (
                <div className="relative">
                  <img
                    src={mainPreview}
                    alt="Main preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("main")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "main")}
                className="hidden"
                id="main-image"
              />
              <label
                htmlFor="main-image"
                className="mt-4 inline-block bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Choose Main Image
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              id="title"
              {...register("title")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Starry Night"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="artistName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Artist Name *
            </label>
            <input
              id="artistName"
              {...register("artistName")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Vincent van Gogh"
            />
            {errors.artistName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.artistName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lot"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lot Number *
            </label>
            <input
              id="lot"
              {...register("lot")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., L001"
            />
            {errors.lot && (
              <p className="text-red-500 text-sm mt-1">{errors.lot.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="medium"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Medium *
            </label>
            <input
              id="medium"
              {...register("medium")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Oil on canvas"
            />
            {errors.medium && (
              <p className="text-red-500 text-sm mt-1">
                {errors.medium.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dimension"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Dimensions *
            </label>
            <input
              id="dimension"
              {...register("dimension")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 73.7 cm × 92.1 cm"
            />
            {errors.dimension && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dimension.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="startingBid"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Starting Bid ($) *
            </label>
            <input
              id="startingBid"
              type="number"
              {...register("startingBid", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1000"
            />
            {errors.startingBid && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startingBid.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="minIncrement"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Minimum Increment ($) *
            </label>
            <input
              id="minIncrement"
              type="number"
              {...register("minIncrement", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50"
            />
            {errors.minIncrement && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minIncrement.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Uploading...
              </>
            ) : (
              "Add Artwork"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
