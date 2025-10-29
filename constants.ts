import { OutputType } from './types';

export const PROMPT_TEMPLATES: Record<OutputType, string> = {
    [OutputType.LESSON_PLAN]: `Create a {duration}-minute lesson plan for {grade_level} students on the topic of "{topic}" in the subject of {subject}. The entire output, including all text and instructions, must be in {language}. The output should be in Markdown format. Include the following sections:
- **Learning Objectives:** 2-3 clear, measurable objectives.
- **Materials:** A list of necessary materials.
- **Lesson Activities:** A step-by-step plan including an introduction, main activity, and a conclusion.
- **Assessment:** A brief method to check for student understanding.`,
    [OutputType.STUDY_GUIDE]: `Generate a structured study guide in Markdown for {grade_level} students on the topic of "{topic}" in the subject of {subject}. The entire output must be in {language}. The guide should include:
- **Key Concepts:** A summary of the 3 most important concepts.
- **Vocabulary:** 5 key vocabulary terms with simple definitions.
- **Practice Questions:** 5 practice questions to test knowledge, with an answer key at the end.`,
    [OutputType.QUIZ]: `Create a {num_questions}-question quiz on the topic of "{topic}" for {grade_level} students in the subject of {subject}. The entire output, including the questions, options, and explanations, must be in {language}. For each question, provide the question text, four options, the index of the correct answer (from 0 to 3), and a brief explanation for why the answer is correct.`,
    [OutputType.DIFFERENTIATED_ACTIVITY]: `Design three tiered learning activities in Markdown (for beginner, intermediate, and advanced learners) for {grade_level} students on the topic of "{topic}" in the subject of {subject}. The entire output must be in {language}. For each tier, clearly describe:
- **Activity Title:** A descriptive title.
- **Instructions:** Step-by-step instructions.
- **Expected Outcome:** What students should be able to do after the activity.`,
    [OutputType.MICRO_LESSON]: `Generate a script in Markdown for a 10-minute micro-lesson for {grade_level} students on the topic of "{topic}" in the subject of {subject}. The entire script must be in {language}. The script should include:
- **Engaging Hook:** A question or short story to capture attention (1 minute).
- **Core Teaching Point:** A simple explanation of the main concept (5-7 minutes).
- **Exit Ticket:** One question to quickly assess understanding (2-3 minutes).`,
    [OutputType.PROJECT_IDEA]: `Generate a project-based learning (PBL) idea in Markdown for {grade_level} students on the topic of "{topic}" in the subject of {subject}. The entire output must be in {language}. The project should be designed to last approximately {duration} days. Include the following sections:
- **Project Title:** A catchy and descriptive title.
- **Driving Question:** An open-ended question that guides the project.
- **Project Summary:** A brief overview of the project and its goals.
- **Key Activities & Timeline:** A suggested breakdown of activities over the project duration.
- **Final Product:** What students will create to demonstrate their learning.
- **Real-World Connection:** How the project connects to real-world contexts or careers.`,
};