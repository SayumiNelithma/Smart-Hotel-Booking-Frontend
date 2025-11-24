import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useGetAllHotelsQuery } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Promotional images - using high-quality hotel/restaurant images
const promotionalImages = {
  explore: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
  hotel: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
  room: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
};

export default function PromotionalSection() {
  const { data: hotelsData, isLoading } = useGetAllHotelsQuery({ limit: 1 });
  const totalHotels = hotelsData?.total || 0;
  
  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Two stacked cards */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Top-Left Card - Explore More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden h-[300px] lg:h-[400px] group cursor-pointer"
            >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${promotionalImages.explore})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            </div>
            <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 text-white">
              <Globe className="w-8 h-8 lg:w-10 lg:h-10 mb-auto" />
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2 font-serif">
                  Explore more to get your comfort zone
                </h3>
                <p className="text-sm lg:text-base text-white/90 mb-4">
                  Book your perfect stay with us.
                </p>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6 py-6 text-sm font-medium border-2 border-white transition-all hover:scale-105"
                >
                  <Link to="/hotels">
                    Booking Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            </motion.div>

            {/* Bottom-Left Card - Hotels Available */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden h-[300px] lg:h-[400px] group cursor-pointer"
            >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${promotionalImages.hotel})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            </div>
            <div className="relative h-full flex flex-col justify-center p-6 lg:p-8 text-white">
              <h3 className="text-lg lg:text-xl font-semibold mb-4">
                Hotels Available
              </h3>
              {isLoading ? (
                <Skeleton className="h-16 w-48 bg-white/20" />
              ) : (
                <p className="text-5xl lg:text-6xl xl:text-7xl font-bold font-serif">
                  {formatNumber(totalHotels)}
                </p>
              )}
            </div>
            </motion.div>
          </div>

          {/* Right Large Card - Beyond Accommodation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden h-[300px] lg:h-[816px] group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${promotionalImages.room})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end p-6 lg:p-8 text-white">
              <div className="text-3xl lg:text-4xl xl:text-5xl font-bold font-serif leading-tight">
                <p>Beyond accommodation,</p>
                <p>creating memories of a</p>
                <p>lifetime</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

