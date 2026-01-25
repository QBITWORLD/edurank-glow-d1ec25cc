/**
 * BYTEZ.JS API INTEGRATION - QUICK IMPORT GUIDE
 * 
 * Copy-paste ready import statements for all Bytez functions
 */

// ═══════════════════════════════════════════════════════════════
// 1. MAIN API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

import {
  generateNotesWithBytez,           // Generate notes from video
  generateNotesQuizWithBytez,       // Generate quiz from notes
  generateQuizWithBytez,            // Generate quiz from any content
  findBestVideoOnYoutubeBytez,      // Find best educational videos
  findVideoWithBytez,               // Find videos (alternative function)
  validateVideoNotShort,            // Validate video URLs
} from '@/integrations/bytez';


// ═══════════════════════════════════════════════════════════════
// 2. REACT HOOKS (for use in components)
// ═══════════════════════════════════════════════════════════════

import {
  useNotesQuiz,                     // Hook for notes quiz generation
  useVideoSearch,                   // Hook for video discovery
  useGenerateNotes,                 // Hook for note generation
} from '@/integrations/bytez/hooks';


// ═══════════════════════════════════════════════════════════════
// 3. EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════════

// EXAMPLE 1: Generate Quiz from Study Notes
// ────────────────────────────────────────────────────────────────

async function example_generateNotesQuiz() {
  const notes = `
    Photosynthesis is the process where plants convert light energy
    into chemical energy. It occurs in chloroplasts and involves...
  `;

  const { questions, error } = await generateNotesQuizWithBytez(
    notes,
    {
      class: "10th",
      subject: "Biology",
      board: "CBSE",
      language: "English"
    },
    10,        // Generate 10 questions
    'medium'   // Medium difficulty
  );

  if (error) {
    console.error('Quiz generation failed:', error);
    return;
  }

  // questions is an array of quiz objects
  console.log('Generated', questions?.length, 'questions');
  questions?.forEach((q, idx) => {
    console.log(`Q${idx + 1}: ${q.question}`);
    console.log(`Options: ${Object.values(q.options).join(' | ')}`);
    console.log(`Correct: ${q.correctAnswer}`);
    console.log(`---`);
  });
}


// EXAMPLE 2: Find Best Videos on YouTube
// ────────────────────────────────────────────────────────────────

async function example_findBestVideos() {
  const { videos, error } = await findBestVideoOnYoutubeBytez(
    "Photosynthesis",
    {
      class: "10th",
      subject: "Biology",
      board: "CBSE",
      language: "English",
      minDuration: 10
    }
  );

  if (error) {
    console.error('Video search failed:', error);
    return;
  }

  // videos is an array of video recommendations
  videos?.forEach((video) => {
    console.log(`Title: ${video.title}`);
    console.log(`Channel: ${video.channel}`);
    console.log(`Duration: ${video.duration} minutes`);
    console.log(`YouTube: youtube.com/watch?v=${video.videoId}`);
    console.log(`Education Score: ${video.educationScore}/10`);
    console.log(`Engagement Score: ${video.engagementScore}/10`);
    console.log(`Topics: ${video.topicsCovered.join(', ')}`);
    console.log(`---`);
  });
}


// EXAMPLE 3: Using React Hooks in Component
// ────────────────────────────────────────────────────────────────

import React, { useState } from 'react';

