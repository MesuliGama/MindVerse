import React, { useState } from 'react';
import { ParsedQuiz, QuizQuestion } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface QuizViewProps {
  quiz: ParsedQuiz;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quiz Preview</h3>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
      </div>
      {quiz.map((item: QuizQuestion, index: number) => (
        <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{index + 1}. {item.question}</p>
          <div className="mt-3 space-y-2">
            {item.options.map((option: string, optionIndex: number) => {
              const isCorrect = optionIndex === item.correctAnswerIndex;
              const answerStyles = showAnswers
                ? isCorrect
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                : 'bg-slate-100 dark:bg-slate-700';

              return (
                <div
                  key={optionIndex}
                  className={`flex items-center p-2 rounded-md text-sm text-slate-700 dark:text-slate-300 transition-colors ${answerStyles}`}
                >
                    {showAnswers && (
                        isCorrect 
                        ? <CheckIcon className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" /> 
                        : <XIcon className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                    )}
                  <span>{option}</span>
                </div>
              );
            })}
          </div>
          {showAnswers && (
            <div className="mt-3 p-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-md">
              <span className="font-semibold">Explanation:</span> {item.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
