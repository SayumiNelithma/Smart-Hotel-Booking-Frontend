import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const AMENITIES = [
  "WiFi",
  "Pool",
  "Gym",
  "Spa",
  "Parking",
  "Restaurant",
  "Bar",
  "Room Service",
  "Air Conditioning",
  "Pet Friendly",
  "Beach Access",
  "Business Center",
];

const STAR_RATINGS = [5, 4, 3, 2, 1];

export function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  locations = [],
  isOpen = true,
  onToggle,
  className,
}) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    price: true,
    rating: true,
    amenities: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLocationToggle = (location) => {
    const currentLocations = filters.locations || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter((l) => l !== location)
      : [...currentLocations, location];
    onFilterChange({ locations: newLocations });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];
    onFilterChange({ amenities: newAmenities });
  };

  const handlePriceChange = (type, value) => {
    const numValue = value === "" ? undefined : Number(value);
    onFilterChange({
      [type === "min" ? "minPrice" : "maxPrice"]: numValue,
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      minRating: filters.minRating === rating ? undefined : rating,
    });
  };

  const handleStarRatingChange = (stars) => {
    onFilterChange({
      starRating: filters.starRating === stars ? undefined : stars,
    });
  };

  const hasActiveFilters =
    (filters.locations && filters.locations.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined ||
    filters.starRating !== undefined ||
    (filters.amenities && filters.amenities.length > 0);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {[
                  filters.locations?.length || 0,
                  filters.minPrice ? 1 : 0,
                  filters.maxPrice ? 1 : 0,
                  filters.minRating ? 1 : 0,
                  filters.starRating ? 1 : 0,
                  filters.amenities?.length || 0,
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn(
              "lg:sticky lg:top-4 h-fit",
              "lg:block",
              isOpen ? "block" : "hidden",
              className
            )}
          >
            <Card className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Location Filter */}
              <div>
                <button
                  onClick={() => toggleSection("location")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-medium text-sm">Location</h3>
                  {expandedSections.location ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.location && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {locations.map((location) => {
                        const isSelected =
                          filters.locations?.includes(location.name) || false;
                        return (
                          <label
                            key={location._id}
                            className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleLocationToggle(location.name)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{location.name}</span>
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Range Filter */}
              <div>
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-medium text-sm">Price Range</h3>
                  {expandedSections.price ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.price && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label htmlFor="minPrice" className="text-xs">
                            Min Price
                          </Label>
                          <Input
                            id="minPrice"
                            type="number"
                            placeholder="0"
                            value={filters.minPrice || ""}
                            onChange={(e) =>
                              handlePriceChange("min", e.target.value)
                            }
                            min="0"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="maxPrice" className="text-xs">
                            Max Price
                          </Label>
                          <Input
                            id="maxPrice"
                            type="number"
                            placeholder="1000"
                            value={filters.maxPrice || ""}
                            onChange={(e) =>
                              handlePriceChange("max", e.target.value)
                            }
                            min="0"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rating Filter */}
              <div>
                <button
                  onClick={() => toggleSection("rating")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-medium text-sm">Rating</h3>
                  {expandedSections.rating ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.rating && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div>
                        <Label className="text-xs mb-2 block">
                          Minimum Rating
                        </Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleRatingChange(rating)}
                              className={cn(
                                "px-3 py-1 rounded-md text-sm border transition-colors",
                                filters.minRating === rating
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background hover:bg-accent"
                              )}
                            >
                              {rating}+
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs mb-2 block">Star Rating</Label>
                        <div className="space-y-2">
                          {STAR_RATINGS.map((stars) => (
                            <label
                              key={stars}
                              className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                            >
                              <input
                                type="radio"
                                name="starRating"
                                checked={filters.starRating === stars}
                                onChange={() => handleStarRatingChange(stars)}
                                className="text-primary focus:ring-primary"
                              />
                              <span className="text-sm">
                                {stars} Star{stars > 1 ? "s" : ""}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Amenities Filter */}
              <div>
                <button
                  onClick={() => toggleSection("amenities")}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="font-medium text-sm">Amenities</h3>
                  {expandedSections.amenities ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.amenities && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {AMENITIES.map((amenity) => {
                        const isSelected =
                          filters.amenities?.includes(amenity) || false;
                        return (
                          <label
                            key={amenity}
                            className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleAmenityToggle(amenity)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{amenity}</span>
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

