
import React from 'react';
import { TrackedBill, KanbanStatus } from '../types';

interface KanbanCardProps {
    bill: TrackedBill;
    onEdit: (bill: TrackedBill) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ bill, onEdit }) => (
    <div 
        onClick={() => onEdit(bill)}
        className="bg-white/5 p-4 rounded-xl border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-white">{bill.provider}</p>
                <p className="text-sm text-slate-400">{bill.name}</p>
            </div>
            <p className="font-semibold text-white text-lg">£{bill.monthlyCost.toFixed(2)}</p>
        </div>
        <div className="mt-3 text-xs text-slate-400">
            Due: {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </div>
    </div>
);

interface KanbanColumnProps {
    title: KanbanStatus;
    bills: TrackedBill[];
    onEditBill: (bill: TrackedBill) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, bills, onEditBill }) => {
    const statusColors: Record<KanbanStatus, string> = {
        [KanbanStatus.Upcoming]: 'text-tech-blue',
        [KanbanStatus.Paid]: 'text-emerald-save',
        [KanbanStatus.Overdue]: 'text-red-500',
    };

    return (
        <div className="flex-1 bg-black/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${statusColors[title]}`}>
                {title}
                <span className="text-xs bg-white/10 text-slate-300 rounded-full px-2 py-0.5">{bills.length}</span>
            </h3>
            <div className="space-y-4">
                {bills.map(bill => <KanbanCard key={bill.id} bill={bill} onEdit={onEditBill} />)}
            </div>
        </div>
    );
};


interface KanbanBoardProps {
    bills: TrackedBill[];
    onEditBill: (bill: TrackedBill) => void;
    onAddBill: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ bills, onEditBill, onAddBill }) => {
    
    const upcomingBills = bills.filter(b => b.status === KanbanStatus.Upcoming);
    const paidBills = bills.filter(b => b.status === KanbanStatus.Paid);
    const overdueBills = bills.filter(b => b.status === KanbanStatus.Overdue);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-white">Bills Workflow</h2>
                <button onClick={onAddBill} className="btn-gradient text-white rounded-full px-5 py-2 text-sm font-semibold">
                    + Add Bill
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn title={KanbanStatus.Upcoming} bills={upcomingBills} onEditBill={onEditBill} />
                <KanbanColumn title={KanbanStatus.Paid} bills={paidBills} onEditBill={onEditBill} />
                <KanbanColumn title={KanbanStatus.Overdue} bills={overdueBills} onEditBill={onEditBill} />
            </div>
        </div>
    );
};

export default KanbanBoard;
