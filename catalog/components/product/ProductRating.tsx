import { Star } from "lucide-react";

type ProductRatingProps = {
  rating: number;        // e.g. 4.6
  count?: number;        // e.g. 12
  size?: number;         // icon size
};

export default function ProductRating({
  rating,
  count = 0,
  size = 16,
}: ProductRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={size} fill="currentColor" />;
          }
          if (i === fullStars && hasHalfStar) {
            return (
              <Star
                key={i}
                size={size}
                className="text-amber-500"
                fill="currentColor"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            );
          }
          return <Star key={i} size={size} className="text-muted-foreground" />;
        })}
      </div>

      <span className="font-medium text-foreground">
        {rating.toFixed(1)}
      </span>

      {count > 0 && (
        <span className="text-muted-foreground">
          · Expert rating ({count})
        </span>
      )}
    </div>
  );
}
