export const profile = {
  name: "Deepak Madhu Kumar N",
  firstName: "Deepak",
  role: "Software Developer",
  tagline:
    "A Software Developer turning ideas into elegant code and seamless user experiences.",
  bio: "Hey there! I'm Deepak Madhu Kumar N, a Computer Science undergrad at K Ramakrishnan College of Technology and a tech-savvy enthusiast with a caffeine-fueled passion for building impactful digital solutions. I speak fluent Java, and JavaScript, and I vibe well with tools like Next.js, Django, and Selenium. When I'm not coding, you'll find me brainstorming ideas or hyping up fellow devs in our campus tech community.",
  email: "deepak.madhukumar@intechive.com",
  location: "India", // TODO: confirm city
  resumeUrl:
    "https://drive.google.com/file/d/1XF0Pks5iQ6FRtBfRGSymQxO7C7ASlXRd/view?usp=drive_link",
  socials: {
    github: "https://github.com/dazzy11",
    linkedin: "https://linkedin.com/in/deepak-madhu-kumar",
  },
  quickFacts: [
    { label: "Based in", value: "India" },
    { label: "Focus", value: "Full-stack web" },
    { label: "Currently", value: "Building at Intechive" }, // TODO: confirm
    { label: "Coffee status", value: "Always caffeinated" },
  ],
} as const

export type Profile = typeof profile
