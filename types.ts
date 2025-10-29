export enum GradeLevel {
  GRADE_R = 'Grade R',
  GRADE_1 = 'Grade 1',
  GRADE_2 = 'Grade 2',
  GRADE_3 = 'Grade 3',
  GRADE_4 = 'Grade 4',
  GRADE_5 = 'Grade 5',
  GRADE_6 = 'Grade 6',
  GRADE_7 = 'Grade 7',
  GRADE_8 = 'Grade 8',
  GRADE_9 = 'Grade 9',
  GRADE_10 = 'Grade 10',
  GRADE_11 = 'Grade 11',
  GRADE_12 = 'Grade 12',
}

export enum Subject {
  // Foundation Phase Subjects
  LIFE_SKILLS = 'Life Skills',
  // General Subjects
  MATHEMATICS = 'Mathematics',
  ENGLISH = 'English Home Language',
  AFRIKAANS = 'Afrikaans EAT',
  ZULU = 'isiZulu FAL',
  NATURAL_SCIENCES = 'Natural Sciences',
  SOCIAL_SCIENCES = 'Social Sciences (History & Geography)',
  TECHNOLOGY = 'Technology',
  ECONOMIC_MANAGEMENT_SCIENCES = 'Economic and Management Sciences (EMS)',
  CREATIVE_ARTS = 'Creative Arts',
  LIFE_ORIENTATION = 'Life Orientation',
  // FET Phase Subjects
  MATHEMATICAL_LITERACY = 'Mathematical Literacy',
  PHYSICAL_SCIENCES = 'Physical Sciences',
  LIFE_SCIENCES = 'Life Sciences',
  HISTORY = 'History',
  GEOGRAPHY = 'Geography',
  ACCOUNTING = 'Accounting',
  BUSINESS_STUDIES = 'Business Studies',
  COMPUTER_APPLICATIONS_TECHNOLOGY = 'Computer Applications Technology (CAT)',
}

export enum Language {
  ENGLISH = 'English',
  AFRIKAANS = 'Afrikaans',
  ISIZULU = 'isiZulu',
  ISIXHOSA = 'isiXhosa',
  ISINDEBELE = 'isiNdebele',
  SESOTHO = 'Sesotho',
  SEPEDI = 'Sepedi',
  SETSWANA = 'Setswana',
  SISWATI = 'siSwati',
  TSHIVENDA = 'Tshivenda',
  XITSONGA = 'Xitsonga',
}

export enum OutputType {
  LESSON_PLAN = 'Lesson Plan',
  STUDY_GUIDE = 'Study Guide',
  QUIZ = 'Quiz',
  DIFFERENTIATED_ACTIVITY = 'Differentiated Activity',
  MICRO_LESSON = 'Micro-Lesson',
  PROJECT_IDEA = 'Project-Based Learning Idea',
}

export interface FormData {
  gradeLevel: GradeLevel;
  subject: Subject;
  topic: string;
  outputType: OutputType;
  duration: number;
  numQuestions: number;
  language: Language;
  assignmentType?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type ParsedQuiz = QuizQuestion[];

export enum Role {
    TEACHER = 'Teacher',
    STUDENT = 'Student',
}

export interface User {
    name: string;
    role: Role;
    isPro?: boolean;
}

export interface Student {
    id: number;
    name: string;
}

export interface Communication {
    id: number;
    recipientName: string;
    recipientGrade: string;
    recipientEmail: string;
    message: string;
    sentAt: string;
    studentId?: number;
}

export enum AssignmentStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
}

export interface Assignment {
    id: number;
    title: string;
    type: OutputType;
    content: string | ParsedQuiz;
    dueDate: string;
    instructions: string;
    assignedTo: number[];
    submissions: Submission[];
}

export interface StudentAssignment {
    id: number;
    title: string;
    type: OutputType;
    content: string | ParsedQuiz;
    dueDate: string;
    instructions: string;
    status: AssignmentStatus;
    submission?: Submission;
}


export interface Submission {
    studentId: number;
    answers: (number | string | null)[];
    score?: number;
    submittedAt: string;
}