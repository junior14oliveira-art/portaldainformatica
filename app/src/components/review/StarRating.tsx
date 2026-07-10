import { Star } from "lucide-react";
import styles from "./StarRating.module.css";

type StarRatingProps = {
  value: number;
  size?: number;
};

export function StarRating({ value, size = 16 }: StarRatingProps) {
  const rounded = Math.round(value);
  return (
    <span className={styles.stars} aria-label={`${value.toFixed(1)} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i < rounded ? styles.filled : styles.empty}
          fill={i < rounded ? "currentColor" : "none"}
          aria-hidden
        />
      ))}
    </span>
  );
}
