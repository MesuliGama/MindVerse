import React, { useState } from 'react';
import { QuizTakingModal } from '../components/QuizTakingModal';
import { StudyGuideViewModal } from '../components/StudyGuideViewModal';
import { MessageViewModal } from '../components/MessageViewModal';
import { StudentAssignment, AssignmentStatus, Submission, User, OutputType, Communication } from '../types';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import { QuestionMarkCircleIcon } from '../components/icons/QuestionMarkCircleIcon';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { MailIcon } from '../components/icons/MailIcon';


interface StudentDashboardProps {
    user: User;
    credits: number;
    onUseCredit: () => void;
    onOpenUpgradeModal: () => void;
    assignments: StudentAssignment[];
    messages: Communication[];
    onSubmitAssignment: (assignmentId: number, submission: Submission) => void;
}

const getAssignmentTypeStyle = (type: OutputType) => {
    switch (type) {
        case OutputType.QUIZ:
            return {
                icon: <QuestionMarkCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
                iconContainer: 'bg-purple-100 dark:bg-purple-900/50',
                badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
            };
        case OutputType.STUDY_GUIDE:
            return {
                icon: <DocumentTextIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
                iconContainer: 'bg-sky-100 dark:bg-sky-900/50',
                badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
            };
        default:
            return {
                icon: <DocumentTextIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
                iconContainer: 'bg-slate-100 dark:bg-slate-700',
                badge: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
            };
    }
};

const NoAssignments: React.FC = () => (
    <div className="text-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-12">
        <ClipboardListIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">All Caught Up!</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You have no pending assignments right now.</p>
    </div>
);

const NoMessages: React.FC = () => (
    <div className="text-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-12">
        <MailIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">Inbox Zero!</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You have no new messages from your teacher.</p>
    </div>
);


export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, credits, onUseCredit, onOpenUpgradeModal, assignments, messages, onSubmitAssignment }) => {
    const [takingQuiz, setTakingQuiz] = useState<StudentAssignment | null>(null);
    const [viewingStudyGuide, setViewingStudyGuide] = useState<StudentAssignment | null>(null);
    const [viewingMessage, setViewingMessage] = useState<Communication | null>(null);

    const isOutOfCredits = !user.isPro && credits <= 0;

    const handleStartAssignment = (assignment: StudentAssignment) => {
        if (isOutOfCredits) {
            onOpenUpgradeModal();
            return;
        }

        onUseCredit();

        if (assignment.type === OutputType.QUIZ) {
            setTakingQuiz(assignment);
        } else if (assignment.type === OutputType.STUDY_GUIDE) {
            setViewingStudyGuide(assignment);
        }
    };

    const handleSubmitQuiz = (answers: (number | null)[]) => {
        if (takingQuiz) {
            const submission: Submission = {
                studentId: 0, // This will be updated in the App component
                answers,
                submittedAt: new Date().toISOString(),
            };
            onSubmitAssignment(takingQuiz.id, submission);
            setTakingQuiz(null);
        }
    };

    const handleCompleteStudyGuide = () => {
        if (viewingStudyGuide) {
            const submission: Submission = {
                studentId: 0, // This will be updated in the App component
                answers: [], // No answers for a study guide
                submittedAt: new Date().toISOString(),
            };
            onSubmitAssignment(viewingStudyGuide.id, submission);
            setViewingStudyGuide(null);
        }
    };
    
    return (
        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {takingQuiz && (
                <QuizTakingModal
                    assignment={takingQuiz}
                    onClose={() => setTakingQuiz(null)}
                    onSubmit={handleSubmitQuiz}
                />
            )}
            {viewingStudyGuide && (
                <StudyGuideViewModal
                    assignment={viewingStudyGuide}
                    onClose={() => setViewingStudyGuide(null)}
                    onComplete={handleCompleteStudyGuide}
                />
            )}
            {viewingMessage && (
                <MessageViewModal
                    message={viewingMessage}
                    onClose={() => setViewingMessage(null)}
                />
            )}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome, {user.name.split(' ')[0]}!</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Here are your assignments. Let's get started.</p>
            
            <div className="space-y-4">
                {assignments.length === 0 ? <NoAssignments /> : assignments.map(assignment => {
                    const { icon, iconContainer, badge } = getAssignmentTypeStyle(assignment.type);
                    const isActionable = assignment.type === OutputType.QUIZ || assignment.type === OutputType.STUDY_GUIDE;

                    return (
                        <div key={assignment.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-shadow hover:shadow-xl">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${iconContainer}`}>
                                    {icon}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{assignment.title}</h3>
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badge}`}>
                                            {assignment.type}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>Due: {assignment.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                                {assignment.status === AssignmentStatus.COMPLETED ? (
                                    <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50 rounded-full">
                                        Completed
                                    </span>
                                ) : (
                                    <>
                                    <span className="px-3 py-1 text-sm font-semibold text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/50 rounded-full">
                                        Pending
                                    </span>
                                    {isActionable && (
                                        <button
                                            onClick={() => handleStartAssignment(assignment)}
                                            disabled={isOutOfCredits}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed disabled:scale-100"
                                        >
                                            {assignment.type === OutputType.QUIZ ? 'Start Quiz' : 'View Guide'}
                                        </button>
                                    )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-4">Messages from your Teacher</h3>

            <div className="space-y-3">
                {messages.length === 0 ? <NoMessages /> : messages.map(message => (
                    <button 
                        key={message.id} 
                        onClick={() => setViewingMessage(message)}
                        className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 text-left transition-shadow hover:shadow-xl"
                    >
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                            <MailIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-slate-800 dark:text-slate-100">Message from Teacher</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(message.sentAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{message.message}</p>
                        </div>
                    </button>
                ))}
            </div>
        </main>
    );
};