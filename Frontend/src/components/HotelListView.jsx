import { Link } from "react-router";
import { MapPin, Star, Wifi, Car, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { LazyImage } from "./LazyImage";
import { cn } from "@/lib/utils";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  Restaurant: Utensils,
};

export function HotelListView({ hotel, index = 0 }) {
  const amenities = hotel.amenities || [];
  const displayAmenities = amenities.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card variant="elevated" className="overflow-hidden">
        <Link
          to={`/hotels/${hotel._id}`}
          className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg"
          aria-label={`View details for ${hotel.name}`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden bg-muted">
              <LazyImage
                src={hotel.image || "https://via.placeholder.com/640x480?text=Hotel+image"}
                alt={hotel.name}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">{hotel.location}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-primary mb-1">
                      ${hotel.price}
                    </div>
                    <div className="text-xs text-muted-foreground">per night</div>
                  </div>
                </div>

                {/* Rating */}
                {hotel.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                      <span className="ml-1 font-medium">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({hotel.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Description */}
                {hotel.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {hotel.description}
                  </p>
                )}

                {/* Amenities */}
                {displayAmenities.length > 0 && (
                  <div className="flex items-center gap-4 flex-wrap mb-4">
                    {displayAmenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || null;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-1 text-sm text-muted-foreground"
                        >
                          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                    {amenities.length > 3 && (
                      <span className="text-sm text-muted-foreground">
                        +{amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/hotels/${hotel._id}`}>View Details</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link to={`/hotels/${hotel._id}/book`}>Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}

