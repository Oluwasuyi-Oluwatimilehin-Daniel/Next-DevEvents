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
  },
  {
    title: "GitHub Universe 2026",
    image: "/images/github_universe.png",
    slug: "github-universe-2026",
    location: "San Francisco, CA & Online",
    date: "November 10, 2026",
    time: "09:00 AM PST",
    description: "The global developer event of the year. Join us for keynote announcements, hands-on workshops, and community networking."
  },
  {
    title: "KubeCon 2026",
    image: "/images/kubecon.png",
    slug: "kubecon-2026",
    location: "Chicago, IL",
    date: "November 17, 2026",
    time: "08:30 AM CST",
    description: "The Cloud Native Computing Foundation's flagship conference gathering adopters and technologists from leading open source communities."
  },
  {
    title: "Google I/O 2026",
    image: "/images/google_io.png",
    slug: "google-io-2026",
    location: "Mountain View, CA & Online",
    date: "May 12, 2026",
    time: "10:00 AM PST",
    description: "Join us for Google's annual developer festival to learn about the latest product updates, developer tools, and technology platforms."
  },
  {
    title: "Svelte Summit 2026",
    image: "/images/svelte_summit.png",
    slug: "svelte-summit-2026",
    location: "Stockholm, Sweden & Online",
    date: "September 5, 2026",
    time: "09:00 AM CET",
    description: "A dedicated conference featuring the creators and community leaders of Svelte, showing off the future of compiler-driven frontend web applications."
  }
];
