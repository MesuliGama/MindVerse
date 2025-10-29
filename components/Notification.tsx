import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface NotificationProps {
  message: string | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-white dark:bg-slate-800 shadow-lg rounded-xl pointer-events-auto ring-1 ring-slate-900/10 dark:ring-slate-50/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="ml-4 w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Success</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="bg-transparent rounded-md inline-flex text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
