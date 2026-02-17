import { Button } from "@/components/ui/button";
import type { Category } from "@/features/home/homeTypes";

type CategoryRowProps = {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  isLoading?: boolean;
};

const skeletonWidths = ["68px", "86px", "74px", "92px", "64px", "80px"];
const skeletonClass =
  "relative overflow-hidden rounded-full bg-accent before:absolute before:inset-0 before:block before:content-[''] before:-translate-x-full before:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_100%)] before:animate-shimmer";

export default function CategoryRow({
  categories,
  selectedCategory,
  onSelect,
  isLoading = false,
}: CategoryRowProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-3" aria-busy={isLoading}>
      {isLoading
        ? skeletonWidths.map((width, index) => (
            <div
              key={`category-skeleton-${index}`}
              className={`${skeletonClass} h-8`}
              style={{ width }}
              aria-hidden="true"
            />
          ))
        : categories.map((category) => (
            <Button
              key={category.slug}
              variant={category.slug === selectedCategory ? "default" : "secondary"}
              size="sm"
              className="rounded-full px-3 py-2 text-xs sm:text-sm"
              type="button"
              onClick={() => onSelect(category.slug)}
            >
              {category.name}
            </Button>
          ))}
    </div>
  );
}
