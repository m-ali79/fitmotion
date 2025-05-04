import {
  Dumbbell,
  Clipboard,
  Bot,
  Zap,
  Heart,
  Activity,
  Flame,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Scale,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Nav Links
export interface NavLink {
  title: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { title: "Features", href: "#features" },
  { title: "Workouts", href: "#workout-categories" },
  { title: "Results", href: "#transformations" },
  { title: "FAQ", href: "#faq" },
];

// Features Scroll Data
export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  iconBg: string;
}

export const features: Feature[] = [
  {
    title: "Track your workouts",
    description:
      "Keep track of your sets, reps, and weights with detailed workout logging and progress tracking.",
    icon: Dumbbell,
    color: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
    hoverColor: "hover:from-blue-500/30 hover:to-blue-600/20",
    iconBg: "bg-blue-500/20",
  },
  {
    title: "Nutrition tracking",
    description:
      "Log your meals with our intelligent food recognition system. Track calories, macros, and micronutrients effortlessly.",
    icon: Clipboard,
    color: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
    hoverColor: "hover:from-purple-500/30 hover:to-purple-600/20",
    iconBg: "bg-purple-500/20",
  },
  {
    title: "Smart coaching",
    description:
      "Get personalized workout plans and real-time form feedback from our AI coach. Train smarter, not harder.",
    icon: Bot,
    color: "bg-gradient-to-br from-red-500/20 to-red-600/10",
    hoverColor: "hover:from-red-500/30 hover:to-red-600/20",
    iconBg: "bg-red-500/20",
  },
];

// Workout Categories Data
export interface CategoryMetrics {
  sessions: string;
  level: string;
  focus: string;
}
export interface Category {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
  hoverColor: string;
  icon: LucideIcon;
  metrics: CategoryMetrics;
}

export const categories: Category[] = [
  {
    id: 1,
    title: "Strength Training",
    description: "Build muscle, increase strength, and boost your metabolism",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    color: "from-blue-500/30 to-blue-600/10",
    hoverColor: "hover:from-blue-500/40 hover:to-blue-600/20",
    icon: Dumbbell,
    metrics: {
      sessions: "3-4",
      level: "All Levels",
      focus: "Muscle Growth",
    },
  },
  {
    id: 2,
    title: "HIIT Workouts",
    description: "Maximize calorie burn and improve cardiovascular fitness",
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
    color: "from-fitness-primary/30 to-red-600/10",
    hoverColor: "hover:from-fitness-primary/40 hover:to-red-600/20",
    icon: Zap,
    metrics: {
      sessions: "2-3",
      level: "Intermediate",
      focus: "Fat Burning",
    },
  },
  {
    id: 3,
    title: "Cardio & Endurance",
    description: "Improve stamina, heart health, and overall endurance",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    color: "from-green-500/30 to-green-600/10",
    hoverColor: "hover:from-green-500/40 hover:to-green-600/20",
    icon: Heart,
    metrics: {
      sessions: "3-5",
      level: "All Levels",
      focus: "Heart Health",
    },
  },
  {
    id: 4,
    title: "Flexibility & Mobility",
    description:
      "Enhance range of motion, reduce injury risk, and recover faster",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    color: "from-purple-500/30 to-purple-600/10",
    hoverColor: "hover:from-purple-500/40 hover:to-purple-600/20",
    icon: Activity,
    metrics: {
      sessions: "2-4",
      level: "All Levels",
      focus: "Flexibility",
    },
  },
  {
    id: 5,
    title: "Full Body Circuits",
    description:
      "Efficient total-body workouts to maximize results in minimal time",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    color: "from-amber-500/30 to-amber-600/10",
    hoverColor: "hover:from-amber-500/40 hover:to-amber-600/20",
    icon: Flame,
    metrics: {
      sessions: "2-3",
      level: "Intermediate",
      focus: "Total Body",
    },
  },
  {
    id: 6,
    title: "Fat Loss Focus",
    description:
      "Strategic workouts designed specifically for maximum fat burning",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    color: "from-teal-500/30 to-teal-600/10",
    hoverColor: "hover:from-teal-500/40 hover:to-teal-600/20",
    icon: Flame,
    metrics: {
      sessions: "3-5",
      level: "All Levels",
      focus: "Weight Loss",
    },
  },
];

// Bento Grid Data
export interface BentoItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  iconBg: string;
}

