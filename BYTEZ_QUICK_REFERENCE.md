# Bytez.js Integration - Quick Reference Guide

## 📦 Installation

```bash
# Using npm
npm install bytez.js

# Using yarn
yarn add bytez.js

# Using bun
bun add bytez.js
```

## 🔑 Environment Setup

Add to your `.env` file:
```env
VITE_BYTEZ_API_KEY=2622dd06541127bea7641c3ad0ed8859
```

## 🎯 Main Functions

### 1. Notes Quiz Generation
```typescript
import { generateNotesQuizWithBytez } from '@/integrations/bytez';

const { questions, error } = await generateNotesQuizWithBytez(
  "Your study notes...",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE",
    language: "English"
  },
  10,           // number of questions
  'medium'      // difficulty: 'easy' | 'medium' | 'hard'
);
```

**Returns:**
```typescript
{
  id: 1,
  question: "What is photosynthesis?",
  options: {
    a: "Process of energy conversion",
    b: "Process of energy storage",
    c: "Process of water absorption",
    d: "Process of nutrient absorption"
  },
  correctAnswer: "a",
  explanation: "Detailed explanation..."
}
```

### 2. Find Best Videos on YouTube
```typescript
import { findBestVideoOnYoutubeBytez } from '@/integrations/bytez';

const { videos, error } = await findBestVideoOnYoutubeBytez(
  "Photosynthesis",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE",
    language: "English",
    minDuration: 10  // minutes
  }
);
```

**Returns:**
```typescript
{
  title: "What is Photosynthesis",
  channel: "Amoeba Sisters",
  duration: 25,
  videoId: "dQw4w9WgXcQ",
  description: "This video explains photosynthesis...",
  why: "Great visuals and clear explanations perfect for 10th class",
  educationScore: 9,
  engagementScore: 8,
  topicsCovered: ["photosynthesis", "chloroplasts", "ATP"]
}
```

### 3. Generate Study Notes
```typescript
import { generateNotesWithBytez } from '@/integrations/bytez';

const { notes, error } = await generateNotesWithBytez(
  "Video Title",
  "Video content/transcript",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE",
    language: "English"
  }
);
```

### 4. Generate General Quiz
```typescript
import { generateQuizWithBytez } from '@/integrations/bytez';

const { questions, error } = await generateQuizWithBytez(
  "Content to create quiz from",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE"
  },
  10,
  'medium'
);
```

### 5. Validate Video URL
```typescript
import { validateVideoNotShort } from '@/integrations/bytez';

const result = validateVideoNotShort("https://youtube.com/watch?v=...");
// { valid: true }

const result = validateVideoNotShort("https://youtube.com/shorts/...");
// { valid: false, message: "YouTube Shorts are not supported..." }
```

## 🪝 React Hooks

```typescript
import {
  useNotesQuiz,
  useVideoSearch,
  useGenerateNotes
} from '@/integrations/bytez/hooks';

// In your component:
const { questions, loading, error, generateQuiz } = useNotesQuiz();
const { videos, loading: videoLoading, error: videoError, findVideos } = useVideoSearch();
const { notes, loading: notesLoading, error: notesError, generateNotes } = useGenerateNotes();
```

## ⚠️ Error Handling

All functions return `{ data?, error? }` format:

```typescript
const { questions, error } = await generateNotesQuizWithBytez(...);

if (error) {
  console.error('Error:', error);
  // Handle error gracefully
  return;
}

// Use questions safely
console.log(questions);
```

## 🎨 UI Component Example

```typescript
import { useNotesQuiz } from '@/integrations/bytez/hooks';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function QuizGenerator({ notes }: { notes: string }) {
  const { questions, loading, error, generateQuiz } = useNotesQuiz();

  const handleGenerateQuiz = async () => {
    await generateQuiz(notes, {
      class: "10th",
      subject: "Biology",
      board: "CBSE"
    }, 10, 'medium');
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerateQuiz}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          'Generate Quiz'
        )}
      </Button>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {questions && (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="p-4 border rounded">
              <h3 className="font-semibold mb-3">{question.question}</h3>
              <div className="space-y-2">
                {Object.entries(question.options).map(([key, option]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input type="radio" name={`q${question.id}`} value={key} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 p-2 bg-blue-50 text-sm rounded">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🔍 Available Models

| Model | Use Case |
|-------|----------|
| `google/gemini-3-pro-preview` | Quiz generation, Video search, Content analysis |
| `openai/gpt-4.1-mini` | Note generation, Text creation |

## 📋 Filter Options

```typescript
interface Filters {
  class?: string;      // "10th", "12th", etc.
  subject?: string;    // "Biology", "Physics", "Chemistry", etc.
  board?: string;      // "CBSE", "ICSE", "State Board", etc.
  language?: string;   // "English", "Hindi", etc.
  videoType?: string;  // "Lecture", "Animation", "Demonstration", etc.
  minDuration?: number; // Minimum video duration in minutes
}
```

## 🎯 Difficulty Levels

- **easy**: Basic concepts, definition-based questions
- **medium**: Application-based, mixed concept questions
- **hard**: Analysis, synthesis, complex problem-solving

## 📚 Additional Resources

- **Full Documentation:** [README.md](./README.md)
- **Code Examples:** [examples.ts](./examples.ts)
- **React Hooks:** [hooks.ts](./hooks.ts)
- **Main Integration:** [index.ts](./index.ts)

## ❓ FAQ

**Q: What if bytez.js is not installed?**  
A: The integration falls back to direct API calls. The functions will still work.

**Q: Can I use YouTube Shorts?**  
A: No, all video search functions explicitly exclude shorts and enforce a 10-minute minimum.

**Q: How many videos are returned?**  
A: Typically 5-7 of the best-matching videos are returned.

**Q: Can I customize the API key?**  
A: Yes, set `VITE_BYTEZ_API_KEY` environment variable.

**Q: What's the response time?**  
A: Usually 5-30 seconds depending on API load and content complexity.

---

**Last Updated:** January 25, 2026  
**Status:** ✅ Production Ready
