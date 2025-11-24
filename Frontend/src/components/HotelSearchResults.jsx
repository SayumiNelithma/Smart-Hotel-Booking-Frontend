import HotelCard from "@/components/HotelCard";
import { useGetHotelsBySearchQuery } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import { useSelector } from "react-redux";

// Helper function to apply AI filters to hotels
const applyAiFilters = (hotels, aiFilters, aiMatchedHotels = []) => {
  if (!aiFilters || !hotels) return hotels;

  // If we have AI matched hotels, prioritize them and include them
  if (aiMatchedHotels && aiMatchedHotels.length > 0) {
    console.log("Using AI matched hotels as primary results");
    return aiMatchedHotels;
  }

  return hotels.filter((hotel) => {
    // Price range filter
    if (aiFilters.priceRange.min !== null && hotel.price < aiFilters.priceRange.min) {
      return false;
    }
    if (aiFilters.priceRange.max !== null && hotel.price > aiFilters.priceRange.max) {
      return false;
    }

    // Location filter
    if (aiFilters.location) {
      const hotelLocation = (hotel.location || "").toLowerCase();
      if (!hotelLocation.includes(aiFilters.location.toLowerCase())) {
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
};

function HotelListings() {
  const query = useSelector((state) => state.search.query);
  const aiMatchedHotels = useSelector((state) => state.search.aiMatchedHotels);
  const aiFilters = useSelector((state) => state.search.aiFilters);

  const {
    data: hotels = [],
    isLoading,
    isError,
    error,
  } = useGetHotelsBySearchQuery(query);

  // ✅ 1. If AI matched hotels exist, render them directly (skip API)
  if (aiMatchedHotels && aiMatchedHotels.length > 0) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {aiMatchedHotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </section>
    );
  }

  // ✅ 2. Show loading state
  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))}
        </div>
      </section>
    );
  }

  // ✅ 3. Handle error state
  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-8 text-center">
        <p className="text-red-500 text-lg">
          Error loading hotels: {error?.message || "Something went wrong."}
        </p>
      </section>
    );
  }

  // ✅ 4. Apply AI filters to search results and show
  console.log("HotelSearchResults - AI filters:", aiFilters);
  console.log("HotelSearchResults - AI matched hotels:", aiMatchedHotels);
  console.log("HotelSearchResults - Hotels before filtering:", hotels.length);
  const filteredHotels = applyAiFilters(hotels, aiFilters, aiMatchedHotels);
  console.log("HotelSearchResults - Hotels after filtering:", filteredHotels.length);
  
  return (
    <section className="px-8 py-8 lg:py-8">
      {filteredHotels.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No hotels found for your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HotelListings;