export const bentoCards: BentoItem[] = [
  {
    icon: Clipboard,
    title: "AI Nutrition Planner",
    description:
      "Get personalized calorie and macro targets. Log meals instantly with just a photo.",
    color: "bg-gradient-to-br from-purple-500/20 to-purple-600/5",
    hoverColor: "hover:from-purple-500/30 hover:to-purple-600/20",
    iconBg: "bg-purple-500/20",
  },
  {
    icon: Dumbbell,
    title: "Workout Logging",
    description:
      "Easily track your exercises, sets, reps, and weights to monitor your strength progression.",
    color: "bg-gradient-to-br from-blue-500/20 to-blue-600/5",
    hoverColor: "hover:from-blue-500/30 hover:to-blue-600/20",
    iconBg: "bg-blue-500/20",
  },
  {
    icon: Scale,
    title: "Progress Tracking",
    description:
      "Monitor your weight changes and visualize your fitness journey with insightful charts.",
    color: "bg-gradient-to-br from-green-500/20 to-green-600/5",
    hoverColor: "hover:from-green-500/30 hover:to-green-600/20",
    iconBg: "bg-green-500/20",
  },
];

// Transformation Showcase Data
export interface Transformation {
  id: number;
  name: string;
  age: number;
  duration: string;
  beforeImage: string;
  afterImage: string;
  weightLoss: string;
  muscleGain: string;
  story: string;
}

export const transformations: Transformation[] = [
  {
    id: 1,
    name: "Alex Morgan",
    age: 29,
    duration: "4 months",
    beforeImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    weightLoss: "-26 lbs",
    muscleGain: "+8% muscle",
    story:
      "I used to struggle with energy levels and confidence. The personalized workout plans completely transformed my lifestyle.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    age: 34,
    duration: "6 months",
    beforeImage:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    weightLoss: "-18 lbs",
    muscleGain: "+12% muscle",
    story:
      "After my second child, I struggled to get back in shape. This program made it manageable and the results speak for themselves.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    age: 41,
    duration: "9 months",
    beforeImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    weightLoss: "-32 lbs",
    muscleGain: "+15% muscle",
    story:
      "At 40, I thought my best days were behind me. The AI coach adapted to my needs, and I'm now in the best shape of my life!",
  },
];

// Testimonials Data
export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  stars: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Emma Thompson",
    role: "Marathon Runner",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
    content:
      "FitMotion transformed my training. The AI coach adapted my plan when I was recovering from an injury, and I still managed to beat my personal best in the Chicago Marathon!",
    stars: 5,
  },
  {
    name: "Marcus Chen",
    role: "Fitness Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    content:
      "The food tracking with photo recognition is a game-changer. I've tried many apps, but this is the only one that makes nutrition tracking something I actually stick with.",
    stars: 5,
  },
  {
    name: "Sophia Rodriguez",
    role: "CrossFit Athlete",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
    content:
      "As a CrossFit competitor, I need detailed tracking of my workouts. This app gives me insights I never had before, showing me patterns in my performance I couldn't see on my own.",
    stars: 4,
  },
  {
    name: "David Parker",
    role: "Weight Loss Journey",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80",
    content:
      "I've lost 50 pounds in 8 months using FitMotion. The progress tracking keeps me motivated, and the AI adjusts my nutrition and workout plans as my body changes.",
    stars: 5,
  },
  {
    name: "Aisha Johnson",
    role: "Yoga Instructor",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80",
    content:
      "Even as a fitness professional, I find tremendous value in the analytics. It helps me balance my own practice while designing better programs for my clients.",
    stars: 5,
  },
];

// FAQ Data
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "How does the AI fitness coach work?",
    answer:
      "Our AI coach analyzes your goals, preferences, and available equipment to create personalized training plans.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Absolutely! We offer a 14-day free trial with full access to all premium features. No credit card required to start your trial - we want you to experience the full benefits before making a decision.",
  },
  {
    question: "How accurate is the nutrition tracking feature?",
    answer:
      "Our food recognition technology can identify thousands of foods with over 95% accuracy. For packaged foods, you can simply scan the barcode. You can also manually adjust entries if needed, and the system learns from your corrections to become even more accurate over time.",
  },
  {
    question: "Can I use the app if I'm a beginner?",
    answer:
      "Definitely! FitMotion is designed for all fitness levels from complete beginners to elite athletes. The AI coach will create appropriate plans based on your experience level and gradually progress you at the right pace for your individual needs.",
  },
];

// Footer Data
export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

export const footerLinks: FooterLinkSection[] = [
  {
    title: "PRODUCT",
    links: [
      { label: "Reviews", href: "#reviews" },
      { label: "Features", href: "#features" },
      { label: "Methodology", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Press", href: "/press" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Fitness library", href: "/library" },
      { label: "Help Center", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "Community", href: "/community" },
    ],
  },
];
