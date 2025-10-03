// src/components/layout/footer.tsx
export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ArtAuction. All rights reserved.</p>
        <p className="mt-1">
          A modern platform for art collectors and galleries.
        </p>
      </div>
    </footer>
  );
}
