# MindVerse Prompt Engineering Methodology

## 1. Objective

The primary objective of our prompt engineering methodology is to reliably generate high-quality, accurate, and pedagogically sound educational content that is tailored to specific grade levels, subjects, and languages. We aim to create a system that is robust, scalable, and easy to maintain by leveraging structured prompting techniques with the Gemini API.

## 2. Core Principles

Our approach is built upon the following core principles:

- **Specificity and Clarity:** Prompts are designed to be unambiguous, leaving little room for misinterpretation by the model. We explicitly define the desired output, format, and constraints.
- **Role-Playing & Persona:** The AI is instructed to act as an expert in creating educational materials for a specific audience (e.g., "for {grade_level} students"). This helps attune the model to the appropriate tone, vocabulary, and complexity.
- **Structured Output:** We enforce a consistent structure for all generated content. For text-based resources, we mandate Markdown formatting with predefined sections. For data-intensive outputs like quizzes, we enforce a strict JSON schema.
- **Parameterization and Reusability:** Prompts are designed as templates with placeholders (e.g., `{topic}`, `{language}`, `{duration}`). This allows for dynamic content generation based on user input and ensures the prompts are highly reusable.
- **Constraint Enforcement:** We clearly state constraints within the prompt, such as the duration of a lesson, the number of quiz questions, or the required output language.
- **Iterative Refinement:** Our prompts are not static. They are subject to continuous testing and refinement based on the quality of the generated output to improve performance and reliability over time.

## 3. Anatomy of a Prompt

A typical prompt template in MindVerse follows a consistent structure, as seen in `constants.ts`. Let's break down the `LESSON_PLAN` prompt as an example:

`Create a {duration}-minute lesson plan for {grade_level} students on the topic of "{topic}" in the subject of {subject}. The entire output, including all text and instructions, must be in {language}. The output should be in Markdown format. Include the following sections: ...`

This can be deconstructed into several key components:

1.  **Command:** A clear action verb (`Create a...`, `Generate a...`).
2.  **Context & Parameters:** Defines the core request with dynamic values (`{duration}-minute lesson plan`, `for {grade_level} students`, `on the topic of "{topic}"`).
3.  **Global Constraints:** Rules that apply to the entire output (`The entire output... must be in {language}`).
4.  **Format Specification:** Explicitly defines the output format (`The output should be in Markdown format`).
5.  **Structural Requirements:** A detailed list of required sections and their descriptions (`Include the following sections: - **Learning Objectives:** ... - **Materials:** ...`).

This multi-faceted approach ensures the model has all the necessary information to generate a response that meets our exact requirements.

## 4. Specialized Techniques

We employ specialized techniques for different types of content to maximize quality and reliability.

### 4.1. JSON Schema for Quizzes

For quizzes, simply asking for a JSON string is unreliable. The model might produce malformed JSON or deviate from the expected structure. To solve this, we leverage Gemini's structured output capabilities.

In `services/geminiService.ts`, when the `outputType` is `QUIZ`, we include `responseMimeType: "application/json"` and a `responseSchema` in the API call.

```typescript
// services/geminiService.ts

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        // ...
      },
    },
  },
  // ...
};

// ... API Call
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: quizSchema,
  }
});
```

This approach forces the model's output to conform to the predefined schema, guaranteeing a valid, parseable JSON object that our application can immediately use. This eliminates the need for fragile string parsing and significantly improves the feature's robustness.

### 4.2. Markdown for Textual Content

For all other content types (Lesson Plans, Study Guides, etc.), we mandate Markdown as the output format.

- **Readability:** Markdown is easy for both humans and machines to read.
- **Universality:** It's a widely-accepted standard that can be effortlessly rendered into HTML for display in the application.
- **Structure:** It allows us to ask for specific structural elements like headings and lists, which adds clarity to the generated content.

## 5. Implementation in Code

- **`constants.ts`:** This file acts as our central "prompt library". It cleanly separates the prompt logic from the API service logic. Each `OutputType` is mapped to its corresponding prompt template, making the system easy to manage and extend with new content types.
- **`services/geminiService.ts`:** This service is responsible for the dynamic aspect of our methodology. The `generateContent` function takes the user's `FormData`, selects the appropriate template from `constants.ts`, and injects the user's parameters into the placeholders. It also contains the conditional logic to apply specialized techniques, like using the JSON schema for quizzes.

## 6. Future Enhancements

We are continuously exploring ways to improve our prompt engineering methodology. Potential future enhancements include:

- **Few-Shot Prompting:** For highly complex or nuanced content types, we may include one or two high-quality examples directly within the prompt to give the model a clearer "target" to aim for.
- **User Feedback Integration:** Implementing a system for teachers to rate the quality of the generated content. This feedback can be collected and analyzed to identify weaknesses in our prompts, leading to a data-driven refinement process.
- **System Instructions:** Leveraging the `systemInstruction` configuration option in the Gemini API to set a consistent, overarching persona for the model across different requests, further improving the quality and consistency of the educational content.