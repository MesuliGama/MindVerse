import React, { useState, useEffect } from 'react';
import { GradeLevel, Subject, Language, OutputType, FormData, User } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface GeneratorFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  onGradeLevelChange: (gradeLevel: GradeLevel) => void;
  user: User | null;
  credits: number;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, isLoading, onGradeLevelChange, user, credits }) => {
  const [formData, setFormData] = useState<FormData>({
    gradeLevel: GradeLevel.GRADE_7,
    subject: Subject.NATURAL_SCIENCES,
    topic: '',
    outputType: OutputType.LESSON_PLAN,
    duration: 45,
    numQuestions: 5,
    language: Language.ENGLISH,
    assignmentType: '',
  });

  const isOutOfCredits = !user?.isPro && credits <= 0;

  useEffect(() => {
    onGradeLevelChange(formData.gradeLevel);
  }, [formData.gradeLevel, onGradeLevelChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev, [name]: name === 'duration' || name === 'numQuestions' ? parseInt(value, 10) : value };
        
        if (name === 'outputType') {
            const newOutputType = value as OutputType;
            if (newOutputType === OutputType.LESSON_PLAN) {
                newState.duration = 45;
            } else if (newOutputType === OutputType.PROJECT_IDEA) {
                newState.duration = 7;
            }
        }
        
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300";
  const inputStyles = "mt-1 block w-full rounded-md border-transparent bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Content Generator</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tell us what you need, and we'll create it for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="gradeLevel" className={labelStyles}>Grade Level</label>
          <select id="gradeLevel" name="gradeLevel" value={formData.gradeLevel} onChange={handleInputChange} className={inputStyles}>
            {/* FIX: Add explicit type to map parameter to resolve potential type inference issues. */}
            {Object.values(GradeLevel).map((level: string) => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subject" className={labelStyles}>Subject</label>
          <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className={inputStyles}>
            {/* FIX: Add explicit type to map parameter to resolve potential type inference issues. */}
            {Object.values(Subject).map((subject: string) => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="topic" className={labelStyles}>Topic</label>
        <input type="text" id="topic" name="topic" value={formData.topic} onChange={handleInputChange} className={inputStyles} placeholder="e.g., Photosynthesis" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="outputType" className={labelStyles}>Output Type</label>
          <select id="outputType" name="outputType" value={formData.outputType} onChange={handleInputChange} className={inputStyles}>
            {/* FIX: Add explicit type to map parameter to resolve potential type inference issues. */}
            {Object.values(OutputType).map((type: string) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="language" className={labelStyles}>Language</label>
          <select id="language" name="language" value={formData.language} onChange={handleInputChange} className={inputStyles}>
            {/* FIX: Add explicit type to map parameter to resolve potential type inference issues. */}
            {Object.values(Language).map((lang: string) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
      </div>

      {(formData.outputType === OutputType.LESSON_PLAN || formData.outputType === OutputType.PROJECT_IDEA) && (
        <div>
          <label htmlFor="duration" className={labelStyles}>
            {formData.outputType === OutputType.LESSON_PLAN ? 'Lesson Duration (minutes)' : 'Project Duration (days)'}
          </label>
          <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} className={inputStyles} min="1" />
        </div>
      )}

      {formData.outputType === OutputType.QUIZ && (
        <div>
          <label htmlFor="numQuestions" className={labelStyles}>Number of Questions</label>
          <input type="number" id="numQuestions" name="numQuestions" value={formData.numQuestions} onChange={handleInputChange} className={inputStyles} min="1" max="20"/>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading || !formData.topic.trim() || isOutOfCredits}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-5 h-5 mr-3 -ml-1" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
              Generate Content
            </>
          )}
        </button>
        {isOutOfCredits && (
             <p className="text-xs text-center text-amber-600 dark:text-amber-400 mt-2">
                You've used all your free credits. Wait for them to reset or upgrade to Pro.
            </p>
        )}
      </div>
    </form>
  );
};