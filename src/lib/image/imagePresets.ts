export interface CanvasPreset {
  id: string;
  name: string;
  category: "Social Media" | "Professional" | "Video & Presentation" | "Custom";
  width: number;
  height: number;
  description: string;
  aspectRatio: string;
}

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: "ig-post",
    name: "Instagram Post (Square)",
    category: "Social Media",
    width: 1080,
    height: 1080,
    description: "Standard 1:1 feed square image",
    aspectRatio: "1:1",
  },
  {
    id: "ig-portrait",
    name: "Instagram Portrait",
    category: "Social Media",
    width: 1080,
    height: 1350,
    description: "4:5 vertical feed engagement optimal",
    aspectRatio: "4:5",
  },
  {
    id: "ig-story",
    name: "Instagram Story & Reel",
    category: "Social Media",
    width: 1080,
    height: 1920,
    description: "Full-screen 9:16 mobile story & TikTok/Reels cover",
    aspectRatio: "9:16",
  },
  {
    id: "yt-thumb",
    name: "YouTube Thumbnail",
    category: "Video & Presentation",
    width: 1280,
    height: 720,
    description: "Standard 16:9 high-CTR video thumbnail",
    aspectRatio: "16:9",
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post Graphic",
    category: "Professional",
    width: 1200,
    height: 627,
    description: "Optimal banner size for feed posts & link cards",
    aspectRatio: "1.91:1",
  },
  {
    id: "resume-photo",
    name: "Resume & Avatar Profile",
    category: "Professional",
    width: 400,
    height: 400,
    description: "Square headshot optimal for CVs and profile badges",
    aspectRatio: "1:1",
  },
  {
    id: "presentation",
    name: "Presentation Slide (Full HD)",
    category: "Video & Presentation",
    width: 1920,
    height: 1080,
    description: "16:9 widescreen presentation graphic",
    aspectRatio: "16:9",
  },
];
