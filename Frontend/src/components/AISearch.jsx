import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { useAiSearchMutation } from "@/lib/api";
import HotelCard from "@/components/HotelCard";
import {
  setQuery,
  setAiMatchedHotels,
  clearAiMatchedHotels,
  setAiFilters,
  clearAiFilters,
  clearSearch,
} from "@/lib/features/searchSlice";

// Helper function to extract filter criteria from AI response
const extractFiltersFromResponse = (response, matchedHotels) => {
  const filters = {
    priceRange: { min: null, max: null },
    location: null,
    amenities: [],
    rating: null,
    keywords: []
  };

  if (!response) return filters;

  const lowerResponse = response.toLowerCase();
  
  // Extract price range mentions - more flexible patterns
  const pricePatterns = [
    /(\d+)\s*-\s*(\d+)\s*(dollars?|usd|\$)/,
    /between\s*(\d+)\s*and\s*(\d+)\s*(dollars?|usd|\$)/,
    /from\s*(\d+)\s*to\s*(\d+)\s*(dollars?|usd|\$)/
  ];
  
  for (const pattern of pricePatterns) {
    const match = lowerResponse.match(pattern);
    if (match) {
      filters.priceRange.min = parseInt(match[1]);
      filters.priceRange.max = parseInt(match[2]);
      break;
    }
  }
  
  // Single price limits
  if (!filters.priceRange.min && !filters.priceRange.max) {
    const singlePricePatterns = [
      /(under|below|less than|max|maximum)\s*(\d+)\s*(dollars?|usd|\$)/,
      /(over|above|more than|min|minimum)\s*(\d+)\s*(dollars?|usd|\$)/
    ];
    
    for (const pattern of singlePricePatterns) {
      const match = lowerResponse.match(pattern);
      if (match) {
        if (match[1].includes('under') || match[1].includes('below') || match[1].includes('less') || match[1].includes('max')) {
          filters.priceRange.max = parseInt(match[2]);
        } else {
          filters.priceRange.min = parseInt(match[2]);
        }
        break;
      }
    }
  }

  // Extract location mentions - expanded keywords including countries
  const locationKeywords = [
    'beach', 'city', 'mountain', 'downtown', 'resort', 'spa', 'coastal', 'urban', 'rural',
    'ocean', 'lake', 'river', 'hills', 'valley', 'desert', 'forest', 'island', 'peninsula',
    'waterfront', 'seaside', 'countryside', 'suburban', 'metropolitan',
    'canada', 'usa', 'united states', 'mexico', 'france', 'italy', 'spain', 'germany',
    'japan', 'china', 'australia', 'brazil', 'india', 'thailand', 'singapore', 'dubai'
  ];
  const foundLocation = locationKeywords.find(keyword => lowerResponse.includes(keyword));
  if (foundLocation) {
    filters.location = foundLocation;
  }

  // Extract amenities - expanded list
  const amenityKeywords = [
    'pool', 'gym', 'spa', 'restaurant', 'bar', 'wifi', 'parking', 'pet-friendly', 'balcony', 
    'ocean view', 'garden', 'terrace', 'fitness', 'sauna', 'jacuzzi', 'concierge', 'room service',
    'breakfast', 'air conditioning', 'tv', 'minibar', 'safe', 'laundry', 'business center'
  ];
  filters.amenities = amenityKeywords.filter(amenity => lowerResponse.includes(amenity));

  // Extract rating requirements - more patterns
  const ratingPatterns = [
    /(\d+)\s*star/,
    /rating.*?(\d+)/,
    /at least\s*(\d+)\s*star/,
    /minimum\s*(\d+)\s*star/
  ];
  
  for (const pattern of ratingPatterns) {
    const match = lowerResponse.match(pattern);
    if (match) {
      filters.rating = parseInt(match[1]);
      break;
    }
  }

  // Extract general keywords - expanded list
  const generalKeywords = [
    'luxury', 'budget', 'family', 'romantic', 'business', 'quiet', 'lively', 'modern', 'traditional',
    'elegant', 'chic', 'cozy', 'spacious', 'intimate', 'grand', 'boutique', 'resort', 'hotel',
    'affordable', 'expensive', 'cheap', 'premium', 'deluxe', 'standard', 'suite', 'villa'
  ];
  filters.keywords = generalKeywords.filter(keyword => lowerResponse.includes(keyword));

  return filters;
};

