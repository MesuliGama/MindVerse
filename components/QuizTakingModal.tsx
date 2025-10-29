import React, { useState } from 'react';
import { StudentAssignment, ParsedQuiz, QuizQuestion } from '../types';
import { XIcon } from './icons/XIcon';

interface QuizTakingModalProps {
  assignment: StudentAssignment;
  onClose: () => void;
  onSubmit: (answers: (number | null)[]) => void;
}

export const QuizTakingModal: React.FC<QuizTakingModalProps> = ({ assignment, onClose, onSubmit }) => {
  const quizContent = assignment.content as ParsedQuiz;
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizContent.length).fill(null));

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{assignment.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.type}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            {quizContent.map((item: QuizQuestion, index: number) => (
              <div key={index}>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{index + 1}. {item.question}</p>
                <div className="mt-3 space-y-2">
                  {item.options.map((option: string, optionIndex: number) => (
                    <label key={optionIndex} className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 has-[:checked]:bg-indigo-100 dark:has-[:checked]:bg-indigo-900/50 has-[:checked]:ring-2 has-[:checked]:ring-indigo-500 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={answers[index] === optionIndex}
                        onChange={() => handleAnswerChange(index, optionIndex)}
                        className="h-4 w-4 border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={answers.some(a => a === null)}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
