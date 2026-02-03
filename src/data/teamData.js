/**
 * PURE JAVASCRIPT DATA OBJECT
 * No JSX allowed here to prevent SyntaxErrors.
 */

// Import Convenor Images
import dhananjayImg from "../assets/convenors/dhananjay.png";
import shrutiImg from "../assets/convenors/shruti.jpg";
import snehaImg from "../assets/convenors/sneha.jpg";
import yashwantImg from "../assets/convenors/yashwant.jpg";

// Import Co-Convenor Images
import ashishImg from "../assets/co-convenors/ashish.png";
import nitilImg from "../assets/co-convenors/nitil.jpeg";
import ritikaImg from "../assets/co-convenors/ritika.jpg";
import shreyaImg from "../assets/co-convenors/shreya.jpg";

export const TEAM_DATA = {
  convenors: [
    { 
      name: "Dhananjay Dubey", 
      role: "Convenor", 
      branch: "Information Technology",
      year: "Final Year",
      img: dhananjayImg, 
      link: "https://www.linkedin.com/in/dhananjaydubey20/", 
      bio: "The steady pulse of the system. A firm believer that true building happens when logic meets empathy, steering the team through high-pressure sprints with a focus on collective growth and architectural harmony." 
    },
    { 
      name: "Yashwant Singh Gour", 
      role: "Convenor", 
      branch: "IOT",
      year: "Final Year",
      img: yashwantImg, 
      link: "https://www.linkedin.com/in/yashwant-singh-gour/", 
      bio: "The guardian of the Flux spirit. Focusing on the long-term journey and mentoring the next generation of units to value the process of building as much as the final product." 
    },
    { 
      name: "Shruti Zunjarke", 
      role: "Convenor", 
      branch: "Computer Science and Engineering",
      year: "Final Year",
      img: shrutiImg, 
      link: "https://www.linkedin.com/in/shruti-zunjarke-7278bb269/", 
      bio: "The voice of the community. Crafting the Flux narrative to ensure that behind every line of code, there is a human story. Building environments where every member feels seen and inspired to create." 
    },
    { 
      name: "Sneha Gawande", 
      role: "Convenor", 
      branch: "Computer Science and Engineering",
      year: "Final Year",
      img: snehaImg, 
      link: "#", 
      bio: "The bridge between abstract ideas and reality. Nurturing the Flux ecosystem by turning individual curiosity into shared technical breakthroughs, proving that we build better when we build together." 
    },
  ],
  coConvenors: [
    { 
      name: "Ashish Suryavanshi", 
      role: "Co-Convenor", 
      branch: "CSE(Blockchain)", 
      year: "Pre-final Year",
      img: ashishImg,
      link: "https://www.linkedin.com/in/ashish-suryavanshi/",
      bio: "A believer in decentralized trust. Bringing an energy of transparency to Flux and encouraging a workspace where knowledge is shared freely as a building block for the future."
    },
    { 
      name: "Nitil Singh", 
      role: "Co-Convenor", 
      branch: "IOT", 
      year: "Pre-final Year",
      img: nitilImg,
      link: "https://www.linkedin.com/in/nitil-singh-400383326/",
      bio: "The connector. Thriving on the 'inter-connectedness' of the team, constantly finding new ways to sync different departments and keep the Flux environment moving in one fluid motion."
    },
    { 
      name: "Ritika Jain", 
      role: "Co-Convenor", 
      branch: "CSE(Blockchain)", 
      year: "Pre-final Year",
      img: ritikaImg,
      link: "https://www.linkedin.com/in/ritika-jain17/",
      bio: "The strategist of calm. Bringing balance to the intense building phases of Flux, ensuring that technical rigor never comes at the cost of the team's shared emotional well-being."
    },
    { 
      name: "Shreya Chahar", 
      role: "Co-Convenor", 
      branch: "CSE(Blockchain)", 
      year: "Pre-final Year",
      img: shreyaImg,
      link: "https://www.linkedin.com/in/shreya-chahar-07153929b/",
      bio: "The spark of innovation. Pushing the boundaries of what the team thinks is possible, turning 'what if' into 'what is' through relentless experimentation and a fearless building style."
    },
  ],
  thirdYear: [
    { name: "Aakansh", branch: "CSE(Blockchain)", link: "#" },
    { name: "Akash", branch: "CSE(Blockchain)", link: "#" },
    { name: "Anshika Gupta", branch: "Computer Science and Engineering", link: "#" },
    { name: "Anshika Jain", branch: "AIADS", link: "#" },
    { name: "Anvesha Jain", branch: "AIADS", link: "#" },
    { name: "Bhoomi", branch: "Information Technology", link: "#" },
    { name: "Harishchandra", branch: "Information Technology", link: "#" },
    { name: "Himanshu", branch: "Electronics & Communication Engineering", link: "#" },
    { name: "Mahesh", branch: "Electronics & Communication Engineering", link: "#" },
    { name: "Mahima", branch: "CSE(Blockchain)", link: "#" },
    { name: "Mohit", branch: "Information Technology", link: "#" },
    { name: "Praveen", branch: "CSE(Blockchain)", link: "#" },
    { name: "Rajshree", branch: "AIADS", link: "#" },
    { name: "Saloni", branch: "Computer Science and Engineering", link: "#" },
    { name: "Shivani", branch: "Computer Science and Engineering", link: "#" },
    { name: "Srijan", branch: "Computer Science and Engineering", link: "#" },
    { name: "Swati", branch: "Computer Science and Engineering", link: "#" },
    { name: "Vedansh", branch: "AIADS", link: "#" },
    { name: "Veer", branch: "CSE(Blockchain)", link: "#" }
  ],

  /* ===================== WORK ENVIRONMENT DESCRIPTION ===================== */
  environment: {
    culture: "Emotional Intelligence & Technical Flux",
    philosophy: "Building in the Flow",
    description: "In Flux, building isn't just about code; it's about the energy between people. Our environment is a living, breathing system where high-octane technical sprints coexist with deep mentorship and emotional support. We don't just build projects; we build ourselves, ensuring that as the technology evolves, the people behind it grow even faster."
  },

  galleryImages: Array.from({ length: 12 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/flux_${i}/800/800`, 
    caption: `Flux Event #${i + 1}`
  }))
};
