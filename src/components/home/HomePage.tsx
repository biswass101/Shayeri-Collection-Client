import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/layout/TopBar";
import CategoryRow from "@/components/home/CategoryRow";
import VideoGrid from "@/components/home/VideoGrid";
import { useGetCategoriesQuery, useGetVideosQuery } from "@/features/home/homeApi";
import { useUI } from "@/components/layout/UIContext";

export default function HomePage() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { data: videosData, isLoading: isVideosLoading } = useGetVideosQuery();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useUI();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const base = categoriesData ?? [];
    return [{ id: "all", name: "All", slug: "all" }, ...base];
  }, [categoriesData]);

  const filteredVideos = useMemo(() => {
    if (!videosData) return [];
    const query = searchValue.trim().toLowerCase();
    const categoryFiltered =
      selectedCategory === "all"
        ? videosData
        : videosData.filter((video) => video.categorySlug === selectedCategory);

    if (!query) return categoryFiltered;
    return categoryFiltered.filter((video) =>
      `${video.title} ${video.subtitle}`.toLowerCase().includes(query)
    );
  }, [videosData, searchValue, selectedCategory]);

  return (
    <div>
      <TopBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <CategoryRow
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(value) => setSelectedCategory(value === "all" ? "all" : value)}
        isLoading={isCategoriesLoading}
      />
      <VideoGrid
        videos={filteredVideos}
        onSelect={(video) => navigate(`/watch/${video.id}`)}
        isLoading={isVideosLoading}
      />
    </div>
  );
}
