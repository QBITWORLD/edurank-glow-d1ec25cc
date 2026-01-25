/**
 * Bytez.js API Usage Examples
 * This file demonstrates how to use the Bytez integration for various tasks
 */

import {
  generateNotesWithBytez,
  generateNotesQuizWithBytez,
  findBestVideoOnYoutubeBytez,
  generateQuizWithBytez,
  validateVideoNotShort,
} from './index';

/**
 * Example 1: Generate Notes from Video Content
 */
export async function exampleGenerateNotes() {
  const videoTitle = "Introduction to Photosynthesis";
  const videoContent = `
    Photosynthesis is the process by which plants convert light energy 
    into chemical energy. This process occurs in the chloroplasts of plant cells...
  `;

  const { notes, error } = await generateNotesWithBytez(
    videoTitle,
    videoContent,
    {
      class: "10th",
      subject: "Biology",
      board: "CBSE",
      language: "English",
    }
  );

  if (error) {
    console.error('Failed to generate notes:', error);
    return null;
  }

  return notes;
}

/**
 * Example 2: Generate Quiz from Notes
 */
export async function exampleGenerateNotesQuiz() {
  const studyNotes = `
    Key Points about Photosynthesis:
    - Process: Light + CO2 + H2O → Glucose + O2
    - Occurs in chloroplasts
    - Two main stages: Light reactions and Calvin cycle
    - Light reactions produce ATP and NADPH
    - Calvin cycle produces glucose
  `;

  const { questions, error } = await generateNotesQuizWithBytez(
    studyNotes,
    {
      class: "10th",
      subject: "Biology",
      board: "CBSE",
      language: "English",
    },
    10,
    'medium'
  );

  if (error) {
    console.error('Failed to generate quiz:', error);
    return null;
  }

  return questions;
}

/**
 * Example 3: Find Best Educational Video on YouTube
 */
export async function exampleFindBestVideo() {
  const { videos, error } = await findBestVideoOnYoutubeBytez(
    "Photosynthesis",
    {
      class: "10th",
      subject: "Biology",
      board: "CBSE",
      language: "English",
      minDuration: 10,
    }
  );

  if (error) {
    console.error('Failed to find videos:', error);
    return null;
  }

  // Log the videos found
  videos?.forEach((video, index) => {
    console.log(`Video ${index + 1}: ${video.title}`);
    console.log(`  Channel: ${video.channel}`);
    console.log(`  Duration: ${video.duration} minutes`);
    console.log(`  Education Score: ${video.educationScore}/10`);
    console.log(`  Engagement Score: ${video.engagementScore}/10`);
  });

  return videos;
}

/**
 * Example 4: Generate Quiz for Any Content
 */
export async function exampleGenerateGeneralQuiz() {
  const content = "Your study material here...";

  const { questions, error } = await generateQuizWithBytez(
    content,
    {
      class: "12th",
      subject: "Physics",
      board: "CBSE",
    },
    15,
    'hard'
  );

  if (error) {
    console.error('Failed to generate quiz:', error);
    return null;
  }

  return questions;
}

/**
 * Example 5: Validate Video URL
 */
export function exampleValidateVideo() {
  // Test with a shorts URL
  const shortsUrl = 'https://youtube.com/shorts/abc123';
  const shortsValidation = validateVideoNotShort(shortsUrl);
  console.log('Shorts validation:', shortsValidation);
  // Output: { valid: false, message: "YouTube Shorts are not supported..." }

  // Test with a regular video URL
  const regularUrl = 'https://youtube.com/watch?v=abc123';
  const regularValidation = validateVideoNotShort(regularUrl);
  console.log('Regular video validation:', regularValidation);
  // Output: { valid: true }
}

/**
 * Example 6: Complete Learning Flow
 * Generate notes → Generate quiz → Find videos
 */
export async function exampleCompleteLearningFlow(topic: string, filters: any) {
  try {
    // Step 1: Generate study notes
    console.log('Step 1: Generating study notes...');
    const { notes, error: notesError } = await generateNotesWithBytez(
      `Complete Guide to ${topic}`,
      `Detailed content about ${topic}...`,
      filters
    );

    if (notesError) {
      throw new Error(`Failed to generate notes: ${notesError}`);
    }

    // Step 2: Generate quiz from the notes
    console.log('Step 2: Generating quiz questions...');
    const { questions, error: quizError } = await generateNotesQuizWithBytez(
      notes!,
      filters,
      10,
      'medium'
    );

    if (quizError) {
      throw new Error(`Failed to generate quiz: ${quizError}`);
    }

    // Step 3: Find best videos on the topic
    console.log('Step 3: Finding best videos...');
    const { videos, error: videosError } = await findBestVideoOnYoutubeBytez(
      topic,
      filters
    );

    if (videosError) {
      throw new Error(`Failed to find videos: ${videosError}`);
    }

    return {
      notes,
      questions,
      videos,
      success: true,
    };
  } catch (error) {
    console.error('Error in learning flow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Example 7: Advanced Quiz Generation with Different Difficulty Levels
 */
export async function exampleDifficultyLevelQuiz(content: string) {
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  const quizzes: any = {};

  for (const difficulty of difficulties) {
    const { questions, error } = await generateNotesQuizWithBytez(
      content,
      {
        class: "10th",
        subject: "Biology",
        board: "CBSE",
      },
      5,
      difficulty
    );

    if (!error && questions) {
      quizzes[difficulty] = questions;
    }
  }

  return quizzes;
}

/**
 * Example 8: Finding Videos with Custom Duration Requirements
 */
export async function exampleFindVideosByDuration() {
  const durationLevels = [
    { min: 10, max: 15, label: 'Quick Overview' },
    { min: 15, max: 30, label: 'Standard Lesson' },
    { min: 30, max: 60, label: 'Deep Dive' },
    { min: 60, label: 'Comprehensive' },
  ];

  const videosByDuration: any = {};

  for (const duration of durationLevels) {
    const { videos, error } = await findBestVideoOnYoutubeBytez(
      "Photosynthesis",
      {
        class: "10th",
        subject: "Biology",
        board: "CBSE",
        minDuration: duration.min,
      }
    );

    if (!error && videos) {
      videosByDuration[duration.label] = videos.filter(
        (v: any) => !duration.max || v.duration <= duration.max
      );
    }
  }

  return videosByDuration;
}
