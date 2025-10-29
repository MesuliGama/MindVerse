import React, { useState } from 'react';
import { Student } from '../types';
import { UserGroupIcon } from './icons/UserGroupIcon';

interface AssignmentModalProps {
  students: Student[];
  onClose: () => void;
  onAssign: (data: { assignedTo: number[], dueDate: string, instructions: string }) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ students, onClose, onAssign }) => {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length > 0 && dueDate) {
      onAssign({
        assignedTo: selectedStudents,
        dueDate,
        instructions,
      });
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const labelStyles = "block text-sm font-bold text-slate-700 dark:text-slate-200";
  const inputStyles = "mt-1 block w-full rounded-md border-transparent bg-slate-500 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm placeholder-slate-300";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg m-4 border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Assign Content</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <label className={labelStyles}>Select Students</label>
              <div className="mt-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-lg p-2 space-y-1">
                 <label className="flex items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={students.length > 0 && selectedStudents.length === students.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Select All</span>
                  </label>
                  <hr className="border-slate-200 dark:border-slate-600"/>
                {students.map(student => (
                  <label key={student.id} className="flex items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className={labelStyles}>Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={today}
                required
                className={`${inputStyles} [color-scheme:dark]`}
              />
            </div>

            <div>
              <label htmlFor="instructions" className={labelStyles}>Instructions (Optional)</label>
              <textarea
                id="instructions"
                rows={3}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g., Please complete this quiz by the due date."
                className={inputStyles}
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
              disabled={selectedStudents.length === 0 || !dueDate}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};