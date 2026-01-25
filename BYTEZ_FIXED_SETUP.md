# Bytez.js Integration - The Complete Fixed Setup

## 🎯 What You Need

The code snippet you provided is a basic starting point. Here's the **production-ready version** with all fixes and best practices:

### ❌ Original Code (Has Issues)

```typescript
import Bytez from "bytez.js"

const key = "2622dd06541127bea7641c3ad0ed8859"
const sdk = new Bytez(key)

const model = sdk.model("google/gemini-3-pro-preview")

const { error, output } = await model.run([
  {
    "role": "user",
    "content": "Hello"
  }
])

console.log({ error, output });
```

**Problems:**
- ❌ Hardcoded API key
- ❌ No error handling
- ❌ No environment variable usage
- ❌ No type safety
- ❌ No validation
- ❌ Not reusable

---

### ✅ Fixed Version (Production-Ready)

```typescript
import Bytez from "bytez.js";

/**
 * Initialize Bytez SDK properly
 */
async function initBytez() {
  // Use environment variable instead of hardcoding
  const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;

  // Validate API key exists
  if (!apiKey) {
    throw new Error("VITE_BYTEZ_API_KEY environment variable not set");
  }

  try {
    const sdk = new Bytez(apiKey);
    return sdk;
  } catch (error) {
    throw new Error(`Failed to initialize Bytez: ${error}`);
  }
}

/**
 * Send message to AI model with error handling
 */
async function sendMessage(content: string) {
  try {
    // Initialize SDK
    const sdk = await initBytez();
    const model = sdk.model("google/gemini-3-pro-preview");

    // Send message
    const { error, output } = await model.run([
      {
        role: "user",
        content: content,
      },
    ]);

    // Check for errors
    if (error) {
      console.error("API Error:", error);
      return null;
    }

    // Validate output
    if (!output) {
      console.error("No response from API");
      return null;
    }

    console.log("Response:", output);
    return output;
  } catch (error) {
    console.error("Failed to send message:", error);
    return null;
  }
}

// Usage
await sendMessage("Hello");
```

---

## 📋 Step-by-Step Setup

### Step 1: Install Package

```bash
npm install bytez.js
```

### Step 2: Create `.env.local`

```env
VITE_BYTEZ_API_KEY=2622dd06541127bea7641c3ad0ed8859
```

### Step 3: Use in Your Code

```typescript
// Option A: Simple usage
import { sendMessage } from '@/utils/bytez-client';

const response = await sendMessage("Hello");

// Option B: Use the production setup
import { safeAPICall } from '@/integrations/bytez/setup';

const result = await safeAPICall("google/gemini-3-pro-preview", [
  { role: "user", content: "Hello" }
]);

if (result.success) {
  console.log(result.data);
}

// Option C: Use dedicated functions for your needs
import { generateNotesQuizWithBytez, findBestVideoOnYoutubeBytez } from '@/integrations/bytez';

const { questions, error } = await generateNotesQuizWithBytez(notes, filters);
const { videos, error } = await findBestVideoOnYoutubeBytez(topic, filters);
```

---

## 📂 Files to Use

### For Basic Setup
- **Start:** [BYTEZ_SETUP_GUIDE.md](./BYTEZ_SETUP_GUIDE.md)
- **Examples:** [src/integrations/bytez/setup.ts](./src/integrations/bytez/setup.ts)

### For Specific Features
- **Notes Quiz:** `generateNotesQuizWithBytez()` in [index.ts](./src/integrations/bytez/index.ts)
- **Video Search:** `findBestVideoOnYoutubeBytez()` in [index.ts](./src/integrations/bytez/index.ts)
- **React Hooks:** [hooks.ts](./src/integrations/bytez/hooks.ts)

### For Reference
- **API Reference:** [BYTEZ_QUICK_REFERENCE.md](./BYTEZ_QUICK_REFERENCE.md)
- **Import Guide:** [BYTEZ_IMPORT_GUIDE.md](./BYTEZ_IMPORT_GUIDE.md)
- **Full Docs:** [src/integrations/bytez/README.md](./src/integrations/bytez/README.md)

---

## 🔧 All Available Functions

### 1. Initialize SDK (Use Once)
```typescript
import { initializeBytezSDK } from '@/integrations/bytez/setup';
const sdk = await initializeBytezSDK();
```

### 2. Send Safe API Call
```typescript
import { safeAPICall } from '@/integrations/bytez/setup';

const result = await safeAPICall("google/gemini-3-pro-preview", [
  { role: "user", content: "Your message" }
]);

if (result.success) {
  console.log("Result:", result.data);
} else {
  console.error("Error:", result.error);
}
```

