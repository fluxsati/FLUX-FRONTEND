/* ===================== IMAGE IMPORTS ===================== */

// Technovision 2025
import tv25_1 from '../assets/events/technovision-2025/1.jpg';
import tv25_2 from '../assets/events/technovision-2025/2.jpg';
import tv25_3 from '../assets/events/technovision-2025/15.jpg';
import tv25_4 from '../assets/events/technovision-2025/16.jpg';
import tv25_5 from '../assets/events/technovision-2025/7.jpg';
import tv25_6 from '../assets/events/technovision-2025/5.jpg';
import tv25_7 from '../assets/events/technovision-2025/4.jpg';

// FluxWave
import fw1 from '../assets/events/FluxWave/12.jpg';
import fw2 from '../assets/events/FluxWave/10.jpg';
import fw3 from '../assets/events/FluxWave/11.jpg';
import fw4 from '../assets/events/FluxWave/6.jpg';
import fw5 from '../assets/events/FluxWave/3.jpg';
import fw6 from '../assets/events/FluxWave/1.jpg';

// Web Dev Workshop
import ww1 from '../assets/events/Web-Workshop/8.jpg';
import ww2 from '../assets/events/Web-Workshop/4.jpg';
import ww3 from '../assets/events/Web-Workshop/6.jpg';
import ww11 from '../assets/events/Web-Workshop/11.jpg';
import ww14 from '../assets/events/Web-Workshop/14.jpg';
import ww12 from '../assets/events/Web-Workshop/12.jpg';

// Event Posters
import rocket_poster from '../assets/events/Events-Posters/rocketcrash.jpeg';
import color_smash_poster from '../assets/events/Events-Posters/colorsmash.jpeg';

/* ===================== REPORT (PDF) IMPORTS ===================== */
import report_tv25 from '../assets/reports/Technovision_25.pdf';
import report_fw25 from '../assets/reports/fluxwave_25.pdf';
import report_ww from '../assets/reports/web_workshop.pdf';
import report_intra_club from '../assets/reports/intra_club_activity_reports25-26.pdf';

/* ===================== DATA STRUCTURE ===================== */

export const ARCHIVE_DATA = {

  "2026": [
    {
      title: "FLUX HARD-WIRED 1.0",
      tag: "Hardware Ideathon",
      detailsUrl: "/flux-hard-wired",
      images: ["https://instagram.frpr5-1.fna.fbcdn.net/v/t51.82787-15/624993271_18088736957037698_2187754767994071112_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzgyMDg0NDEzODQwMTU5MzI5Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=7W0bF4IoosUQ7kNvwG_4R5h&_nc_oc=Adm1nBlX-RZulTuGES5CnmSguHAmgNsocaC4N6SR6uQeDahJKw22nuX6NzeY7Mn3LW3hkAQFvBePt6jk2jBf8k4b&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.frpr5-1.fna&_nc_gid=ExuBuRpurAJxZ6T3_seJpQ&oh=00_AfsbXWRMK7F-q4bDGiYxuIBjR3UP1N5L7EaWQFP5g5JLMg&oe=69831C32"],
      terminal: "> mode: Online\n> deadline: 05_Feb_2026\n> team_size: 2-3_Members\n> focus: Hardware_Innovation",
      summary: "FLUX Hard-Wired 1.0 is a competitive hardware-focused innovation challenge designed to evaluate participants on their ability to convert ideas into logically sound, well-structured, and defensible solutions."
    },
    {
      title: "INTRA-CLUB SATURDAYS",
      tag: "Club Activity",
      reportUrl: report_intra_club,
      images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c"],
      terminal: "> session: Weekly_Sprint\n> status: Active\n> timeline: Dec 2025 - Jan 2026",
      summary: "Ongoing weekly internal meetups featuring high-energy activities like KBC Flux, Technical Debates, and Flux Auction to sharpen club members' competitive skills."
    },
    
  ],
  "2025": [
     {
      title: "ROCKET CRASH",
      tag: "Diwali Edition",
      reportUrl: null, // To be added later
      images: [rocket_poster],
      terminal: "> project: Diwali_Special\n> engine: Python\n> month: October_2025\n> status: Deployed",
      summary: "The official 2025 Diwali game. A creative physics-based challenge developed for the festival of lights, focusing on projectile logic and festive digital lighting simulations."
    },
    {
      title: "WEB DEV WORKSHOP",
      tag: "Training",
      reportUrl: report_ww,
      images: [ww1, ww2, ww3, ww11, ww12, ww14],
      terminal: "> venue: Embedded_Lab\n> date: 13/09/2025\n> participants: 37_Students\n> focus: Modern_Tools_&_Advanced_Libraries",
      summary: "A specialized workshop transitioning from basics to advanced development. Explored modern industry tools, MERN stack libraries, and a career roadmap for freelancing and global internships."
    },
     {
      title: "FLUXWAVE HACKATHON",
      tag: "Online Hackathon",
      reportUrl: report_fw25,
      images: [fw1, fw2, fw3, fw4, fw5, fw6],
      terminal: "> registered: 51_Teams\n> shortlisted: 13_Teams\n> timeline: June - August 2025\n> winner: Med_Squad",
      summary: "A high-stakes 3-round thriller. From 51 teams down to 13 finalists presenting offline at the Embedded Lab. Focused on technical innovation, business viability, and UI/UX design."
    },
    {
      title: "COLOR SMASH",
      tag: "Holi Special",
      reportUrl: null, // To be added later
      images: [color_smash_poster],
      terminal: "> engine: PyGame\n> month: March_2025\n> release: v1.0.4\n> concept: Digital_Festivities",
      summary: "The official 2025 Holi game. A festive simulation developed in Python to celebrate Holi safely. Combines game physics with cultural elements to promote a chemical-free digital celebration."
    },
    {
      title: "TECHNOVISION '25",
      tag: "Robotics",
      reportUrl: report_tv25,
      images: [tv25_1, tv25_2, tv25_3, tv25_4, tv25_5, tv25_6, tv25_7],
      terminal: "> arena: IT_Garden\n> date: 20-21_Feb_2025\n> events: Robo_Sumo & Robo_Rumble\n> focus: Mechatronics & Strategic_Battle",
      summary: "A two-day robotic warfare event. Robo Sumo featured autonomous/manual ring battles, while Robo Rumble tested bots against complex obstacle courses and navigation tasks."
    },    
   
  ],
  
};