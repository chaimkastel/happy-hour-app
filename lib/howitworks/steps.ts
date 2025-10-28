/**
 * How It Works tutorial step configuration
 */

export type HowStep = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  phoneMedia: { 
    type: "image" | "video"; 
    src: string; 
    alt: string;
    videoProps?: {
      muted?: boolean;
      loop?: boolean;
      autoplay?: boolean;
    };
  };
  badge?: string;
  cta?: { 
    label: string; 
    href: string;
  };
};

export const steps: HowStep[] = [
  {
    id: "browse",
    title: "Browse deals",
    subtitle: "Discover local savings",
    description: "Explore happy-hour deals from your favorite restaurants. See what's available right now, tonight, or later this week.",
    phoneMedia: {
      type: "image",
      src: "/howitworks/s1.png",
      alt: "Browse deals screen showing a list of restaurant deals"
    },
    badge: "Step 1"
  },
  {
    id: "claim",
    title: "Claim & save",
    subtitle: "Tap to secure your deal",
    description: "Tap 'Claim & Redeem' to save the deal to your wallet. You'll get a unique QR code instantly.",
    phoneMedia: {
      type: "image",
      src: "/howitworks/s2.png",
      alt: "Claim deal screen with QR code display"
    },
    badge: "Step 2"
  },
  {
    id: "redeem",
    title: "Show at venue",
    subtitle: "Present your code",
    description: "Show your QR code to the restaurant at checkout. Get your discount applied automatically.",
    phoneMedia: {
      type: "image",
      src: "/howitworks/s3.png",
      alt: "QR code redemption screen at restaurant"
    },
    badge: "Step 3"
  },
  {
    id: "repeat",
    title: "Save money. Eat better. Repeat.",
    subtitle: "Build your foodie journey",
    description: "Discover new spots, try new cuisines, and save money while doing it. Happy hour happens every day.",
    phoneMedia: {
      type: "image",
      src: "/howitworks/s4.png",
      alt: "Wallet view showing saved deals and history"
    }
  }
];

export const defaultInitialStepId = "browse";

