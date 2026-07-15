export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  description: string;
}

export const events: Event[] = [
  {
    title: "Next.js Conf 2026",
    image: "/images/nextjs_conf.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA & Online",
    date: "October 22, 2026",
    time: "09:00 AM PST",
    description: "Join the Next.js community to learn about the latest features, network with other developers, and hear from the Next.js team."
  },
  {
    title: "React Summit 2026",
    image: "/images/react_summit.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands & Online",
    date: "June 19, 2026",
    time: "10:00 AM CET",
    description: "The largest conference on React, gathering frontend and fullstack engineers from all over the world."
  },
  {
    title: "JS Nation 2026",
    image: "/images/js_nation.png",
    slug: "js-nation-2026",
    location: "Amsterdam, Netherlands & Online",
    date: "June 15, 2026",
    time: "09:30 AM CET",
    description: "A two-day conference focusing exclusively on JavaScript development, its ecosystem, and future trends."
  }
];
