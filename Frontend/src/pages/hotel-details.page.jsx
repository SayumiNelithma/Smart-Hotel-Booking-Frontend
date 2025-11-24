import { useParams } from "react-router";
import { hotels } from "../data.js";
import { Badge } from "@/components/ui/badge";
import { MapPin, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Wifi } from "lucide-react";
import { Building2 } from "lucide-react";
import { Tv } from "lucide-react";
import { Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddReviewMutation, useGetHotelByIdQuery, useGetReviewsForHotelQuery } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

const HotelDetailsPage = () => {
  const { _id } = useParams();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(_id);
  const { data: reviews = [] } = useGetReviewsForHotelQuery(_id);
  const [addReview, { isLoading: isAddReviewLoading }] = useAddReviewMutation();

  const { user } = useUser();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddReview = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const rating = Number(formData.get("rating"));
    const comment = String(formData.get("comment"));
    if (!rating || !comment) return;
    try {
      await addReview({
        hotelId: _id,
        comment,
        rating,
        userName: user?.fullName || user?.username || "Anonymous",
      }).unwrap();
      toast.success("Review added");
      form.reset();
      setIsReviewOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add review");
    }
  };

  if (isLoading) {
    return (
      <main className="px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative w-full h-[400px]">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-9 w-48" />
                <div className="flex items-center mt-2">
                  <Skeleton className="h-5 w-5 mr-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-24 w-full" />
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-7 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Error Loading Hotel Details
        </h2>
        <p className="text-muted-foreground">
          {error?.data?.message ||
            "Something went wrong. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <main className="px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full h-[400px]">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="absolute object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary">Rooftop View</Badge>
            <Badge variant="secondary">French Cuisine</Badge>
            <Badge variant="secondary">City Center</Badge>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">{hotel.location}</p>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Star className="h-4 w-4" />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-bold">{hotel?.rating ?? "No rating"}</span>
            <span className="text-muted-foreground">
              ({hotel?.reviews.length === 0 ? "No" : hotel?.reviews.length}{" "}
              reviews)
            </span>
          </div>
          <p className="text-muted-foreground">{hotel.description}</p>
          {isReviewOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsReviewOpen(false)}></div>
              <div className="relative z-10 w-full max-w-md">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Add a Review</h2>
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsReviewOpen(false)}>Close</Button>
                    </div>
                    <form onSubmit={handleAddReview} className="space-y-3">
                      <div>
                        <Label htmlFor="rating">Rating (1-5)</Label>
                        <Input id="rating" name="rating" type="number" min="1" max="5" required />
                      </div>
                      <div>
                        <Label htmlFor="comment">Comment</Label>
                        <Input id="comment" name="comment" required />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="submit" disabled={isAddReviewLoading} className={`${isAddReviewLoading ? "opacity-50" : ""}`}>
                          <PlusCircle className="w-4 h-4" /> {isAddReviewLoading ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 mr-2" />
                  <span>Free Wi-Fi</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>Restaurant</span>
                </div>
                <div className="flex items-center">
                  <Tv className="h-5 w-5 mr-2" />
                  <span>Flat-screen TV</span>
                </div>
                <div className="flex items-center">
                  <Coffee className="h-5 w-5 mr-2" />
                  <span>Coffee maker</span>
                </div>
              </div>
            </CardContent>
          </Card>

          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${hotel.price}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => navigate(`/hotels/${_id}/book`)}
              >
                Book Now
              </Button>
              <Button
                disabled={isAddReviewLoading}
                className={`${isAddReviewLoading ? "opacity-50" : ""}`}
                onClick={() => setIsReviewOpen(true)}
              >
                <PlusCircle className="w-4 h-4" /> Add Review
              </Button>
            </div>
            {/* <BookingDialog
              hotelName={hotel.name}
              hotelId={id}
              onSubmit={handleBook}
              isLoading={isCreateBookingLoading}
            /> */}
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                <ul className="space-y-2">
                  {reviews.map((rev) => (
                    <li key={rev._id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{rev.userName}</div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rev.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default HotelDetailsPage;
