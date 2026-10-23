/**
 * DocuMorphix AI — Multi-Channel Syndication & Outreach Engine
 * Generates tracked URLs, ready-to-post copy, and direct submission targets.
 */

const BASE_URL = "https://studypilot-app-seven.vercel.app";

const campaigns = [
  {
    target: "Students & Competitive Exam Aspirants (UPSC, GATE, JEE, College)",
    url: `${BASE_URL}/exam-prep-ai?utm_source=telegram&utm_medium=student_group&utm_campaign=exam_prep`,
    channels: [
      "Telegram: UPSC / SSC / GATE Study Groups",
      "Reddit: r/GetStudying, r/Indian_Academia, r/JEENEETards",
      "WhatsApp: University & Engineering Branch Groups"
    ],
    pitch: `📚 Transform textbook chapters and PDF notes into instant 10-Question MCQ practice quizzes with explanations. 100% free with zero watermarks on DocuMorphix AI.`
  },
  {
    target: "Job Seekers, Freelancers & Professionals",
    url: `${BASE_URL}/resume-pdf-editor?utm_source=reddit&utm_medium=freelance&utm_campaign=cv_editor`,
    channels: [
      "Reddit: r/jobs, r/freelance, r/SideProject",
      "LinkedIn: Remote Work & Hiring Feeds",
      "Quora: 'How to edit PDF without watermark free'"
    ],
    pitch: `💼 Update your Resume/CV layout, edit contact details, and digitally sign offer letters/NDAs without paying Adobe $15/mo or getting watermarks.`
  },
  {
    target: "Content Creators, YouTubers & Graphic Designers",
    url: `${BASE_URL}/youtube-thumbnail-editor?utm_source=twitter&utm_medium=creators&utm_campaign=thumbnail_maker`,
    channels: [
      "Discord: Creator & Editor Servers",
      "Twitter / X: #YouTuber #ContentCreator #ThumbnailDesign",
      "Facebook: YouTube Thumbnail Creators Group"
    ],
    pitch: `🎨 Unlimited Free HD Background Remover + 1280x720 YouTube Thumbnail Studio. Zero 0.25MP limits, no watermark.`
  },
  {
    target: "Educators, Tutors & Coaching Institutes",
    url: `${BASE_URL}/test-paper-generator?utm_source=whatsapp&utm_medium=teachers&utm_campaign=test_maker`,
    channels: [
      "Telegram: Teachers & Educators Resource Hub",
      "WhatsApp: Tuition & Coaching Teacher Networks",
      "Facebook: School Teachers Forum"
    ],
    pitch: `👨‍🏫 Generate practice test papers, question sheets, and complete answer keys with explanations from textbook chapters in seconds.`
  }
];

console.log("=================================================");
console.log("🚀 DOCUMORPHIX AI — MULTI-TARGET OUTREACH CAMPAIGNS");
console.log("=================================================\n");

campaigns.forEach((c, idx) => {
  console.log(`[Target ${idx + 1}] ${c.target}`);
  console.log(`🔗 Campaign URL: ${c.url}`);
  console.log(`📢 Recommended Channels:`);
  c.channels.forEach(ch => console.log(`   • ${ch}`));
  console.log(`📝 High-Converting Pitch:\n   "${c.pitch}"\n`);
  console.log("-------------------------------------------------");
});
