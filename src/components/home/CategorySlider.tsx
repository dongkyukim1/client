"use client";

import { useState, useRef } from "react";
import { FaChevronRight, FaChevronLeft, FaFilter } from "react-icons/fa";

const categories = [
  { id: 1, name: "한적한 시골", icon: "🏡" },
  { id: 2, name: "절친 이야기", icon: "🎫" },
  { id: 3, name: "최고의 전망", icon: "🏞️" },
  { id: 4, name: "한옥", icon: "🏯" },
  { id: 5, name: "국립공원", icon: "🏔️" },
  { id: 6, name: "정적 공간", icon: "🧘" },
  { id: 7, name: "맛집 수영장", icon: "🍽️" },
  { id: 8, name: "해변 바로 앞", icon: "🏖️" },
  { id: 9, name: "섬", icon: "🏝️" },
  { id: 10, name: "기상천외한 숙소", icon: "🏨" },
  { id: 11, name: "캠핑", icon: "⛺" },
  { id: 12, name: "통나무집", icon: "🏡" },
  { id: 13, name: "동굴", icon: "🏞️" },
  { id: 14, name: "조소형 주택", icon: "🏠" },
];

interface CategorySliderProps {
  onFilterClick?: () => void;
  onCategorySelect?: (categoryId: number) => void;
  selectedCategory?: number | null;
}

export default function CategorySlider({ 
  onFilterClick, 
  onCategorySelect,
  selectedCategory 
}: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? current.scrollLeft - scrollAmount
          : current.scrollLeft + scrollAmount;

      current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="relative -mt-12 mb-16 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium text-sm text-gray-600">추천 카테고리</p>
        <button
          className="flex items-center px-3 py-1 text-sm rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          onClick={onFilterClick}
        >
          <FaFilter className="mr-2" />
          필터
        </button>
      </div>

      {showLeftArrow && (
        <button
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-white shadow-none border-none p-2 hover:bg-gray-100"
          onClick={() => scroll("left")}
        >
          <FaChevronLeft className="h-3 w-3" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto py-2 px-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={handleScroll}
      >
        <div className="flex">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex flex-col items-center min-w-[80px] mx-2 cursor-pointer transition-transform duration-200 hover:translate-y-[-2px] ${
                selectedCategory === category.id ? 'scale-110' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div
                className={`flex items-center justify-center w-[50px] h-[50px] mb-1 p-2 rounded-md bg-white shadow-sm text-2xl ${
                  selectedCategory === category.id ? 'border-2 border-pink-500' : ''
                }`}
              >
                {category.icon}
              </div>
              <p className={`text-xs text-center font-medium mt-1 ${
                selectedCategory === category.id ? 'text-pink-600' : 'text-gray-700'
              }`}>
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showRightArrow && (
        <button
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-white shadow-none border-none p-2 hover:bg-gray-100"
          onClick={() => scroll("right")}
        >
          <FaChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