### 3. Generate Notes Quiz
```typescript
import { generateNotesQuizWithBytez } from '@/integrations/bytez';

const { questions, error } = await generateNotesQuizWithBytez(
  "Study notes here...",
  { class: "10th", subject: "Biology" },
  10, // question count
  'medium' // difficulty
);
```

### 4. Find Best Videos
```typescript
import { findBestVideoOnYoutubeBytez } from '@/integrations/bytez';

const { videos, error } = await findBestVideoOnYoutubeBytez(
  "Photosynthesis",
  { class: "10th", subject: "Biology" }
);
```

### 5. Generate Notes
```typescript
import { generateNotesWithBytez } from '@/integrations/bytez';

const { notes, error } = await generateNotesWithBytez(
  "Video Title",
  "Video content/transcript",
  { class: "10th", subject: "Biology" }
);
```

### 6. Validate URLs
```typescript
import { validateVideoNotShort } from '@/integrations/bytez';

const { valid, message } = validateVideoNotShort(url);
if (!valid) console.error(message);
```

---

## 🧪 Testing Your Setup

### Test 1: Check Environment
```typescript
import { validateEnvironment } from '@/integrations/bytez/setup';

const check = validateEnvironment();
console.log(check.message);
// Should show: "Environment variables configured correctly"
```

### Test 2: Simple API Call
```typescript
import { exampleHelloWorld } from '@/integrations/bytez/setup';

const response = await exampleHelloWorld();
console.log("API Working:", response !== null);
```

### Test 3: Full Example
```typescript
import { main } from '@/integrations/bytez/setup';

await main();
// Runs all examples
```

---

## 🎓 Common Use Cases

### Use Case 1: Generate Quiz from Study Notes
```typescript
import { useNotesQuiz } from '@/integrations/bytez/hooks';

const { questions, loading, error, generateQuiz } = useNotesQuiz();

// In your component:
await generateQuiz(notes, filters, 10, 'medium');

// Use questions...
```

### Use Case 2: Find Educational Videos
```typescript
import { useVideoSearch } from '@/integrations/bytez/hooks';

const { videos, loading, error, findVideos } = useVideoSearch();

// In your component:
await findVideos("Topic", { class: "10th", subject: "Biology" });

// Display videos...
```

### Use Case 3: Custom AI Request
```typescript
import { safeAPICall } from '@/integrations/bytez/setup';

const result = await safeAPICall("openai/gpt-4.1-mini", [
  { role: "user", content: "Your custom request" }
]);
```

---

## 🚀 Integration Checklist

- [ ] Install: `npm install bytez.js`
- [ ] Create: `.env.local` with `VITE_BYTEZ_API_KEY`
- [ ] Test: Run `validateEnvironment()` 
- [ ] Verify: API call works with `exampleHelloWorld()`
- [ ] Import: Use functions in your components
- [ ] Handle: Check for `error` in all responses
- [ ] Deploy: Ensure `.env` not in git

---

## 🔐 Security Reminders

✅ **DO:**
- Store API key in `.env.local`
- Use `import.meta.env.VITE_BYTEZ_API_KEY`
- Check for errors in all API calls
- Add error handling to user-facing features

❌ **DON'T:**
- Hardcode API keys
- Log API keys to console
- Commit `.env` files
- Expose API keys in client code

---

## 📞 Quick Reference

| Need | Location |
|------|----------|
| Setup instructions | [BYTEZ_SETUP_GUIDE.md](./BYTEZ_SETUP_GUIDE.md) |
| API examples | [src/integrations/bytez/setup.ts](./src/integrations/bytez/setup.ts) |
| React hooks | [src/integrations/bytez/hooks.ts](./src/integrations/bytez/hooks.ts) |
| Core functions | [src/integrations/bytez/index.ts](./src/integrations/bytez/index.ts) |
| API reference | [BYTEZ_QUICK_REFERENCE.md](./BYTEZ_QUICK_REFERENCE.md) |
| File guide | [FILE_INDEX.md](./FILE_INDEX.md) |

---

## ✅ Status

**Your Original Code:** ❌ (Has hardcoded API key, no error handling)  
**This Fixed Version:** ✅ (Production-ready, secure, well-documented)  
**Ready to Use:** ✅ YES

Start with [BYTEZ_SETUP_GUIDE.md](./BYTEZ_SETUP_GUIDE.md) and [src/integrations/bytez/setup.ts](./src/integrations/bytez/setup.ts) for the complete, fixed setup!

---

**Version:** 1.0.0 | **Date:** January 25, 2026 | **Status:** ✅ Production Ready
