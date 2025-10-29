import React, { useState } from 'react';
import { ParsedQuiz, QuizQuestion } from '../types';
import { XIcon } from './icons/XIcon';
import { CheckIcon } from './icons/CheckIcon';

interface TeacherQuizModalProps {
  quiz: ParsedQuiz;
  title: string;
  onClose: () => void;
}

export const TeacherQuizModal: React.FC<TeacherQuizModalProps> = ({ quiz, title, onClose }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswers = quiz.reduce((count, question, index) => {
      return count + (question.correctAnswerIndex === answers[index] ? 1 : 0);
    }, 0);
    const calculatedScore = Math.round((correctAnswers / quiz.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setAnswers(Array(quiz.length).fill(null));
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quiz Self-Assessment</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
            <div className="p-6 space-y-6">
              {quiz.map((item: QuizQuestion, index: number) => (
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
                Submit Answers
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Your Score</h3>
                    <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{score}%</p>
                </div>

              {quiz.map((item: QuizQuestion, index: number) => {
                const userAnswerIndex = answers[index] as number;
                const isCorrect = userAnswerIndex === item.correctAnswerIndex;

                return (
                  <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{index + 1}. {item.question}</p>
                    <div className="mt-3 space-y-2">
                      {item.options.map((option: string, optionIndex: number) => {
                        const isUserAnswer = optionIndex === userAnswerIndex;
                        const isCorrectAnswer = optionIndex === item.correctAnswerIndex;
                        
                        let styles = 'bg-slate-100 dark:bg-slate-700';
                        if (isUserAnswer && isCorrectAnswer) {
                          styles = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          styles = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-700';
                        } else if (isCorrectAnswer) {
                           styles = 'bg-green-100/50 dark:bg-green-900/20';
                        }

                        return (
                          <div
                            key={optionIndex}
                            className={`flex items-center p-2 rounded-md text-sm text-slate-700 dark:text-slate-300 ${styles}`}
                          >
                             {isCorrectAnswer && <CheckIcon className="w-4 h-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />}
                             {!isCorrectAnswer && isUserAnswer && <XIcon className="w-4 h-4 mr-2 text-red-500 dark:text-red-400 flex-shrink-0" />}
                            <span className="ml-2">{option}</span>
                          </div>
                        );
                      })}
                    </div>
                     <div className="mt-3 p-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-md">
                        <span className="font-semibold">Explanation:</span> {item.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
                <button
                type="button"
                onClick={handleTryAgain}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Try Again
                </button>
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Close
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};