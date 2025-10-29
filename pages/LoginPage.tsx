import React, { useState } from 'react';
import { Role } from '../types';

interface LoginPageProps {
    onLogin: (name: string, role: Role) => void;
    onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
    const [name, setName] = useState(''); // For teacher's full name
    const [firstName, setFirstName] = useState(''); // For student's first name
    const [lastName, setLastName] = useState(''); // For student's surname
    const [role, setRole] = useState<Role>(Role.TEACHER);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role === Role.TEACHER) {
            onLogin(name, role);
        } else {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            onLogin(fullName, role);
        }
    };

    const isSubmitDisabled = () => {
        if (role === Role.TEACHER) {
            return !name.trim();
        }
        return !firstName.trim() || !lastName.trim();
    };

    const inputStyles = "mt-1 block w-full rounded-md border-transparent bg-slate-500 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm placeholder-slate-300";
    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md px-4">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">Welcome!</h2>
                    
                    <div>
                        <label htmlFor="role" className={labelStyles}>I am a...</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className={inputStyles}
                        >
                            <option value={Role.TEACHER}>Teacher</option>
                            <option value={Role.STUDENT}>Student</option>
                        </select>
                    </div>

                    {role === Role.TEACHER && (
                         <div>
                            <label htmlFor="name" className={labelStyles}>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputStyles}
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    )}

                    {role === Role.STUDENT && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className={labelStyles}>First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={inputStyles}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className={labelStyles}>Surname</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={inputStyles}
                                    placeholder="Enter surname"
                                    required
                                />
                            </div>
                        </div>
                    )}


                    <div className="flex flex-col space-y-2 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitDisabled()}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-colors"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full inline-flex items-center justify-center px-6 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};
