import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { UpgradeModal } from './components/UpgradeModal';
import { Role, User, StudentAssignment, AssignmentStatus, Submission, ParsedQuiz, OutputType, Student, GradeLevel, Assignment, Communication, FormData } from './types';

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
    }
    return defaultValue;
};

const getThemeForGrade = (grade: GradeLevel): string => {
    const foundation = [GradeLevel.GRADE_R, GradeLevel.GRADE_1, GradeLevel.GRADE_2, GradeLevel.GRADE_3];
    const intermediate = [GradeLevel.GRADE_4, GradeLevel.GRADE_5, GradeLevel.GRADE_6, GradeLevel.GRADE_7];
    const seniorFET = [GradeLevel.GRADE_8, GradeLevel.GRADE_9, GradeLevel.GRADE_10, GradeLevel.GRADE_11, GradeLevel.GRADE_12];

    if (foundation.includes(grade)) return 'bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200 dark:from-amber-900/50 dark:via-orange-900/50 dark:to-rose-900/50';
    if (intermediate.includes(grade)) return 'bg-gradient-to-br from-purple-100 via-indigo-200 to-sky-200 dark:from-purple-900/50 dark:via-indigo-900/50 dark:to-sky-900/50';
    if (seniorFET.includes(grade)) return 'bg-gradient-to-br from-teal-100 via-cyan-200 to-blue-200 dark:from-teal-900/50 dark:via-cyan-900/50 dark:to-blue-900/50';
    
    return 'bg-slate-50 dark:bg-slate-900';
}

