# Bytez.js Setup & Configuration Guide

## 🚀 Quick Setup

### 1. Install Package

```bash
# Using npm
npm install bytez.js

# Using yarn
yarn add bytez.js

# Using bun
bun add bytez.js
```

### 2. Environment Variables

Create or update your `.env` file:

```env
# .env or .env.local
VITE_BYTEZ_API_KEY=2622dd06541127bea7641c3ad0ed8859
```

For Vite projects, environment variables must be prefixed with `VITE_`:

```typescript
// Access in your code:
const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;
```

### 3. Basic Usage

```typescript
import Bytez from "bytez.js";

const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;
const sdk = new Bytez(apiKey);
const model = sdk.model("google/gemini-3-pro-preview");

const { error, output } = await model.run([
  {
    role: "user",
    content: "Hello",
  },
]);

console.log({ error, output });
```

---

## 📋 Environment Configuration

### .env File Setup

```bash
# Create .env file in project root
touch .env.local
```

### .env Content

```env
# Bytez API Configuration
VITE_BYTEZ_API_KEY=2622dd06541127bea7641c3ad0ed8859

# Optional: Other API keys
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### .gitignore Protection

Ensure your `.gitignore` includes:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

---

## 🔧 Production-Ready Setup

### See: `src/integrations/bytez/setup.ts`

The setup file includes:

1. **`initializeBytezSDK()`** - Initialize with error handling
2. **`safeAPICall()`** - Type-safe wrapper with validation
3. **`validateEnvironment()`** - Check configuration
4. **Complete examples** - 7 different use cases

### Usage Example

```typescript
import {
  initializeBytezSDK,
  safeAPICall,
  validateEnvironment,
  generateEducationalContent,
} from "@/integrations/bytez/setup";

// Check environment first
const envCheck = validateEnvironment();
if (!envCheck.valid) {
  console.error(envCheck.message);
  return;
}

// Generate educational content
const result = await generateEducationalContent(
  "Photosynthesis",
  "notes"
);

if (result.success) {
  console.log("Content:", result.data);
} else {
  console.error("Error:", result.error);
}
```

---

## 📚 Available Models

### Gemini Models (Recommended)
```typescript
const model = sdk.model("google/gemini-3-pro-preview");
```
- **Best for:** Quiz generation, content analysis, video search
- **Speed:** Fast
- **Quality:** High reasoning ability

### OpenAI Models
```typescript
const model = sdk.model("openai/gpt-4.1-mini");
```
- **Best for:** Note generation, creative writing
- **Speed:** Very fast
- **Quality:** Excellent for structured content

---

## 🔐 Security Best Practices

### ✅ DO:
- Store API keys in environment variables
- Use `.env.local` for local development
- Protect `.env` files in `.gitignore`
- Never commit API keys to git
- Use different keys for different environments

### ❌ DON'T:
- Hardcode API keys in source code
- Commit `.env` files to version control
- Share API keys in pull requests
- Log API keys to console in production
- Use the same key across environments

---

## 🧪 Testing Setup

### Validate Your Setup

```typescript
import { validateEnvironment } from "@/integrations/bytez/setup";

const check = validateEnvironment();
console.log(check.message);
```

### Test API Connection

```typescript
import { exampleHelloWorld } from "@/integrations/bytez/setup";

const response = await exampleHelloWorld();
if (response) {
  console.log("✓ Bytez.js is working!");
} else {
  console.error("✗ Check your API key and environment setup");
}
```

---

## 🚨 Troubleshooting

### Issue: "VITE_BYTEZ_API_KEY not set"

**Solution:**
1. Create `.env.local` in project root
2. Add: `VITE_BYTEZ_API_KEY=your_key`
3. Restart dev server: `npm run dev`

### Issue: API Returns Error

**Check:**
- API key is valid
- Environment variables are loaded
- Internet connection is working
- API key has necessary permissions

### Issue: Blank Response from API

**Check:**
- Message format is correct
- Model name is valid
- Input content is not empty
- API rate limit not exceeded

### Issue: TypeScript Errors

**Solution:**
```bash
# Ensure @types are installed
npm install --save-dev @types/node

# Or if using bytez.js types
npm install bytez.js
```

---

## 🎯 Examples by Use Case

### Notes Generation
```typescript
const result = await generateEducationalContent("Topic", "notes");
```

### Quiz Generation
```typescript
const result = await generateEducationalContent("Topic", "quiz");
```

### Summary Creation
```typescript
const result = await generateEducationalContent("Topic", "summary");
```

### Custom Queries
```typescript
const result = await safeAPICall("google/gemini-3-pro-preview", [
  {
    role: "user",
    content: "Your custom question",
  },
]);
```

### Batch Processing
```typescript
import { batchProcessQueries } from "@/integrations/bytez/setup";

const queries = [
  { model: "google/gemini-3-pro-preview", content: "Question 1" },
  { model: "openai/gpt-4.1-mini", content: "Question 2" },
];

const results = await batchProcessQueries(queries);
```

---

## 📖 File Reference

| File | Purpose |
|------|---------|
| `src/integrations/bytez/setup.ts` | Production setup & examples |
| `src/integrations/bytez/index.ts` | Core API functions |
| `src/integrations/bytez/hooks.ts` | React hooks |
| `src/integrations/bytez/examples.ts` | More examples |
| `src/integrations/bytez/README.md` | Full documentation |

---

## ✅ Verification Checklist

- [ ] `.env.local` created with `VITE_BYTEZ_API_KEY`
- [ ] `bytez.js` package installed
- [ ] Dev server restarted
- [ ] Environment check passes
- [ ] Test API call succeeds
- [ ] No API key in git history
- [ ] `.env` in `.gitignore`

---

## 🔗 Resources

- **Bytez Documentation:** https://docs.bytez.com
- **API Reference:** [BYTEZ_QUICK_REFERENCE.md](../../BYTEZ_QUICK_REFERENCE.md)
- **Setup Examples:** [setup.ts](./setup.ts)
- **React Integration:** [hooks.ts](./hooks.ts)

---

**Status:** ✅ Ready to Use | **Version:** 1.0.0
