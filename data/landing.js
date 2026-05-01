import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
  Mic,
  Activity,
  Play,
  Stars,
  Sparkles,
  Scan,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <Mic className="h-8 w-8 text-blue-600" />,
    title: "Agentic AI Assistant (Aura)",
    description:
      "Interact with Aura, your sentient financial partner. Use voice or text to log transactions and get real-time guidance.",
  },
  {
    icon: <Activity className="h-8 w-8 text-blue-600" />,
    title: "3D Spending Strand",
    description:
      "Visualize your financial flow in a stunning interactive 3D space. Track every dollar as it moves through your digital life.",
  },
  {
    icon: <Play className="h-8 w-8 text-blue-600" />,
    title: "Cinematic Monthly Replay",
    description:
      "Experience your month like a movie. A cinematic recap of your wins, spends, and saves with celebratory feedback.",
  },
  {
    icon: <Stars className="h-8 w-8 text-blue-600" />,
    title: "The Galaxy of Success",
    description:
      "Watch your dashboard transform into a dynamic star map. Every milestone connects to form constellations of your wealth.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-blue-600" />,
    title: "Aura's Daily Wisdom",
    description:
      "Start every day with a Tarot-style financial mantra. AI-driven insights that help you build mindful spending habits.",
  },
  {
    icon: <Scan className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description:
      "Instantly extract data from any receipt using Gemini-powered OCR technology. No more manual entry.",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Welth has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I recommend Welth to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
  },
];