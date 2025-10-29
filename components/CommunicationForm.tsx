import React, { useState } from 'react';
import { Communication } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';

interface CommunicationFormProps {
  onSend: (data: Omit<Communication, 'id' | 'sentAt' | 'studentId'>) => void;
}

export const CommunicationForm: React.FC<CommunicationFormProps> = ({ onSend }) => {
  const [recipientName, setRecipientName] = useState('');
  const [recipientGrade, setRecipientGrade] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientName && message) {
      onSend({
        recipientName,
        recipientGrade,
        recipientEmail,
        message,
      });
      // Reset form
      setRecipientName('');
      setRecipientGrade('');
      setRecipientEmail('');
      setMessage('');
    }
  };

  const isFormInvalid = !recipientName.trim() || !message.trim();
  const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300";
  const inputStyles = "mt-1 block w-full rounded-md border-transparent bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="recipientName" className={labelStyles}>Name and Surname</label>
        <input 
          type="text" 
          id="recipientName" 
          value={recipientName} 
          onChange={(e) => setRecipientName(e.target.value)} 
          className={inputStyles} 
          placeholder="e.g., Alice Johnson"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="recipientGrade" className={labelStyles}>Grade</label>
          <input 
            type="text" 
            id="recipientGrade" 
            value={recipientGrade} 
            onChange={(e) => setRecipientGrade(e.target.value)} 
            className={inputStyles}
            placeholder="e.g., Grade 7"
          />
        </div>
        <div>
          <label htmlFor="recipientEmail" className={labelStyles}>Email Address</label>
          <input 
            type="email" 
            id="recipientEmail" 
            value={recipientEmail} 
            onChange={(e) => setRecipientEmail(e.target.value)} 
            className={inputStyles}
            placeholder="e.g., alice@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={labelStyles}>Information Details</label>
        <textarea 
          id="message" 
          rows={5} 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className={inputStyles}
          placeholder="Write your message to the student here..."
          required
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isFormInvalid}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5 mr-2 -ml-1" />
          Send Message
        </button>
      </div>
    </form>
  );
};