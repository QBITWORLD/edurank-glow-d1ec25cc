# Bytez.js API Integration

This directory contains the integration with Bytez.js API for AI-powered educational features.

## Quick Start

**See:** [BYTEZ_SETUP_GUIDE.md](../../BYTEZ_SETUP_GUIDE.md) for complete setup instructions

### Installation

```bash
npm install bytez.js
# or
yarn add bytez.js
# or
bun add bytez.js
```

### Setup

1. Add environment variable to `.env.local`:
   ```
   VITE_BYTEZ_API_KEY=2622dd06541127bea7641c3ad0ed8859
   ```

2. Import and use:
   ```typescript
   import { generateNotesQuizWithBytez, findBestVideoOnYoutubeBytez } from '@/integrations/bytez';
   ```

3. See [setup.ts](./setup.ts) for production-ready examples with error handling

## Features

### 1. Generate Study Notes
Generate comprehensive study notes from video content using GPT-4.1-mini.

```typescript
import { generateNotesWithBytez } from '@/integrations/bytez';

const { notes, error } = await generateNotesWithBytez(
  "Introduction to Photosynthesis",
  "Video transcript or content here...",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE",
    language: "English"
  }
);

if (error) {
  console.error('Error generating notes:', error);
} else {
  console.log('Generated notes:', notes);
}
```

### 2. Generate Notes Quiz
Generate multiple-choice quiz questions based on study notes using Gemini-3-pro-preview.

```typescript
import { generateNotesQuizWithBytez } from '@/integrations/bytez';

const { questions, error } = await generateNotesQuizWithBytez(
  "Your study notes here...",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE",
    language: "English"
  },
  10, // number of questions
  'medium' // difficulty level: 'easy' | 'medium' | 'hard'
);

if (error) {
  console.error('Error generating quiz:', error);
} else {
  console.log('Generated questions:', questions);
  // Questions format:
  // {
  //   id: 1,
  //   question: "What is photosynthesis?",
  //   options: { a: "...", b: "...", c: "...", d: "..." },
  //   correctAnswer: "a",
  //   explanation: "Detailed explanation..."
  // }
}
```

### 3. Find Best Video on YouTube
Find the best educational videos on YouTube for a specific topic using Gemini-3-pro-preview.

```typescript
import { findBestVideoOnYoutubeBytez } from '@/integrations/bytez';

const { videos, error } = await findBestVideoOnYoutubeBytez(
  "Photosynthesis",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE",
    language: "English",
    minDuration: 15 // minimum 15 minutes
  }
);

if (error) {
  console.error('Error finding videos:', error);
} else {
  console.log('Found videos:', videos);
  // Videos format:
  // {
  //   title: "What is Photosynthesis",
  //   channel: "Amoeba Sisters",
  //   duration: 25,
  //   videoId: "dQw4w9WgXcQ",
  //   description: "...",
  //   why: "...",
  //   educationScore: 9,
  //   engagementScore: 8,
  //   topicsCovered: ["concept1", "concept2"]
  // }
}
```

### 4. Generate General Quiz
Generate quiz questions from any content using Gemini-3-pro.

```typescript
import { generateQuizWithBytez } from '@/integrations/bytez';

const { questions, error } = await generateQuizWithBytez(
  "Content or notes to create quiz from",
  {
    class: "10th",
    subject: "Biology",
    board: "CBSE"
  },
  10, // number of questions
  'medium' // difficulty level
);
```

### 5. Validate Video URL
Validate that a video URL is not a YouTube Short.

```typescript
import { validateVideoNotShort } from '@/integrations/bytez';

const result = validateVideoNotShort('https://youtube.com/shorts/dQw4w9WgXcQ');
// { valid: false, message: "YouTube Shorts are not supported..." }

const result = validateVideoNotShort('https://youtube.com/watch?v=dQw4w9WgXcQ');
// { valid: true }
```

## Environment Variables

Add the following to your `.env` file:

```env
VITE_BYTEZ_API_KEY=your_bytez_api_key_here
```

## API Models Available

- `google/gemini-3-pro-preview` - For complex reasoning and content analysis
- `openai/gpt-4.1-mini` - For note generation and text creation
- Other models available through Bytez SDK

## Features & Constraints

### YouTube Shorts Protection
All video search functions explicitly exclude YouTube Shorts to ensure:
- Minimum 10-minute duration (or custom minimum)
- Full-length educational content
- Better learning outcomes
- Proper educational curriculum alignment

### Content Validation
- Educational channel verification
- Curriculum alignment checks
- Age-appropriate content filtering
- Duplicate detection

### Quality Scoring
Videos are scored on:
- **Education Score (1-10)**: Pedagogical value and accuracy
- **Engagement Score (1-10)**: Presentation quality and student engagement

## Error Handling

All functions return standardized response objects:

```typescript
interface Response {
  notes?: string;
  questions?: any[];
  videos?: any[];
  error?: string;
}
```

Always check for `error` before using the data:

```typescript
const { data, error } = await someBytezFunction();

if (error) {
  // Handle error
  console.error(error);
  return;
}

// Use data safely
console.log(data);
```

## Examples

See the following components for real-world usage:
- `/src/pages/Notes.tsx` - Notes generation
- `/src/pages/Quiz.tsx` - Quiz generation
- `/src/pages/VideoPlayer.tsx` - Video finding and playback

## Support

For issues or questions about Bytez.js API:
- Visit: https://bytez.com
- Documentation: https://docs.bytez.com
