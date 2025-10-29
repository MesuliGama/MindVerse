import React from 'react';
import { marked } from 'marked';
import { StudentAssignment } from '../types';
import { XIcon } from './icons/XIcon';

interface StudyGuideViewModalProps {
  assignment: StudentAssignment;
  onClose: () => void;
  onComplete: () => void;
}

export const StudyGuideViewModal: React.FC<StudyGuideViewModalProps> = ({ assignment, onClose, onComplete }) => {
  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
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

        <div className="flex-grow overflow-y-auto p-6">
            <div 
                className="prose prose-lg dark:prose-invert max-w-none text-slate-900 dark:text-slate-300
                           prose-a:text-indigo-600 hover:prose-a:text-indigo-700 
                           dark:prose-a:text-indigo-400 dark:hover:prose-a:text-indigo-300
                           prose-blockquote:border-l-indigo-500
                           prose-ul:marker:text-indigo-600 dark:prose-ul:marker:text-indigo-400
                           prose-ol:marker:text-indigo-600 dark:prose-ol:marker:text-indigo-400"
                dangerouslySetInnerHTML={{ __html: marked(assignment.content as string) as string }} 
            />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleComplete}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  );
};