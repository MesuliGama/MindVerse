import React, { useState } from 'react';
import { GeneratorForm } from '../components/GeneratorForm';
import { ContentDisplay } from '../components/ContentDisplay';
import { AddStudentModal } from '../components/AddStudentModal';
import { AssignmentModal } from '../components/AssignmentModal';
import { AssignmentDetailModal } from '../components/AssignmentDetailModal';
import { StudentDatabaseModal } from '../components/StudentDatabaseModal';
import { CommunicationForm } from '../components/CommunicationForm';
import { generateContent } from '../services/geminiService';
import { FormData, ParsedQuiz, OutputType, GradeLevel, Student, Assignment, Communication, User } from '../types';
import { UserGroupIcon } from '../components/icons/UserGroupIcon';
import { MailIcon } from '../components/icons/MailIcon';

interface TeacherDashboardProps {
    user: User;
    credits: number;
    onUseCredit: () => void;
    onOpenUpgradeModal: () => void;
    onGradeLevelChange: (grade: GradeLevel) => void;
    students: Student[];
    assignments: Assignment[];
    sentCommunications: Communication[];
    onAddStudent: (name: string) => void;
    onDeleteStudent: (studentId: number) => void;
    onAssign: (assignmentData: { assignedTo: number[], dueDate: string, instructions: string }, content: string | ParsedQuiz, formData: FormData) => void;
    onSendCommunication: (data: Omit<Communication, 'id' | 'sentAt' | 'studentId'>) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
    user,
    credits,
    onUseCredit,
    onOpenUpgradeModal,
    onGradeLevelChange,
    students,
    assignments,
    sentCommunications,
    onAddStudent,
    onDeleteStudent,
    onAssign,
    onSendCommunication
}) => {
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<string | ParsedQuiz | null>(null);
    const [outputType, setOutputType] = useState<OutputType | null>(null);
    const [generationTime, setGenerationTime] = useState<number | null>(null);

    const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [isAssignmentModalOpen, setAssignmentModalOpen] = useState(false);
    const [isStudentDbModalOpen, setStudentDbModalOpen] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    const handleSubmit = async (data: FormData) => {
        if (!user.isPro && credits <= 0) {
            onOpenUpgradeModal();
            return;
        }

        setIsLoading(true);
        setError(null);
        setContent(null);
        setGenerationTime(null);
        setFormData(data);
        setOutputType(data.outputType);
        
        const startTime = performance.now();
        try {
            const result = await generateContent(data);
            const endTime = performance.now();
            setGenerationTime(endTime - startTime);
            setContent(result);
            onUseCredit(); // Deduct credit after successful generation
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setGenerationTime(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddStudent = (name: string) => {
        onAddStudent(name);
        setAddStudentModalOpen(false);
    };

    const handleDeleteStudent = (studentId: number) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            onDeleteStudent(studentId);
        }
    };

    const handleAssignCallback = (assignmentData: { assignedTo: number[], dueDate: string, instructions: string }) => {
        if (!content || !formData) return;
        onAssign(assignmentData, content, formData);
        setAssignmentModalOpen(false);
    };

    const handleSendCommunication = (data: Omit<Communication, 'id' | 'sentAt' | 'studentId'>) => {
        onSendCommunication(data);
    };

    const sortedSentCommunications = [...sentCommunications].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    return (
        <div className="min-h-full">
            {isAddStudentModalOpen && <AddStudentModal onClose={() => setAddStudentModalOpen(false)} onAddStudent={handleAddStudent} />}
            {isAssignmentModalOpen && <AssignmentModal students={students} onClose={() => setAssignmentModalOpen(false)} onAssign={handleAssignCallback} />}
            {selectedAssignment && <AssignmentDetailModal assignment={selectedAssignment} students={students} onClose={() => setSelectedAssignment(null)} />}
            {isStudentDbModalOpen && <StudentDatabaseModal students={students} onAddStudent={() => setAddStudentModalOpen(true)} onDeleteStudent={handleDeleteStudent} onClose={() => setStudentDbModalOpen(false)} />}


            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} onGradeLevelChange={onGradeLevelChange} user={user} credits={credits}/>
                    </div>
                    <div className="lg:col-span-2">
                        <ContentDisplay
                            content={content}
                            outputType={outputType}
                            isLoading={isLoading}
                            error={error}
                            onAssign={() => setAssignmentModalOpen(true)}
                            generationTime={generationTime}
                            topic={formData?.topic || null}
                        />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center mb-6"><MailIcon className="w-6 h-6 mr-3 text-indigo-500" /> Student Communication</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CommunicationForm onSend={handleSendCommunication} />
                            <div>
                                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Sent Messages</h4>
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                    {sortedSentCommunications.map(comm => (
                                        <div key={comm.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{comm.recipientName}</p>
                                                <span className={`text-xs ${comm.studentId ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                    {comm.studentId ? 'Delivered' : 'Sent'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{new Date(comm.sentAt).toLocaleString()}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{comm.message}</p>
                                        </div>
                                    ))}
                                    {sentCommunications.length === 0 && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No messages sent yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Students List */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center"><UserGroupIcon className="w-5 h-5 mr-2" /> My Students</h3>
                                <button onClick={() => setStudentDbModalOpen(true)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    Manage Students
                                </button>
                            </div>
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {students.map(student => (
                                    <li key={student.id} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md text-sm text-slate-700 dark:text-slate-300">{student.name}</li>
                                ))}
                                {students.length === 0 && <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">No students added yet.</p>}
                            </ul>
                        </div>
                        {/* Assignments List */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">My Assignments</h3>
                             <ul className="space-y-3 max-h-60 overflow-y-auto">
                                {assignments.map(assignment => (
                                    <li key={assignment.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{assignment.title} <span className="text-xs font-normal bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">{assignment.type}</span></p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Due: {assignment.dueDate}</p>
                                        </div>
                                        <button onClick={() => setSelectedAssignment(assignment)} className="text-sm font-medium text-indigo-600 hover:underline">
                                            View Details
                                        </button>
                                    </li>
                                ))}
                                {assignments.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No assignments created yet.</p>}
                             </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};