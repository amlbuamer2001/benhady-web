export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "info@ebinhadi.com",
    phones: ["920022379", "+966 50 659 1444"],
    whatsapp: "+966 50 659 1444",
  },
  social: [
    { name: "linkedin", label: "LinkedIn", href: "#", icon: "/icons/linkedin.svg" },
    { name: "snapchat", label: "Snapchat", href: "#", icon: "/icons/snapchat.svg" },
    { name: "x", label: "X", href: "#", icon: "/icons/x.svg" },
    { name: "instagram", label: "Instagram", href: "#", icon: "/icons/instagram.svg" },
    { name: "facebook", label: "Facebook", href: "#", icon: "/icons/facebook.svg" },
  ],
} as const;

/** Google Maps link for a place/address (opens the Maps app on phones). */
export const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "cars", href: "/cars" },
  { key: "contact", href: "/contact" },
  { key: "faq", href: "/faq" },
] as const;

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  verifyPhone: "/verify-phone",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  terms: "/terms",
  privacy: "/privacy",
  cars: "/cars",
  booking: "/booking",
  profile: "/profile",
  bookings: "/bookings",
  notifications: "/notifications",
} as const;
