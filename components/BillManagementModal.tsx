
import React, { useState, useEffect } from 'react';
import { Category, KanbanStatus, TrackedBill } from '../types';

interface BillManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bill: Omit<TrackedBill, 'id'> | TrackedBill) => void;
  billToEdit?: TrackedBill;
}

const BillManagementModal: React.FC<BillManagementModalProps> = ({ isOpen, onClose, onSave, billToEdit }) => {
  const [category, setCategory] = useState<Category>(Category.Energy);
  const [provider, setProvider] = useState('');
  const [name, setName] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (billToEdit) {
        setCategory(billToEdit.category);
        setProvider(billToEdit.provider);
        setName(billToEdit.name);
        setMonthlyCost(billToEdit.monthlyCost.toString());
        setDueDate(billToEdit.dueDate);
      } else {
        setCategory(Category.Energy);
        setProvider('');
        setName('');
        setMonthlyCost('');
        setDueDate(new Date().toISOString().split('T')[0]);
      }
      setIsClosing(false);
    }
  }, [isOpen, billToEdit]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(monthlyCost);
    if (!provider || !name || isNaN(cost) || cost <= 0 || !dueDate) {
      alert('Please fill in all fields with valid data.');
      return;
    }

    if (billToEdit) {
        const billData: TrackedBill = {
            ...billToEdit,
            category,
            provider,
            name,
            monthlyCost: cost,
            dueDate,
        };
        onSave(billData);
    } else {
        const billData: Omit<TrackedBill, 'id'> = {
            category,
            provider,
            name,
            monthlyCost: cost,
            dueDate,
            status: KanbanStatus.Upcoming,
        };
        onSave(billData);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'modal-backdrop-out' : 'modal-backdrop-in'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-full max-w-lg m-4 text-left border border-white/20 ${isClosing ? 'modal-content-out' : 'modal-content-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="font-display text-2xl font-bold text-navy-heading">{billToEdit ? 'Edit Bill' : 'Add a New Bill'}</h2>
        <p className="text-slate-body mt-2">Enter the details of your bill to start tracking.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-medium text-slate-600 mb-1 block">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full px-4 py-2.5 bg-white border border-slate-300/70 rounded-lg focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue focus:outline-none transition-all duration-200">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="text-sm font-medium text-slate-600 mb-1 block">Due Date</label>
                <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-slate-300/70 rounded-lg focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue focus:outline-none transition-all duration-200" />
              </div>
          </div>
          <div>
            <label htmlFor="provider" className="text-sm font-medium text-slate-600 mb-1 block">Provider</label>
            <input id="provider" type="text" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g., Octopus Energy" required className="w-full px-4 py-2.5 bg-white border border-slate-300/70 rounded-lg focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue focus:outline-none transition-all duration-200" />
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-600 mb-1 block">Plan Name (optional)</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Flexible Octopus" required className="w-full px-4 py-2.5 bg-white border border-slate-300/70 rounded-lg focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue focus:outline-none transition-all duration-200" />
          </div>
          <div>
            <label htmlFor="monthlyCost" className="text-sm font-medium text-slate-600 mb-1 block">Monthly Cost (£)</label>
            <input id="monthlyCost" type="number" step="0.01" min="0" value={monthlyCost} onChange={(e) => setMonthlyCost(e.target.value)} placeholder="e.g., 152.70" required className="w-full px-4 py-2.5 bg-white border border-slate-300/70 rounded-lg focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue focus:outline-none transition-all duration-200" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-gradient px-5 py-2.5 text-sm font-semibold text-white rounded-full">
                {billToEdit ? 'Save Changes' : 'Add Bill'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillManagementModal;
