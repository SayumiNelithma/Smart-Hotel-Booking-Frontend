import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { useGetAllHotelsQuery, useGetAllLocationsQuery } from "@/lib/api";
import HotelCard from "@/components/HotelCard";
import { HotelListView } from "@/components/HotelListView";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SortDropdown } from "@/components/SortDropdown";
import { ViewToggle } from "@/components/ViewToggle";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateIllustration } from "@/components/Illustration";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get filters from URL
  const filters = useMemo(() => {
    const locations = searchParams.getAll("locations");
    const amenities = searchParams.getAll("amenities");
    
    return {
      locations: locations.length > 0 ? locations : undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      minRating: searchParams.get("minRating")
        ? Number(searchParams.get("minRating"))
        : undefined,
      starRating: searchParams.get("starRating")
        ? Number(searchParams.get("starRating"))
        : undefined,
      sortBy: searchParams.get("sortBy") || "featured",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    };
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    
    // Add array params
    if (newFilters.locations && newFilters.locations.length > 0) {
      newFilters.locations.forEach((loc) => params.append("locations", loc));
    }
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      newFilters.amenities.forEach((amenity) =>
        params.append("amenities", amenity)
      );
    }
    
    // Add single params
    if (newFilters.minPrice !== undefined) {
      params.set("minPrice", newFilters.minPrice.toString());
    }
    if (newFilters.maxPrice !== undefined) {
      params.set("maxPrice", newFilters.maxPrice.toString());
    }
    if (newFilters.minRating !== undefined) {
      params.set("minRating", newFilters.minRating.toString());
    }
    if (newFilters.starRating !== undefined) {
      params.set("starRating", newFilters.starRating.toString());
    }
    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy);
    }
    if (newFilters.page && newFilters.page > 1) {
      params.set("page", newFilters.page.toString());
    }
    
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (changes) => {
    updateFilters({ ...filters, ...changes, page: 1 }); // Reset to page 1 on filter change
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const handleSortChange = (sortBy) => {
    updateFilters({ ...filters, sortBy, page: 1 });
  };

  const handlePageChange = (page) => {
    updateFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch hotels with filters
  const {
    data: hotelsData,
    isLoading,
    isError,
    error,
  } = useGetAllHotelsQuery(filters);

  // Fetch locations for filter dropdown
  const { data: locations = [] } = useGetAllLocationsQuery();

  const hotels = hotelsData?.hotels || [];
  const total = hotelsData?.total || 0;
  const totalPages = hotelsData?.totalPages || 1;
  const currentPage = filters.page || 1;

  // Get active filter chips
  const activeFilters = useMemo(() => {
    const chips = [];
    if (filters.locations && filters.locations.length > 0) {
      filters.locations.forEach((loc) => {
        chips.push({ type: "location", value: loc, label: loc });
      });
    }
    if (filters.minPrice !== undefined) {
      chips.push({
        type: "minPrice",
        value: filters.minPrice,
        label: `Min: $${filters.minPrice}`,
      });
    }
    if (filters.maxPrice !== undefined) {
      chips.push({
        type: "maxPrice",
        value: filters.maxPrice,
        label: `Max: $${filters.maxPrice}`,
      });
    }
    if (filters.minRating !== undefined) {
      chips.push({
        type: "minRating",
        value: filters.minRating,
        label: `${filters.minRating}+ Rating`,
      });
    }
    if (filters.starRating !== undefined) {
      chips.push({
        type: "starRating",
        value: filters.starRating,
        label: `${filters.starRating} Stars`,
      });
    }
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach((amenity) => {
        chips.push({ type: "amenity", value: amenity, label: amenity });
      });
    }
    return chips;
  }, [filters]);

  const removeFilter = (chip) => {
    if (chip.type === "location") {
      const newLocations = filters.locations?.filter((l) => l !== chip.value);
      handleFilterChange({
        locations: newLocations && newLocations.length > 0 ? newLocations : undefined,
      });
    } else if (chip.type === "amenity") {
      const newAmenities = filters.amenities?.filter((a) => a !== chip.value);
      handleFilterChange({
        amenities: newAmenities && newAmenities.length > 0 ? newAmenities : undefined,
      });
    } else {
      handleFilterChange({ [chip.type]: undefined });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif">
            Discover Hotels
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find your perfect staycation destination from our curated collection
            of hotels worldwide.
          </p>
        </motion.div>

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {activeFilters.map((chip) => (
              <div
                key={`${chip.type}-${chip.value}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => removeFilter(chip)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              locations={locations}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing {hotels.length} of {total} hotels
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SortDropdown
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="flex-1 sm:flex-none"
                />
                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div
                className={cn(
                  "grid gap-6",
                  view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={view === "grid" ? "h-64" : "h-48"}
                  />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">
                  {error?.data?.message || "Failed to load hotels"}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && hotels.length === 0 && (
              <EmptyStateIllustration message="No hotels found matching your criteria. Try adjusting your filters." />
            )}

            {/* Hotels Grid/List */}
            {!isLoading && !isError && hotels.length > 0 && (
              <>
                <div
                  className={cn(
                    "grid gap-6 mb-8",
                    view === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  )}
                >
                  {hotels.map((hotel, index) =>
                    view === "grid" ? (
                      <HotelCard key={hotel._id} hotel={hotel} />
                    ) : (
                      <HotelListView
                        key={hotel._id}
                        hotel={hotel}
                        index={index}
                      />
                    )
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default HotelsPage;
