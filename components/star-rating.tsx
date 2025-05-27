import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, max = 5, size = "sm" }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const starSize = sizeClasses[size]
  const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={`${starSize} fill-primary text-primary`} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${starSize} text-muted`} />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className={`${starSize} fill-primary text-primary`} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-muted`} />
      ))}
      <span className={`ml-1 ${textSize} text-muted-foreground font-mono`}>{rating.toFixed(1)}</span>
    </div>
  )
}
