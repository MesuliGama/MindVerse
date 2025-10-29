import React from 'react';
import { Communication } from '../types';
import { XIcon } from './icons/XIcon';
import { MailIcon } from './icons/MailIcon';

interface MessageViewModalProps {
  message: Communication;
  onClose: () => void;
}

export const MessageViewModal: React.FC<MessageViewModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                <MailIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Message from Teacher</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Received on {new Date(message.sentAt).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <p className="text-lg leading-relaxed text-slate-900 dark:text-slate-300 whitespace-pre-wrap">{message.message}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};