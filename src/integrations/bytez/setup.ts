/**
 * Bytez.js SDK - Production Ready Setup
 * Complete example with error handling, environment variables, and TypeScript support
 */

// @ts-expect-error - bytez.js types not available
import Bytez from "bytez.js";

/**
 * Initialize Bytez SDK with proper error handling
 */
export async function initializeBytezSDK() {
  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_BYTEZ_API_KEY environment variable is not set. " +
      "Please add it to your .env file: VITE_BYTEZ_API_KEY=your_api_key"
    );
  }

  try {
    const sdk = new Bytez(apiKey);
    return sdk;
  } catch (error) {
    throw new Error(`Failed to initialize Bytez SDK: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Example 1: Basic Hello World with Error Handling
 */
export async function exampleHelloWorld() {
  try {
    const sdk = await initializeBytezSDK();
    const model = sdk.model("google/gemini-3-pro-preview");

    const { error, output } = await model.run([
      {
        role: "user",
        content: "Hello",
      },
    ]);

    if (error) {
      console.error("API Error:", error);
      return null;
    }

    console.log("Response:", output);
    return output;
  } catch (error) {
    console.error("Failed to execute hello world:", error);
    return null;
  }
}

/**
 * Example 2: Send Complex Messages with Conversation History
 */
export async function exampleConversation() {
  try {
    const sdk = await initializeBytezSDK();
    const model = sdk.model("google/gemini-3-pro-preview");

    // Multi-turn conversation
    const messages = [
      {
        role: "user",
        content: "What is photosynthesis?",
      },
      {
        role: "assistant",
        content:
          "Photosynthesis is the process by which plants convert light energy into chemical energy...",
      },
      {
        role: "user",
        content: "Can you explain the light-dependent reactions?",
      },
    ];

    const { error, output } = await model.run(messages);

    if (error) {
      console.error("API Error:", error);
      return null;
    }

    return output;
  } catch (error) {
    console.error("Conversation failed:", error);
    return null;
  }
}

/**
 * Example 3: Using Different Models
 */
export async function exampleDifferentModels() {
  try {
    const sdk = await initializeBytezSDK();

    // Models available through Bytez
    const models = [
      "google/gemini-3-pro-preview",
      "openai/gpt-4.1-mini",
      // Add other available models
    ];

    const results: { [key: string]: string | null } = {};

    for (const modelName of models) {
      const model = sdk.model(modelName);

      const { error, output } = await model.run([
        {
          role: "user",
          content: "What is the weather?",
        },
      ]);

      results[modelName] = error ? null : output || null;
    }

    return results;
  } catch (error) {
    console.error("Model comparison failed:", error);
    return null;
  }
}

/**
 * Example 4: Type-Safe Wrapper with Proper Response Handling
 */
interface MessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

interface APIResponse {
  error?: string;
  output?: string;
}

interface APIResult {
  success: boolean;
  data?: string;
  error?: string;
}

export async function safeAPICall(
  modelName: string,
  messages: MessageInput[]
): Promise<APIResult> {
  try {
    // Validate inputs
    if (!modelName || !messages || messages.length === 0) {
      return {
        success: false,
        error: "Invalid input: modelName and messages are required",
      };
    }

    // Initialize SDK
    const sdk = await initializeBytezSDK();
    const model = sdk.model(modelName);

    // Make API call
    const response: APIResponse = await model.run(messages);

    // Handle API error
    if (response.error) {
      return {
        success: false,
        error: response.error,
      };
    }

    // Validate output
    if (!response.output) {
      return {
        success: false,
        error: "No output received from API",
      };
    }

    return {
      success: true,
      data: response.output,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      error: `API call failed: ${errorMessage}`,
    };
  }
}

/**
 * Example 5: Using Bytez for Educational Content Generation
 */
export async function generateEducationalContent(
  topic: string,
  contentType: "notes" | "quiz" | "summary"
): Promise<APIResult> {
  const prompts: { [key: string]: string } = {
    notes: `Create comprehensive study notes for the topic: "${topic}". 
            Include key concepts, definitions, and important points. 
            Format for easy understanding and PDF conversion.`,
    quiz: `Generate 5 multiple-choice quiz questions about: "${topic}". 
           Include options and correct answers with explanations.`,
    summary: `Write a concise summary (200 words) about: "${topic}". 
              Make it student-friendly and focus on key points.`,
  };

  const prompt = prompts[contentType] || prompts.notes;

  return safeAPICall("google/gemini-3-pro-preview", [
    {
      role: "user",
      content: prompt,
    },
  ]);
}

/**
 * Example 6: Batch Processing with Error Recovery
 */
export async function batchProcessQueries(
  queries: Array<{ model: string; content: string }>
): Promise<APIResult[]> {
  const results: APIResult[] = [];

  for (const query of queries) {
    const result = await safeAPICall(query.model, [
      {
        role: "user",
        content: query.content,
      },
    ]);

    results.push(result);

    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Example 7: Environment Setup Validation
 */
export function validateEnvironment(): { valid: boolean; message: string } {
  const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;

  if (!apiKey) {
    return {
      valid: false,
      message:
        "Error: VITE_BYTEZ_API_KEY not found. Add to .env file:\nVITE_BYTEZ_API_KEY=your_api_key",
    };
  }

  if (apiKey.length < 10) {
    return {
      valid: false,
      message: "Error: VITE_BYTEZ_API_KEY appears invalid (too short)",
    };
  }

  return {
    valid: true,
    message: "Environment variables configured correctly",
  };
}

/**
 * Main execution example - Run this to test the integration
 */
export async function main() {
  console.log("🚀 Bytez.js Integration Examples\n");

  // Check environment
  const envCheck = validateEnvironment();
  console.log(envCheck.message);

  if (!envCheck.valid) {
    return;
  }

  // Example 1: Hello World
  console.log("\n📝 Example 1: Hello World");
  const helloResult = await exampleHelloWorld();
  if (helloResult) {
    console.log("✓ Hello World successful:", helloResult.substring(0, 100) + "...");
  }

  // Example 2: Generate Notes
  console.log("\n📚 Example 2: Generate Study Notes");
  const notesResult = await generateEducationalContent("Photosynthesis", "notes");
  if (notesResult.success) {
    console.log("✓ Notes generated:", notesResult.data?.substring(0, 100) + "...");
  } else {
    console.error("✗ Error:", notesResult.error);
  }

  // Example 3: Generate Quiz
  console.log("\n❓ Example 3: Generate Quiz");
  const quizResult = await generateEducationalContent("Photosynthesis", "quiz");
  if (quizResult.success) {
    console.log("✓ Quiz generated:", quizResult.data?.substring(0, 100) + "...");
  } else {
    console.error("✗ Error:", quizResult.error);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${(globalThis as any).process?.argv[1] || ''}`) {
  main().catch(console.error);
}
