import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Globe, Menu, X, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { clearSearch } from "@/lib/features/searchSlice";

function Navigation() {
  const { user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const searchQuery = useSelector((state) => state.search.query);
  const aiMatchedHotels = useSelector((state) => state.search.aiMatchedHotels);
  const isSearchMode = searchQuery && searchQuery.trim() !== "" && aiMatchedHotels.length > 0;
  
  const handleShowAllHotels = () => {
    dispatch(clearSearch());
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when pressing escape key
  useEffect(() => {
    function handleEscKey(event) {
      if (isMenuOpen && event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="z-50 glass-strong flex items-center justify-between px-4 sm:px-6 py-3 rounded-full mx-4 my-3 relative theme-transition"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-xl font-bold font-serif tracking-tight hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
          aria-label="Horizone Home"
        >
          Horizone
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            to={`/`}
            className="transition-colors text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded px-2 py-1"
          >
            Home
          </Link>
          {isSearchMode && (
            <button
              onClick={handleShowAllHotels}
              className="transition-colors text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded px-2 py-1"
            >
              Show All Hotels
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="text-xs hidden md:flex"
          aria-label="Language selector"
        >
          <Globe className="h-4 w-4 mr-2" />
          EN
        </Button>
        <SignedOut>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs hidden md:flex"
          >
            <Link to="/sign-in">Log In</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-white text-black hover:bg-gray-200 text-xs hidden md:flex"
          >
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>
        {/* <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs hidden md:flex"
        >
          <Link to="/sign-in">Log In</Link>
        </Button>
        <Button
          size="sm"
          asChild
          className="bg-white text-black hover:bg-gray-200 text-xs hidden md:flex"
        >
          <Link to="/sign-up">Sign Up</Link>
        </Button> */}
        <SignedIn>
          <UserButton />
          {user?.publicMetadata?.role !== "admin" && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs hidden md:flex"
            >
              <Link to="/account/bookings" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                My Bookings
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            asChild
            className="bg-white text-black hover:bg-gray-200 text-xs hidden md:flex"
          >
            <Link to="/my-account">My Account</Link>
          </Button>
        </SignedIn>

        {/* Mobile Menu Button */}
        <div className="relative md:hidden">
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="relative z-20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 rounded-xl glass-strong border shadow-lg py-2 px-3 z-50"
                style={{ top: "calc(100% + 8px)" }}
                role="menu"
                aria-orientation="vertical"
              >
                <div className="flex flex-col space-y-2 py-2">
                  <Link
                    to="/"
                    className="text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    Home
                  </Link>
                  {isSearchMode && (
                    <button
                      onClick={() => {
                        handleShowAllHotels();
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring text-left"
                      role="menuitem"
                    >
                      Show All Hotels
                    </button>
                  )}
                  {user?.publicMetadata?.role === "admin" && (
                    <Link
                      to="/hotels/create"
                      className="text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Create Hotel
                    </Link>
                  )}
                  <div className="h-px bg-border my-1"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start h-8 px-2"
                    aria-label="Language selector"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    EN
                  </Button>

                  <SignedOut>
                    <Link
                      to="/sign-in"
                      className="text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Log In
                    </Link>

                    <Button
                      size="sm"
                      className="w-full mt-2"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link to="/sign-up" role="menuitem">Sign Up</Link>
                    </Button>
                  </SignedOut>

                  {/* Show My Bookings only for signed-in non-admin users */}
                  <SignedIn>
                    {user?.publicMetadata?.role !== "admin" && (
                      <Link
                        to="/account/bookings"
                        className="text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        My Bookings
                      </Link>
                    )}
                    <Link
                      to="/my-account"
                      className="text-sm font-medium hover:text-primary transition-colors px-2 py-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      My Account
                    </Link>
                  </SignedIn>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navigation;