export function NotesQuizComponent() {
  const [notes, setNotes] = useState('');
  const { questions, loading, error, generateQuiz } = useNotesQuiz();

  const handleGenerateQuiz = async () => {
    await generateQuiz(notes, {
      class: "10th",
      subject: "Biology",
      board: "CBSE"
    }, 10, 'medium');
  };

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your study notes here..."
      />

      <button onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {questions && (
        <div>
          <h2>Quiz Questions</h2>
          {questions.map((q) => (
            <div key={q.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{q.question}</h3>
              {Object.entries(q.options).map(([key, text]) => (
                <label key={key} style={{ display: 'block', marginBottom: '5px' }}>
                  <input type="radio" name={`q${q.id}`} value={key} />
                  {text}
                </label>
              ))}
              <details style={{ marginTop: '10px' }}>
                <summary>Show Answer</summary>
                <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                <p><strong>Explanation:</strong> {q.explanation}</p>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// EXAMPLE 4: Video Search with React Hook
// ────────────────────────────────────────────────────────────────

export function VideoSearchComponent() {
  const { videos, loading, error, findVideos } = useVideoSearch();

  const handleSearchVideos = async () => {
    await findVideos("Photosynthesis", {
      class: "10th",
      subject: "Biology",
      board: "CBSE"
    });
  };

  return (
    <div>
      <button onClick={handleSearchVideos} disabled={loading}>
        {loading ? 'Searching Videos...' : 'Find Best Videos'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {videos && (
        <div>
          <h2>Recommended Videos</h2>
          {videos.map((video) => (
            <div key={video.videoId} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px' }}>
              <h3>{video.title}</h3>
              <p><strong>Channel:</strong> {video.channel}</p>
              <p><strong>Duration:</strong> {video.duration} minutes</p>
              <p><strong>Description:</strong> {video.description}</p>
              <p><strong>Education Score:</strong> {video.educationScore}/10</p>
              <p><strong>Engagement Score:</strong> {video.engagementScore}/10</p>
              <p><strong>Topics:</strong> {video.topicsCovered.join(', ')}</p>
              <a
                href={`https://youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// 4. TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation: string;
}

interface VideoRecommendation {
  title: string;
  channel: string;
  duration: number;
  videoId: string;
  description: string;
  why: string;
  educationScore: number;
  engagementScore: number;
  topicsCovered: string[];
}

interface Filters {
  class?: string;
  subject?: string;
  board?: string;
  language?: string;
  videoType?: string;
  minDuration?: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}


// ═══════════════════════════════════════════════════════════════
// 5. ENVIRONMENT SETUP
// ═══════════════════════════════════════════════════════════════

// Add to .env file:
// VITE_BYTEZ_API_KEY=2622dd06541127bea7641c3ad0ed8859


// ═══════════════════════════════════════════════════════════════
// 6. DIFFICULTY LEVELS
// ═══════════════════════════════════════════════════════════════

type DifficultyLevel = 'easy' | 'medium' | 'hard';

// easy:   Definition-based, memorization questions
// medium: Application-based, conceptual understanding
// hard:   Analysis, synthesis, problem-solving


// ═══════════════════════════════════════════════════════════════
// 7. QUICK FILTERS
// ═══════════════════════════════════════════════════════════════

const CBSE_10TH_BIOLOGY = {
  class: "10th",
  subject: "Biology",
  board: "CBSE"
};

const ICSE_12TH_PHYSICS = {
  class: "12th",
  subject: "Physics",
  board: "ICSE"
};

const STATE_9TH_CHEMISTRY = {
  class: "9th",
  subject: "Chemistry",
  board: "State Board"
};


// ═══════════════════════════════════════════════════════════════
// 8. ERROR HANDLING PATTERN
// ═══════════════════════════════════════════════════════════════

async function safeApiCall<T>(
  apiFunction: () => Promise<{ data?: T; error?: string }>,
  onError?: (error: string) => void
): Promise<T | null> {
  try {
    const { data, error } = await apiFunction();

    if (error) {
      console.error('API Error:', error);
      onError?.(error);
      return null;
    }

    return data || null;
  } catch (exception) {
    const message = exception instanceof Error ? exception.message : 'Unknown error';
    console.error('Exception:', message);
    onError?.(message);
    return null;
  }
}

// Usage:
const questions = await safeApiCall(
  () => generateNotesQuizWithBytez(notes, filters),
  (error) => alert(`Failed to generate quiz: ${error}`)
);
