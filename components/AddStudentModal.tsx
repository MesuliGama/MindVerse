import React, { useState } from 'react';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (name: string) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddStudent(name.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md m-4 border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add New Student</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-transparent bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Enter student's full name"
                required
              />
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
