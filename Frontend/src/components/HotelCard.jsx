import { MapPin, Star } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { LazyImage } from "./LazyImage";
import { Card } from "./ui/card";

function HotelCard(props) {
  const hotel = props.hotel;
  const imageUrl = String(hotel.image || "https://via.placeholder.com/640x480?text=Hotel+image");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card variant="elevated" className="overflow-hidden p-0 h-full">
        <Link
          to={`/hotels/${hotel._id}`}
          className="block group relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-xl"
          aria-label={`View details for ${hotel.name} in ${hotel.location}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <LazyImage
              src={imageUrl}
              alt={`${hotel.name} hotel image`}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
              <span className="truncate" title={hotel.location}>{hotel.location}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary flex-shrink-0" aria-hidden="true" />
              <span className="font-medium" aria-label={`Rating: ${hotel?.rating ?? "No rating"}`}>
                {hotel?.rating ?? "No rating"}
              </span>
              <span className="text-muted-foreground" aria-label={`${hotel.reviews?.length ?? "No"} reviews`}>
                ({hotel.reviews?.length ?? "No"} Reviews)
              </span>
            </div>
            <div className="flex items-baseline space-x-2 pt-1">
              <span className="text-xl font-bold text-primary" aria-label={`Price: $${hotel.price} per night`}>
                ${hotel.price}
              </span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}

export default HotelCard;
