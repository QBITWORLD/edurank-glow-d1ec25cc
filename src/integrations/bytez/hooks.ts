/**
 * React Hook for Bytez.js API Integration
 * Provides easy-to-use hooks for components
 */

// @ts-expect-error - react types
import { useState } from 'react';
import {
  generateNotesWithBytez,
  generateNotesQuizWithBytez,
  findBestVideoOnYoutubeBytez,
  generateQuizWithBytez,
} from '@/integrations/bytez';

interface UseNotesQuizResult {
  questions: any[] | null;
  loading: boolean;
  error: string | null;
  generateQuiz: (
    notes: string,
    filters: any,
    questionCount?: number,
    difficulty?: 'easy' | 'medium' | 'hard'
  ) => Promise<void>;
}

/**
 * Hook for generating quiz from notes
 */
export function useNotesQuiz(): UseNotesQuizResult {
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async (
    notes: string,
    filters: any,
    questionCount = 10,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { questions: generatedQuestions, error: apiError } =
        await generateNotesQuizWithBytez(notes, filters, questionCount, difficulty);

      if (apiError) {
        setError(apiError);
        setQuestions(null);
      } else {
        setQuestions(generatedQuestions || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      setQuestions(null);
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error, generateQuiz };
}

interface UseVideoSearchResult {
  videos: any[] | null;
  loading: boolean;
  error: string | null;
  findVideos: (topic: string, filters: any) => Promise<void>;
}

/**
 * Hook for finding best videos on YouTube
 */
export function useVideoSearch(): UseVideoSearchResult {
  const [videos, setVideos] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findVideos = async (topic: string, filters: any) => {
    setLoading(true);
    setError(null);

    try {
      const { videos: foundVideos, error: apiError } =
        await findBestVideoOnYoutubeBytez(topic, filters);

      if (apiError) {
        setError(apiError);
        setVideos(null);
      } else {
        setVideos(foundVideos || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find videos');
      setVideos(null);
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, error, findVideos };
}

interface UseGenerateNotesResult {
  notes: string | null;
  loading: boolean;
  error: string | null;
  generateNotes: (title: string, content: string, filters: any) => Promise<void>;
}

/**
 * Hook for generating notes from video content
 */
export function useGenerateNotes(): UseGenerateNotesResult {
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNotes = async (title: string, content: string, filters: any) => {
    setLoading(true);
    setError(null);

    try {
      const { notes: generatedNotes, error: apiError } = await generateNotesWithBytez(
        title,
        content,
        filters
      );

      if (apiError) {
        setError(apiError);
        setNotes(null);
      } else {
        setNotes(generatedNotes || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate notes');
      setNotes(null);
    } finally {
      setLoading(false);
    }
  };

  return { notes, loading, error, generateNotes };
}

/**
 * Example: Using hooks in a React component
 *
 * export function NotesAndQuizPage() {
 *   const [notes, setNotes] = useState('');
 *   const { questions, loading: quizLoading, error: quizError, generateQuiz } = useNotesQuiz();
 *   const { videos, loading: videoLoading, error: videoError, findVideos } = useVideoSearch();
 *
 *   const handleGenerateQuiz = async () => {
 *     await generateQuiz(notes, {
 *       class: "10th",
 *       subject: "Biology",
 *       board: "CBSE"
 *     }, 10, 'medium');
 *   };
 *
 *   const handleFindVideos = async () => {
 *     await findVideos("Photosynthesis", {
 *       class: "10th",
 *       subject: "Biology"
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <textarea
 *         value={notes}
 *         onChange={(e) => setNotes(e.target.value)}
 *         placeholder="Enter your study notes..."
 *       />
 *
 *       <button onClick={handleGenerateQuiz} disabled={quizLoading}>
 *         {quizLoading ? 'Generating...' : 'Generate Quiz'}
 *       </button>
 *
 *       {quizError && <div className="error">{quizError}</div>}
 *
 *       {questions && (
 *         <div className="quiz-questions">
 *           {questions.map((q) => (
 *             <div key={q.id} className="question">
 *               <h3>{q.question}</h3>
 *               {Object.entries(q.options).map(([key, option]) => (
 *                 <label key={key}>
 *                   <input type="radio" name={`q${q.id}`} value={key} />
 *                   {option}
 *                 </label>
 *               ))}
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *
 *       <button onClick={handleFindVideos} disabled={videoLoading}>
 *         {videoLoading ? 'Searching...' : 'Find Videos'}
 *       </button>
 *
 *       {videoError && <div className="error">{videoError}</div>}
 *
 *       {videos && (
 *         <div className="videos-list">
 *           {videos.map((v) => (
 *             <div key={v.videoId} className="video-card">
 *               <h3>{v.title}</h3>
 *               <p>Channel: {v.channel}</p>
 *               <p>Duration: {v.duration} minutes</p>
 *               <p>Education Score: {v.educationScore}/10</p>
 *               <p>Engagement Score: {v.engagementScore}/10</p>
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */
