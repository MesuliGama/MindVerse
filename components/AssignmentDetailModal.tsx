import React, { useState } from 'react';
import { Assignment, Student, Submission } from '../types';
import { StudentSubmissionModal } from './StudentSubmissionModal';
import { XIcon } from './icons/XIcon';

interface AssignmentDetailModalProps {
  assignment: Assignment;
  students: Student[];
  onClose: () => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({ assignment, students, onClose }) => {
  const [viewingSubmission, setViewingSubmission] = useState<{ student: Student; submission: Submission } | null>(null);

  const getStudentById = (id: number) => students.find(s => s.id === id);
  
  const getSubmissionForStudent = (studentId: number) => assignment.submissions.find(sub => sub.studentId === studentId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      {viewingSubmission && (
        <StudentSubmissionModal
          assignment={assignment}
          student={viewingSubmission.student}
          submission={viewingSubmission.submission}
          onClose={() => setViewingSubmission(null)}
        />
      )}
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Assignment Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.title}</p>
          </div>
           <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Student Submissions</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">Student Name</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Score</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {assignment.assignedTo.map(studentId => {
                const student = getStudentById(studentId);
                if (!student) return null;
                const submission = getSubmissionForStudent(studentId);
                return (
                  <tr key={studentId} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                    <td className="px-6 py-4">{submission ? <span className="text-green-600 dark:text-green-400">Submitted</span> : <span className="text-yellow-600 dark:text-yellow-400">Pending</span>}</td>
                    <td className="px-6 py-4">{submission?.score !== undefined ? `${submission.score}%` : 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      {submission && (
                        <button onClick={() => setViewingSubmission({ student, submission })} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
