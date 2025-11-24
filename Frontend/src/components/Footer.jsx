import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Globe
} from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeToggle";

const footerLinks = {
  company: [
    { name: "About Us", to: "/about" },
    { name: "Careers", to: "/careers" },
    { name: "Press", to: "/press" },
    { name: "Blog", to: "/blog" },
  ],
  support: [
    { name: "Help Center", to: "/help" },
    { name: "Contact Us", to: "/contact" },
    { name: "FAQs", to: "/faq" },
    { name: "Safety", to: "/safety" },
  ],
  legal: [
    { name: "Terms of Service", to: "/terms" },
    { name: "Privacy Policy", to: "/privacy" },
    { name: "Cookie Policy", to: "/cookies" },
    { name: "Accessibility", to: "/accessibility" },
  ],
  discover: [
    { name: "Destinations", to: "/destinations" },
    { name: "Travel Guides", to: "/guides" },
    { name: "Gift Cards", to: "/gift-cards" },
    { name: "Refer a Friend", to: "/refer" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com", ariaLabel: "Visit our Facebook page" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com", ariaLabel: "Visit our Twitter page" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com", ariaLabel: "Visit our Instagram page" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com", ariaLabel: "Visit our LinkedIn page" },
];

function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-border/50 bg-background/95 backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-4"
          >
            <Link
              to="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
              aria-label="Horizone Home"
            >
              <h2 className="text-2xl font-bold font-serif tracking-tight bg-gradient-to-r from-primary via-sage to-lavender bg-clip-text text-transparent">
                Horizone
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Discover your perfect staycation. Book unique hotels and experiences 
              that create lasting memories. Your journey to relaxation starts here.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:hello@horizone.com" 
                  className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
                >
                  hello@horizone.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="tel:+1234567890" 
                  className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>123 Travel Street, Vacation City, VC 12345</span>
              </div>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Discover Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">
              Discover
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground sr-only md:not-sr-only">
                Follow us:
              </span>
              <div className="flex items-center gap-3" role="list">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-primary"
                aria-label="Select language"
              >
                English (US)
              </Button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>
                © {currentYear} Horizone. All rights reserved.
              </p>
              <p className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-primary fill-primary" aria-hidden="true" /> for travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

