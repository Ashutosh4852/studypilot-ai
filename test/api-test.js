/**
 * Live End-to-End API Integration Verification for StudyPilot AI
 * Tests all live endpoints on localhost:3000
 */

const BASE_URL = "http://localhost:3000";

async function runLiveTests() {
  console.log("=================================================");
  console.log("🧪 TESTING LIVE STUDYPILOT AI ENDPOINTS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  async function testApi(name, fn) {
    try {
      process.stdout.write(`• Testing ${name}... `);
      await fn();
      console.log("✅ SUCCESS");
      passed++;
    } catch (err) {
      console.log("❌ FAILED");
      console.error("  Error:", err.message);
      failed++;
    }
  }

  // TEST 1: Main Homepage / Unified Workspace
  await testApi("GET / (Unified Workspace)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes("StudyPilot")) throw new Error("Missing branding in HTML");
  });

  // TEST 2: PDF Studio Route
  await testApi("GET /pdf-studio", async () => {
    const res = await fetch(`${BASE_URL}/pdf-studio`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  });

  // TEST 3: AI Image Studio Route
  await testApi("GET /image-studio", async () => {
    const res = await fetch(`${BASE_URL}/image-studio`);
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  });

  // TEST 4: AI PDF Summary Endpoint
  await testApi("POST /api/ai/pdf-summary (Summarize)", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/pdf-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "summarize",
        text: "Database normalization is the process of structuring a relational database in accordance with normal forms in order to reduce data redundancy and improve data integrity. The primary stages include 1NF, 2NF, 3NF, and BCNF.",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok || !json.data.result) throw new Error("Invalid response format");
    console.log(`\n    -> Provider: ${json.data.provider}`);
    console.log(`    -> Result Preview: ${json.data.result.slice(0, 120)}...`);
  });

  // TEST 5: AI MCQ Generator Endpoint
  await testApi("POST /api/ai/pdf-summary (MCQs)", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/pdf-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "mcqs",
        text: "Binary search runs in logarithmic time O(log n). It requires the target array to be previously sorted.",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok || !json.data.mcqs || json.data.mcqs.length === 0) {
      throw new Error("No MCQs generated");
    }
    console.log(`\n    -> Generated ${json.data.mcqs.length} MCQs.`);
    console.log(`    -> Sample Question: "${json.data.mcqs[0].question}"`);
  });

  // TEST 6: AI Concept Explainer (Feynman Technique)
  await testApi("POST /api/ai/pdf-summary (Explain / ELI5)", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/pdf-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "explain",
        text: "Asymmetric cryptography utilizes public and private key pairs. Data encrypted with the public key can only be decrypted by the corresponding private key.",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok || !json.data.result) throw new Error("Invalid explanation response");
  });

  // TEST 7: AI Image Studio Layout & Strategy Generator
  await testApi("POST /api/ai/image-generate (Layout Suggestion)", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/image-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "suggest-layout",
        prompt: "GATE 2027 CSE Preparation Strategy",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok || !json.data.headline) throw new Error("Invalid layout response");
    console.log(`\n    -> Suggested Headline: "${json.data.headline}"`);
    console.log(`    -> Subtitle: "${json.data.subtitle}"`);
  });

  // TEST 8: AI Image Studio Diffusion Endpoint
  await testApi("POST /api/ai/image-generate (Diffusion Generation)", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/image-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate",
        prompt: "A modern desk with textbooks, digital tablet, glowing lamp, 4k",
        style: "cinematic",
        aspectRatio: "16:9",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok || !json.data.imageUrl) throw new Error("No image URL returned");
    console.log(`\n    -> Generated Image URL: ${json.data.imageUrl.slice(0, 70)}...`);
  });

  console.log("\n=================================================");
  console.log(`🏁 LIVE API TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runLiveTests();
