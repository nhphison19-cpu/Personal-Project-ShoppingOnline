import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, size = "md", readonly = true, onChange }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center space-x-0.5">
      {stars.map((star) => {
        const isFilled = star <= Math.round(rating);
        return (
          <button
            key={star}
            id={`star-btn-${star}`}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"} focus:outline-none`}
          >
            <Star
              className={`${starSize} ${
                isFilled ? "text-amber-400 fill-amber-400" : "text-slate-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
export default StarRating;
