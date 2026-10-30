import { ragPipeline } from "../src/lib/ai/rag";
import { getAIProvider } from "../src/lib/ai/provider";

async function runTests() {
  const provider = getAIProvider();

  const testCases = [
    {
      question: "How do I reset my password?",
      expectedKeyword: "password",
      expectedSource: "FAQ: Account",
      mustNotContain: "Track Order",
    },
    {
      question: "What is your return policy and how do refunds work?",
      expectedKeyword: "return",
      expectedSource: "FAQ: Returns",
      mustNotContain: "Track Order",
    },
    {
      question: "How can I track my order?",
      expectedKeyword: "track",
      expectedSource: "FAQ: Orders",
      mustNotContain: "return policy",
    },
    {
      question: "What payment methods do you accept?",
      expectedKeyword: "Visa",
      expectedSource: "FAQ: Billing",
      mustNotContain: "Track Order",
    },
    {
      question: "What is the capital of Mars?",
      expectedKeyword: "couldn't find",
      expectedSource: null,
      mustNotContain: "Track Order",
    },
  ];

  console.log("=== RUNNING RAG & QA RETRIEVAL TESTS ===\n");
  let passed = 0;

  for (const tc of testCases) {
    console.log(`\n--------------------------------------------`);
    console.log(`Testing Query: "${tc.question}"`);

    const { augmentedPrompt, sources } = await ragPipeline(tc.question);
    const sourceTitles = sources.map((s) => s.documentTitle);
    console.log(`Retrieved Sources (${sources.length}):`, sourceTitles);

    const response = await provider.chat([{ role: "user", content: augmentedPrompt }]);
    console.log(`AI Response: \n${response.slice(0, 180)}...`);

    let ok = true;

    if (tc.expectedSource) {
      if (!sourceTitles.includes(tc.expectedSource)) {
        console.error(`❌ FAIL: Expected source "${tc.expectedSource}" not found in [${sourceTitles.join(", ")}]`);
        ok = false;
      }
    } else {
      if (sources.length > 0) {
        console.error(`❌ FAIL: Expected 0 sources for ungrounded question, got ${sources.length}`);
        ok = false;
      }
    }

    if (!response.toLowerCase().includes(tc.expectedKeyword.toLowerCase())) {
      console.error(`❌ FAIL: Response did not include expected keyword "${tc.expectedKeyword}"`);
      ok = false;
    }

    if (response.includes(tc.mustNotContain)) {
      console.error(`❌ FAIL: Response incorrectly contained forbidden text "${tc.mustNotContain}"`);
      ok = false;
    }

    if (ok) {
      console.log(`✅ PASS: Correctly answered and grounded!`);
      passed++;
    }
  }

  console.log(`\n============================================`);
  console.log(`RESULTS: ${passed}/${testCases.length} tests passed.`);
  if (passed === testCases.length) {
    console.log("🎉 ALL QA TESTS PASSED SUCCESSFULLY!");
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
