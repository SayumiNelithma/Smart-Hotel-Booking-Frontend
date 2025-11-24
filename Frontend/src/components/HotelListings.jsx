import HotelCard from "@/components/HotelCard";
import { useGetAllHotelsQuery, useGetAllLocationsQuery } from "@/lib/api";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import LocationTab from "./LocationTab";
import { Skeleton } from "./ui/skeleton";
import { LoadingSkeleton } from "./ui/loading-spinner";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { SortDropdown } from "./SortDropdown";
import { ViewToggle } from "./ViewToggle";
import { HotelListView } from "./HotelListView";
import { cn } from "@/lib/utils";

// Helper function to apply AI filters to hotels
const applyAiFilters = (hotels, aiFilters, aiMatchedHotels = []) => {
  if (!aiFilters || !hotels) return hotels;

  // If we have AI matched hotels, prioritize them and include them
  if (aiMatchedHotels && aiMatchedHotels.length > 0) {
    return aiMatchedHotels;
  }

  const filteredHotels = hotels.filter((hotel) => {
    // Price range filter
    if (aiFilters.priceRange.min !== null && hotel.price < aiFilters.priceRange.min) {
      return false;
    }
    if (aiFilters.priceRange.max !== null && hotel.price > aiFilters.priceRange.max) {
      return false;
    }

    // Location filter - more flexible matching
    if (aiFilters.location) {
      const hotelLocation = (hotel.location || "").toLowerCase();
      const filterLocation = aiFilters.location.toLowerCase();
      
      // Check if location contains the filter term anywhere
      const locationMatch = hotelLocation.includes(filterLocation);
      
      // Also check if it's a country name and look for it in the last part of location (after comma)
      let countryMatch = false;
      if (['canada', 'usa', 'united states', 'mexico', 'france', 'italy', 'spain', 'germany', 'japan', 'china', 'australia', 'brazil', 'india', 'thailand', 'singapore', 'dubai'].includes(filterLocation)) {
        const locationParts = hotelLocation.split(',').map(part => part.trim());
        countryMatch = locationParts.some(part => part.includes(filterLocation));
      }
      
      if (!locationMatch && !countryMatch) {
        return false;
      }
    }

    // Amenities filter
    if (aiFilters.amenities && aiFilters.amenities.length > 0) {
      const hotelAmenities = (hotel.amenities || []).map(a => a.toLowerCase());
      const hasRequiredAmenities = aiFilters.amenities.every(amenity => 
        hotelAmenities.some(hotelAmenity => hotelAmenity.includes(amenity.toLowerCase()))
      );
      if (!hasRequiredAmenities) {
        return false;
      }
    }

    // Rating filter
    if (aiFilters.rating && hotel.rating < aiFilters.rating) {
      return false;
    }

    // Keywords filter (search in name and description)
    if (aiFilters.keywords && aiFilters.keywords.length > 0) {
      const searchText = `${hotel.name} ${hotel.description || ""}`.toLowerCase();
      const hasKeywords = aiFilters.keywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
      if (!hasKeywords) {
        return false;
      }
    }

    return true;
  });
  
  return filteredHotels;
};

function HotelListings() {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState("grid");
  const aiFilters = useSelector((state) => state.search.aiFilters);
  const aiMatchedHotels = useSelector((state) => state.search.aiMatchedHotels);
  const searchQuery = useSelector((state) => state.search.query);
  
  // Check if we're in search mode - active when there's a query and matched hotels or active filters
  const hasActiveFilters = aiFilters && (
    (aiFilters.priceRange && (aiFilters.priceRange.min !== null || aiFilters.priceRange.max !== null)) ||
    aiFilters.location ||
    (aiFilters.amenities && aiFilters.amenities.length > 0) ||
    aiFilters.rating !== null ||
    (aiFilters.keywords && aiFilters.keywords.length > 0)
  );
  const isSearchMode = searchQuery && searchQuery.trim() !== "" && (aiMatchedHotels.length > 0 || hasActiveFilters);

  const {
    data: hotelsData,
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useGetAllHotelsQuery(); // No pagination params = get all hotels

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useGetAllLocationsQuery();

  // Handle both old format (array) and new format (object with hotels property)
  const hotels = Array.isArray(hotelsData) 
    ? hotelsData 
    : hotelsData?.hotels || [];

  const allLocations = locations
    ? [{ _id: 0, name: "All" }, ...locations]
    : [{ _id: 0, name: "All" }];

  const handleLocationSelect = (selectedLocation) => {
    setSelectedLocation(selectedLocation._id);
  };

  const selectedLocationName = allLocations.find(
    (el) => selectedLocation === el._id
  )?.name || "All";

  // First apply location filter, then apply AI filters
  const locationFilteredHotels =
    selectedLocation === 0
      ? hotels
      : hotels.filter((hotel) => {
          const parts = (hotel.location || "").split(",");
          const country = parts[parts.length - 1]?.trim().toLowerCase();
          return country === selectedLocationName?.trim().toLowerCase();
        });

  // Apply AI filters to the location-filtered hotels
  const filteredHotels = applyAiFilters(locationFilteredHotels, aiFilters, aiMatchedHotels);

  // Apply sorting to filtered hotels
  const sortedHotels = useMemo(() => {
    const hotels = [...filteredHotels];
    switch (sortBy) {
      case "price-asc":
        return hotels.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return hotels.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating-desc":
        return hotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name-asc":
        return hotels.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "featured":
      default:
        // Featured: sort by rating (highest first)
        return hotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }, [filteredHotels, sortBy]);

  const isLoading = isHotelsLoading || isLocationsLoading;
  const isError = isHotelsError || isLocationsError;
  const error = [hotelsError, locationsError];

  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>

        <Skeleton className="h-6 flex items-center flex-wrap gap-x-4" />

        <Skeleton className="h-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>
        <p className="text-red-500">Error loading data </p>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-8 py-8 lg:py-12" aria-labelledby="hotels-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 id="hotels-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </motion.div>

      {/* Location Filters - Show only when not in search mode */}
      {!isSearchMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-8"
          role="tablist"
          aria-label="Filter by location"
        >
          {allLocations.map((location) => {
            return (
              <LocationTab
                onClick={handleLocationSelect}
                location={location}
                selectedLocation={selectedLocation}
                key={location._id}
              />
            );
          })}
        </motion.div>
      )}
      
      {/* Search Mode Indicator */}
      {isSearchMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            Showing AI search results for: <span className="font-semibold text-foreground">"{searchQuery}"</span>
          </p>
        </motion.div>
      )}

      {/* Toolbar with Sort and View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              Showing {sortedHotels.length} {sortedHotels.length === 1 ? "hotel" : "hotels"}
            </>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
            className="flex-1 sm:flex-none"
          />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </motion.div>

      {sortedHotels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg">
            No hotels found matching your criteria.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={cn(
            "grid gap-6",
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {sortedHotels.map((hotel, index) => {
            return (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {view === "grid" ? (
                  <HotelCard hotel={hotel} />
                ) : (
                  <HotelListView hotel={hotel} index={index} />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}

export default HotelListings;