interface UserCreditInfo {
    credits: number;
    lastCreditReset: number;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [page, setPage] = useState<'landing' | 'login' | 'dashboard'>('landing');
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
        }
        return 'light';
    });
    
    const [gradeTheme, setGradeTheme] = useState<string>('bg-slate-50 dark:bg-slate-900');
    
    const [students, setStudents] = useState<Student[]>(() => getInitialState<Student[]>('students', []));
    const [assignments, setAssignments] = useState<Assignment[]>(() => getInitialState<Assignment[]>('assignments', []));
    const [communications, setCommunications] = useState<Communication[]>(() => getInitialState<Communication[]>('communications', []));
    const [userCredits, setUserCredits] = useState<Record<string, UserCreditInfo>>(() => getInitialState('userCredits', {}));
    const [proUsers, setProUsers] = useState<string[]>(() => getInitialState('proUsers', []));
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => { localStorage.setItem('students', JSON.stringify(students)); }, [students]);
    useEffect(() => { localStorage.setItem('assignments', JSON.stringify(assignments)); }, [assignments]);
    useEffect(() => { localStorage.setItem('communications', JSON.stringify(communications)); }, [communications]);
    useEffect(() => { localStorage.setItem('userCredits', JSON.stringify(userCredits)); }, [userCredits]);
    useEffect(() => { localStorage.setItem('proUsers', JSON.stringify(proUsers)); }, [proUsers]);
    
    const handleLogin = (name: string, role: Role) => {
        let loggedInUserName: string | null = null;
        if (role === Role.STUDENT) {
            const studentUser = students.find(s => s.name.toLowerCase() === name.toLowerCase());
            if (studentUser) {
                loggedInUserName = studentUser.name;
            } else {
                alert(`Student "${name}" not found. Please check the name and try again.`);
                return;
            }
        } else {
            loggedInUserName = name;
        }

        if (loggedInUserName) {
            const userKey = `${role}-${loggedInUserName}`;
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            
            const currentUserCreditInfo = userCredits[userKey];
            
            if (!currentUserCreditInfo || (now - currentUserCreditInfo.lastCreditReset > oneDay)) {
                setUserCredits(prev => ({
                    ...prev,
                    [userKey]: { credits: 5, lastCreditReset: now }
                }));
            }
            
            const isPro = proUsers.includes(userKey);
            setUser({ name: loggedInUserName, role, isPro });
            setPage('dashboard');
        }
    };
    
    const handleUpgradeToPro = () => {
        if (!user) return;
        const userKey = `${user.role}-${user.name}`;
        if (!proUsers.includes(userKey)) {
            setProUsers(prev => [...prev, userKey]);
        }
        setUser(prev => prev ? { ...prev, isPro: true } : null);
        setUpgradeModalOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
        setPage('landing');
        setGradeTheme('bg-slate-50 dark:bg-slate-900');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    
    const handleGradeLevelChange = (grade: GradeLevel) => {
        setGradeTheme(getThemeForGrade(grade));
    };

    const handleAddStudent = (name: string) => {
        const newStudent: Student = {
            id: Math.max(0, ...students.map(s => s.id)) + 1,
            name,
        };
        setStudents(prev => [...prev, newStudent]);
    };

    const handleDeleteStudent = (studentId: number) => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setAssignments(prev => prev.map(a => ({
            ...a,
            submissions: a.submissions.filter(sub => sub.studentId !== studentId)
        })));
    };

    const handleAssign = (assignmentData: { assignedTo: number[], dueDate: string, instructions: string }, content: string | ParsedQuiz, formData: FormData) => {
        const newAssignment: Assignment = {
            id: Math.max(0, ...assignments.map(a => a.id)) + 1,
            title: formData.topic,
            type: formData.outputType,
            content: content,
            dueDate: assignmentData.dueDate,
            instructions: assignmentData.instructions,
            assignedTo: assignmentData.assignedTo,
            submissions: [],
        };
        setAssignments(prev => [newAssignment, ...prev]);
    };

    const handleSendCommunication = (data: Omit<Communication, 'id' | 'sentAt' | 'studentId'>) => {
        const student = students.find(s => s.name.toLowerCase() === data.recipientName.toLowerCase());
        const newCommunication: Communication = {
            ...data,
            id: Date.now(),
            sentAt: new Date().toISOString(),
            studentId: student?.id,
        };
        setCommunications(prev => [newCommunication, ...prev]);
    };

    const handleSubmitAssignment = (assignmentId: number, submission: Submission) => {
        setAssignments(prevAssignments =>
            prevAssignments.map(a => {
                if (a.id === assignmentId) {
                    let score;
                    if (a.type === OutputType.QUIZ) {
                        const quizContent = a.content as ParsedQuiz;
                        const correctAnswers = quizContent.reduce((count, question, index) => {
                            return count + (question.correctAnswerIndex === submission.answers[index] ? 1 : 0);
                        }, 0);
                        score = Math.round((correctAnswers / quizContent.length) * 100);
                    }

                    const student = students.find(s => s.name === user?.name);
                    const newSubmission = { ...submission, studentId: student?.id, score };
                    return { ...a, submissions: [...a.submissions, newSubmission] };
                }
                return a;
            })
        );
    };

    const getStudentAssignments = (): StudentAssignment[] => {
        const currentStudent = students.find(s => s.name === user?.name);
        if (!currentStudent) return [];

        const studentId = currentStudent.id;
        return assignments
            .filter(a => a.assignedTo.includes(studentId))
            .map(a => {
                const submission = a.submissions.find((s: Submission) => s.studentId === studentId);
                return {
                    id: a.id,
                    title: a.title,
                    type: a.type,
                    content: a.content,
                    dueDate: a.dueDate,
                    instructions: a.instructions,
                    status: submission ? AssignmentStatus.COMPLETED : AssignmentStatus.PENDING,
                    submission,
                };
            });
    };

    const getStudentCommunications = (): Communication[] => {
        const currentStudent = students.find(s => s.name === user?.name);
        if (!currentStudent) return [];
        return communications.filter(c => c.studentId === currentStudent.id).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    };

    const handleUseCredit = () => {
        if (user && !user.isPro) {
            const userKey = `${user.role}-${user.name}`;
            setUserCredits(prev => {
                const currentUserCreditInfo = prev[userKey];
                if (currentUserCreditInfo) {
                    return {
                        ...prev,
                        [userKey]: {
                            ...currentUserCreditInfo,
                            credits: Math.max(0, currentUserCreditInfo.credits - 1)
                        }
                    };
                }
                return prev;
            });
        }
    };

    const renderContent = () => {
        if (page === 'landing') {
            return <LandingPage onGetStarted={() => setPage('login')} />;
        }
        if (page === 'login') {
            return <LoginPage onLogin={handleLogin} onBack={() => setPage('landing')} />;
        }
        if (page === 'dashboard' && user) {
            const userKey = `${user.role}-${user.name}`;
            const currentCredits = userCredits[userKey]?.credits ?? 0;

            if (user.role === Role.TEACHER) {
                return <TeacherDashboard 
                    user={user}
                    credits={currentCredits}
                    onUseCredit={handleUseCredit}
                    onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
                    onGradeLevelChange={handleGradeLevelChange}
                    students={students}
                    assignments={assignments}
                    onAddStudent={handleAddStudent}
                    onDeleteStudent={handleDeleteStudent}
                    onAssign={handleAssign}
                    sentCommunications={communications}
                    onSendCommunication={handleSendCommunication}
                />;
            }
            if (user.role === Role.STUDENT) {
                return <StudentDashboard 
                    user={user} 
                    credits={currentCredits}
                    onUseCredit={handleUseCredit}
                    onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
                    assignments={getStudentAssignments()}
                    messages={getStudentCommunications()}
                    onSubmitAssignment={handleSubmitAssignment}
                />;
            }
        }
        return <LandingPage onGetStarted={() => setPage('login')} />;
    };

    const userKey = user ? `${user.role}-${user.name}` : '';
    const currentCredits = userCredits[userKey]?.credits ?? 0;

    return (
        <div className={`${gradeTheme} min-h-screen transition-colors duration-500`}>
            <Header 
                user={user} 
                credits={currentCredits} 
                onLogout={handleLogout} 
                theme={theme} 
                toggleTheme={toggleTheme} 
                onUpgradeClick={() => setUpgradeModalOpen(true)}
            />
            {isUpgradeModalOpen && <UpgradeModal onClose={() => setUpgradeModalOpen(false)} onUpgrade={handleUpgradeToPro} />}
            {renderContent()}
        </div>
    );
};

export default App;