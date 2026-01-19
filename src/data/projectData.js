import { 
  Shield, Cpu, Brain, Wind, Radio, Microscope, 
  HelpCircle, Gavel 
} from 'lucide-react';

export const PROJECTS_DATA = [
  {
    id: 1,
    title: "Capture_The_Flag",
    desc: "Cybersecurity platform for pen-testing challenges.",
    summary: "A robust training environment with containerized challenges and real-time scoreboards.",
    tech: ["Next.js", "Docker"],
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    git: "#",
    live: "#",
    reportFile: "ctf-report.pdf",
    category: "security",
    iconName: "shield",
    team: ["Mahesh K.", "Rahul S."]
  },
  {
    id: 2,
    title: "Obstacle_Bot",
    desc: "Autonomous rover utilizing LiDAR mapping.",
    summary: "Implements SLAM algorithms to navigate complex terrain with remote telemetry.",
    tech: ["Arduino", "ROS"],
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    git: "#",
    live: "#",
    reportFile: "obstacle-bot-report.pdf",
    category: "robotics",
    iconName: "cpu",
    team: ["Priya S.", "Sumit V."]
  },
  {
    id: 3,
    title: "Neural_Nexus",
    desc: "Decentralized LLM training node network.",
    summary: "Leverages idle GPU power across networks to distribute heavy ML workloads.",
    tech: ["Python", "PyTorch"],
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    git: "#",
    live: "#",
    reportFile: "neural-nexus-report.pdf",
    category: "ai",
    iconName: "brain",
    team: ["Vikram A.", "Sneha K."]
  },
  {
    id: 4,
    title: "Flux_Drone",
    desc: "Stabilized FPV drone with gesture controls.",
    summary: "AI-powered camera recognizes hand gestures to execute flight maneuvers.",
    tech: ["OpenCV", "Raspberry Pi"],
    img: "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
    git: "#",
    live: "#",
    reportFile: "flux-drone-report.pdf",
    category: "hardware",
    iconName: "wind",
    team: ["Aryan R.", "Divya M."]
  },
  {
    id: 5,
    title: "Sat_Link",
    desc: "Satellite signal interceptor for weather data.",
    summary: "Decodes NOAA satellite feeds to render high-res thermal weather maps.",
    tech: ["Rust", "SDR"],
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
    git: "#",
    live: "#",
    reportFile: "sat-link-report.pdf",
    category: "aerospace",
    iconName: "radio",
    team: ["Karan J."]
  },
  {
    id: 6,
    title: "Bio_Sync",
    desc: "Wearable tech for muscle-to-MIDI control.",
    summary: "Translates EMG sensor micro-movements into digital music commands.",
    tech: ["C++", "Sensors"],
    img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8",
    git: "#",
    live: "#",
    reportFile: "bio-sync-report.pdf",
    category: "biotech",
    iconName: "microscope",
    team: ["Riya B."]
  },
  {
    id: 7,
    title: "Flux_KBC_Quiz",
    desc: "Interactive technical quiz with lifelines.",
    summary: "A high-pressure competitive quiz platform featuring 'Double Dip' and 'Flip the Question' mechanics for tech enthusiasts.",
    tech: ["React", "Firebase"],
    img: "https://images.unsplash.com/photo-1606326666490-45757474e788",
    git: "#",
    live: "#",
    reportFile: "kbc-report.pdf",
    category: "software",
    iconName: "help-circle",
    team: ["Flux Core"]
  },
  {
    id: 8,
    title: "Tech_Stack_Auction",
    desc: "IPL-style bidding for developer tools.",
    summary: "A unique bidding event where teams compete to purchase limited tech stacks (Languages, Frameworks, DBs) to build their projects.",
    tech: ["Socket.io", "Node.js"],
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    git: "#",
    live: "#",
    reportFile: "auction-report.pdf",
    category: "event",
    iconName: "gavel",
    team: ["Flux Management"]
  }
];