export default function AISearch() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [responseText, setResponseText] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [matchedHotels, setMatchedHotels] = useState([]);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [aiSearch, { isLoading }] = useAiSearchMutation();
  const aiFilters = useSelector((state) => state.search.aiFilters);
  const searchQuery = useSelector((state) => state.search.query);
  const aiMatchedHotels = useSelector((state) => state.search.aiMatchedHotels);
  
  // Check if we're in search mode
  const isSearchMode = searchQuery && searchQuery.trim() !== "" && (aiMatchedHotels.length > 0 || matchedHotels.length > 0 || totalCount > 0);

  async function handleSearch() {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    setResponseText("");
    setRecommendations([]);
    setMatchedHotels([]);
    dispatch(clearAiMatchedHotels());
    dispatch(clearAiFilters());
    dispatch(setQuery(trimmed));

    try {
      const payload = {
        query: trimmed,
        preferences: { vibe: "relaxing" },
        filters: {},
        page: 1,
        pageSize: 10,
      };
      const res = await aiSearch(payload).unwrap();

      // ✅ Use structured fields from API
      const { response, recommendations = [], matchedHotels = [], results = [], totalCount = 0 } = res;

      setResponseText(response || "");
      setRecommendations(recommendations);
      setMatchedHotels(matchedHotels);
      setResults(results);
      setTotalCount(totalCount);
      setPage(1);

      // ✅ Extract and set AI filters for hotel filtering
      const aiFilters = extractFiltersFromResponse(response, matchedHotels);
      dispatch(setAiFilters(aiFilters));
      
      // ✅ Update Redux for global filtering
      dispatch(setAiMatchedHotels(matchedHotels));
    } catch (e) {
      const msg =
        e?.data?.message || e?.error || "Could not get AI response. Try again.";
      setResponseText(msg);
      setRecommendations([]);
      setMatchedHotels([]);
      setResults([]);
      setTotalCount(0);
      dispatch(clearAiMatchedHotels());
    }
  }

  async function loadMore() {
    if (isLoading) return;
    const nextPage = page + 1;
    try {
      const payload = { query: value.trim(), page: nextPage, pageSize: 10 };
      const res = await aiSearch(payload).unwrap();
      const { results: newResults = [] } = res;
      setResults((r) => [...r, ...newResults]);
      setPage(nextPage);
    } catch (err) {
      // ignore for now or show a toast
    }
  }

  // Clear search function
  const handleClearSearch = useCallback(() => {
    setValue("");
    setResponseText("");
    setRecommendations([]);
    setMatchedHotels([]);
    setResults([]);
    setTotalCount(0);
    setPage(1);
    dispatch(clearSearch());
  }, [dispatch]);

  // Handle Escape key to clear search
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isSearchMode) {
        handleClearSearch();
      }
    }

    if (isSearchMode) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isSearchMode, handleClearSearch]);

  return (
    <div className="z-10 w-full max-w-lg">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Input
          placeholder="Describe your ideal stay..."
          name="query"
          value={value}
          className="bg-[#1a1a1a] text-white placeholder:text-white/70 border-0 rounded-full py-6 pl-4 pr-32 w-full"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div className="absolute right-2 flex items-center gap-2 h-[80%]">
          {isSearchMode && (
            <Button
              type="button"
              onClick={handleClearSearch}
              className="h-full bg-white/10 text-white rounded-full px-3 flex items-center gap-x-2 border-white/30 border hover:bg-white/20 hover:ring-2 hover:ring-white/50 transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Clear</span>
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isLoading || !value.trim()}
            className="h-full bg-black text-white rounded-full px-4 flex items-center gap-x-2 border-white border-2 hover:bg-black/80 hover:ring-2 hover:ring-white/50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Searching…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white" />
                <span className="text-sm">AI Search</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Response Display - Show recommendations count */}
      {/* {responseText && (
        <div className="mt-3 text-sm text-white/70 bg-green-500/20 border border-green-500/30 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-green-400" />
            <span className="font-medium text-green-300">
              AI found {matchedHotels.length} matching hotels and applied filters!
            </span>
          </div>
        </div>
      )} */}

      {/* Compact AI summary only (do not display hotel names in hero) */}
      {isSearchMode && (
        <div className="mt-3 text-sm text-white/80 bg-black/40 rounded-lg p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-white" />
              <span className="font-medium">
                AI found {matchedHotels.length || aiMatchedHotels.length || totalCount} matching hotels. Showing filtered results below.
              </span>
            </div>
            <Button
              type="button"
              onClick={handleClearSearch}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 h-auto py-1 px-2 text-xs"
            >
              Show All Hotels
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Indicator */}
      {/* {aiFilters && (
        (aiFilters.priceRange.min || aiFilters.priceRange.max || 
         aiFilters.location || aiFilters.amenities.length > 0 || 
         aiFilters.rating || aiFilters.keywords.length > 0) && (
          <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-300">Active AI Filters</span>
              <button
                onClick={() => {
                  dispatch(clearAiFilters());
                  setResponseText("");
                  setRecommendations([]);
                  setMatchedHotels([]);
                }}
                className="text-xs text-blue-300 hover:text-blue-100 underline"
              >
                Clear Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {aiFilters.priceRange.min && (
                <span className="px-2 py-1 bg-blue-500/30 rounded">Min: ${aiFilters.priceRange.min}</span>
              )}
              {aiFilters.priceRange.max && (
                <span className="px-2 py-1 bg-blue-500/30 rounded">Max: ${aiFilters.priceRange.max}</span>
              )}
              {aiFilters.location && (
                <span className="px-2 py-1 bg-blue-500/30 rounded">📍 {aiFilters.location}</span>
              )}
              {aiFilters.amenities.map((amenity, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-500/30 rounded">✨ {amenity}</span>
              ))}
              {aiFilters.rating && (
                <span className="px-2 py-1 bg-blue-500/30 rounded">⭐ {aiFilters.rating}+ stars</span>
              )}
              {aiFilters.keywords.map((keyword, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-500/30 rounded">🏷️ {keyword}</span>
              ))}
            </div>
          </div>
        )
      )} */}
    </div>
  );
}
