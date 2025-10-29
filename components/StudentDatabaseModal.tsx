import React from 'react';
import { Student } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';

interface StudentDatabaseModalProps {
  students: Student[];
  onAddStudent: () => void;
  onDeleteStudent: (studentId: number) => void;
  onClose: () => void;
}

export const StudentDatabaseModal: React.FC<StudentDatabaseModalProps> = ({ students, onAddStudent, onDeleteStudent, onClose }) => {
    const handleDelete = (student: Student) => {
        if (window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
            onDeleteStudent(student.id);
        }
    };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                 <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Student Database</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{students.length} student(s) in total</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={onAddStudent}
                    className="flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md"
                >
                    <PlusIcon className="w-4 h-4 mr-1"/> Add New Student
                </button>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3 w-1/4">Student ID</th>
                <th scope="col" className="px-6 py-3">Student Name</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map(student => (
                  <tr key={student.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">#{student.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(student)} className="font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                          <TrashIcon className="w-4 h-4" />
                          <span className="sr-only">Delete student</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={3} className="text-center py-10 text-slate-500 dark:text-slate-400">
                            No students found. Click "Add New Student" to begin.
                        </td>
                    </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
