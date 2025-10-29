import React from 'react';
import { Assignment, Student, Submission, ParsedQuiz, QuizQuestion } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface StudentSubmissionModalProps {
  assignment: Assignment;
  student: Student;
  submission: Submission;
  onClose: () => void;
}

export const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({ assignment, student, submission, onClose }) => {
  const quizContent = assignment.content as ParsedQuiz;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Submission: {student.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.title}</p>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {quizContent.map((item: QuizQuestion, index: number) => {
            const studentAnswerIndex = submission.answers[index] as number;
            const isCorrect = studentAnswerIndex === item.correctAnswerIndex;

            return (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{index + 1}. {item.question}</p>
                <div className="mt-3 space-y-2">
                  {item.options.map((option: string, optionIndex: number) => {
                    const isStudentAnswer = optionIndex === studentAnswerIndex;
                    const isCorrectAnswer = optionIndex === item.correctAnswerIndex;
                    
                    let styles = 'bg-slate-100 dark:bg-slate-700';
                    if (isStudentAnswer && isCorrectAnswer) {
                      styles = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700';
                    } else if (isStudentAnswer && !isCorrectAnswer) {
                      styles = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-700';
                    } else if (isCorrectAnswer) {
                       styles = 'bg-green-100 dark:bg-green-900/30 ring-1 ring-green-300 dark:ring-green-700';
                    }

                    return (
                      <div
                        key={optionIndex}
                        className={`flex items-center p-2 rounded-md text-sm text-slate-700 dark:text-slate-300 ${styles}`}
                      >
                         {isCorrectAnswer && <CheckIcon className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />}
                         {!isCorrectAnswer && isStudentAnswer && <XIcon className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />}
                        <span className="ml-2">{option}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
