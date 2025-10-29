

import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, ParsedQuiz } from '../types';
import { OutputType } from '../types';
import { PROMPT_TEMPLATES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    quiz: {
      type: Type.ARRAY,
      description: "A list of quiz questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The text of the question."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of four possible answers.",
            items: {
              type: Type.STRING
            }
          },
          correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The 0-based index of the correct answer in the 'options' array."
          },
          explanation: {
            type: Type.STRING,
            description: "An explanation of why the correct answer is correct."
          },
        },
        required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
      },
    },
  },
  required: ['quiz'],
};

export const generateContent = async (formData: FormData): Promise<string | ParsedQuiz> => {
  let prompt = PROMPT_TEMPLATES[formData.outputType];

  prompt = prompt
    .replace('{grade_level}', formData.gradeLevel)
    .replace('{subject}', formData.subject)
    .replace('{topic}', formData.topic)
    .replace('{duration}', String(formData.duration))
    .replace('{language}', formData.language);
    
  if (formData.outputType === OutputType.QUIZ) {
    prompt = prompt.replace('{num_questions}', String(formData.numQuestions));
  }

  // Use the full Content[] structure for the request body. This is more explicit and can resolve
  // potential proxy or API interpretation issues that might cause generic network errors.
  const structuredContents = [{ role: 'user', parts: [{ text: prompt }] }];

  try {
    if (formData.outputType === OutputType.QUIZ) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: structuredContents,
        config: {
          responseMimeType: "application/json",
          responseSchema: quizSchema,
        }
      });
      const jsonResponse = JSON.parse(response.text);
      return jsonResponse.quiz as ParsedQuiz;
    } else {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: structuredContents,
      });
      return response.text;
    }
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while generating content: ${error.message}. Please check your API key and try again.`);
    }
    throw new Error("An unknown error occurred while generating content.");
  }
};