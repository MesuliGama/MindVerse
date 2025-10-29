import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { PencilIcon } from './icons/PencilIcon';
import { ParsedQuiz, OutputType } from '../types';
import { QuizView } from './QuizView';
import { TeacherQuizModal } from './TeacherQuizModal';

interface ContentDisplayProps {
  content: string | ParsedQuiz | null;
  outputType: OutputType | null;
  isLoading: boolean;
  error: string | null;
  onAssign: () => void;
  generationTime: number | null;
  topic: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
     <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-6"></div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
  </div>
);

const InitialState: React.FC = () => (
    <div className="text-center text-slate-500 dark:text-slate-400">
        <SparklesIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">Let's create something amazing!</h3>
        <p className="mt-1 text-sm">Fill out the form to generate educational content.</p>
    </div>
);

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, outputType, isLoading, error, onAssign, generationTime, topic }) => {
  const [copyText, setCopyText] = useState('Copy');
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const isQuiz = Array.isArray(content);
  
  const isAssignable = outputType === OutputType.QUIZ || outputType === OutputType.STUDY_GUIDE;

  useEffect(() => {
    if (copyText === 'Copied!') {
      const timer = setTimeout(() => setCopyText('Copy'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyText]);

  const handleCopy = () => {
    if (typeof content === 'string') {
        navigator.clipboard.writeText(content);
        setCopyText('Copied!');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="flex-shrink-0 mb-4 flex items-center justify-between">
        <div>
          {generationTime && !isLoading && content && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Generated in {(generationTime / 1000).toFixed(2)}s
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {content && !isQuiz && (
              <button 
                  onClick={handleCopy} 
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-md flex items-center transition-colors"
              >
                  <ClipboardIcon className="w-4 h-4 mr-1.5" />
                  {copyText}
              </button>
          )}
          {content && isQuiz && (
            <button 
                onClick={() => setIsTakingQuiz(true)}
                className="bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800/80 text-green-700 dark:text-green-300 text-xs font-semibold py-1.5 px-3 rounded-md flex items-center transition-colors"
            >
                <PencilIcon className="w-4 h-4 mr-1.5" />
                Try Quiz
            </button>
          )}
          {content && isAssignable && (
              <button 
                  onClick={onAssign}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md flex items-center transition-colors shadow-sm"
              >
                  <UserGroupIcon className="w-4 h-4 mr-1.5" />
                  Assign to Student
              </button>
          )}
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center relative">
          <div className="w-full h-full">
          {isLoading && <LoadingSkeleton />}
          {error && <div className="text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">{error}</div>}
          {!isLoading && !error && !content && <InitialState />}
          {!isLoading && !error && content && (
              isQuiz ? (
                  <QuizView quiz={content as ParsedQuiz} />
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 h-full w-full overflow-y-auto">
                    <div 
                        className="prose prose-lg dark:prose-invert max-w-none text-slate-900 dark:text-slate-300
                                   prose-a:text-indigo-600 hover:prose-a:text-indigo-700 
                                   dark:prose-a:text-indigo-400 dark:hover:prose-a:text-indigo-300
                                   prose-blockquote:border-l-indigo-500
                                   prose-ul:marker:text-indigo-600 dark:prose-ul:marker:text-indigo-400
                                   prose-ol:marker:text-indigo-600 dark:prose-ol:marker:text-indigo-400"
                        dangerouslySetInnerHTML={{ __html: marked(content as string) as string }}
                    />
                </div>
              )
          )}
          </div>
      </div>
      {isTakingQuiz && isQuiz && (
        <TeacherQuizModal
            quiz={content as ParsedQuiz}
            title={topic || 'Quiz'}
            onClose={() => setIsTakingQuiz(false)}
        />
      )}
    </div>
  );
};