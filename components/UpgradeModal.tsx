import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
      number: '',
      expiry: '',
      cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCardDetails(prev => ({...prev, [name]: value}));
  };

  const canSubmit = cardDetails.number.length >= 16 && cardDetails.expiry.length >= 4 && cardDetails.cvc.length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsProcessing(true);
    // Simulate API call for payment
    setTimeout(() => {
        onUpgrade();
        setIsProcessing(false);
        onClose();
    }, 2000);
  };

  const labelStyles = "block text-xs font-medium text-slate-600 dark:text-slate-400";
  const inputStyles = "mt-1 block w-full rounded-md border-transparent bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";


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
            <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 -mt-12 mb-4 shadow-lg">
                    <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Upgrade to MindVerse Pro</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    You've used all your free credits. Upgrade to unlock unlimited generations.
                </p>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
                <div className="space-y-4">
                     <div>
                        <label htmlFor="cardNumber" className={labelStyles}>Card Number</label>
                        <input type="text" id="cardNumber" name="number" value={cardDetails.number} onChange={handleInputChange} className={inputStyles} placeholder="0000 0000 0000 0000" maxLength={16} required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="cardExpiry" className={labelStyles}>Expiry (MM/YY)</label>
                            <input type="text" id="cardExpiry" name="expiry" value={cardDetails.expiry} onChange={handleInputChange} className={inputStyles} placeholder="MM/YY" maxLength={5} required />
                        </div>
                         <div>
                            <label htmlFor="cardCvc" className={labelStyles}>CVC</label>
                            <input type="text" id="cardCvc" name="cvc" value={cardDetails.cvc} onChange={handleInputChange} className={inputStyles} placeholder="123" maxLength={3} required />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-4 flex flex-col space-y-2">
                <button
                    type="submit"
                    disabled={!canSubmit || isProcessing}
                    className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <SpinnerIcon className="w-5 h-5 mr-3 -ml-1" />
                            Processing...
                        </>
                    ) : (
                        `Pay R250.00 and Upgrade`
                    )}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Maybe Later
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};