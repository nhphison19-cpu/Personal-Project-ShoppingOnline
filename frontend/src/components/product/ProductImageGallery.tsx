import { useState, useEffect } from "react";
import { ProductImage } from "../../types";

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0].url);
    } else {
      setActiveImage("https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600");
    }
  }, [images]);

  const allImages = images && images.length > 0
    ? images
    : [{ id: "fallback-single", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600" }];

  return (
    <div className="space-y-4 flex flex-col">
      {/* Main image */}
      <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden relative shadow-sm">
        <img
          src={activeImage}
          alt="Active preview showcase"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 bg-slate-50"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Thumbnails row */}
      {allImages.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 max-w-full">
          {allImages.map((img, idx) => {
            const isSelected = activeImage === img.url;
            return (
              <button
                key={img.id || idx}
                id={`thumb-btn-${img.id || idx}`}
                type="button"
                onClick={() => setActiveImage(img.url)}
                className={`w-18 h-18 rounded-xl overflow-hidden border-2 bg-slate-50 flex-shrink-0 transition focus:outline-none ${
                  isSelected ? "border-indigo-600 scale-95 shadow-sm" : "border-transparent hover:border-slate-300"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail detail preview ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default ProductImageGallery;
