
import React, { useState } from 'react';
import { SavingsGoal } from '../types';

interface SavingsGoalCardProps {
    goal: SavingsGoal;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 p-6 rounded-2xl transition-all duration-300 hover:bg-slate-700/60 hover:-translate-y-1">
            <h3 className="font-semibold text-white text-lg">{goal.name}</h3>
            <div className="flex justify-between items-baseline mt-2">
                <span className="font-bold text-2xl bg-gradient-to-r from-tech-blue to-emerald-save text-transparent bg-clip-text">£{goal.currentAmount.toLocaleString()}</span>
                <span className="text-sm text-slate-400">of £{goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mt-4">
                <div className="bg-emerald-save h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
                {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
            </div>
        </div>
    );
};

interface SavingsGoalsBoardProps {
    goals: SavingsGoal[];
    onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
}

const SavingsGoalsBoard: React.FC<SavingsGoalsBoardProps> = ({ goals, onAddGoal }) => {
    // This is a placeholder for a proper "Add Goal" modal
    const handleAddGoalClick = () => {
        const name = prompt("Enter goal name:");
        const target = prompt("Enter target amount:");
        if (name && target) {
            onAddGoal({
                name,
                targetAmount: parseFloat(target),
                currentAmount: 0,
                deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year from now
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-white">Savings Goals</h2>
                <button onClick={handleAddGoalClick} className="btn-gradient text-white rounded-full px-5 py-2 text-sm font-semibold">
                    + New Goal
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} />)}
                 {goals.length === 0 && (
                     <div className="md:col-span-2 lg:col-span-3 text-center py-16 px-8 bg-slate-800/50 backdrop-blur-lg border-2 border-dashed border-white/10 rounded-2xl">
                        <h2 className="font-display text-xl font-bold text-white">Start Your First Savings Goal</h2>
                        <p className="mt-2 text-slate-300 max-w-md mx-auto">Click "New Goal" to define what you're saving for, from a new car to your dream holiday.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingsGoalsBoard;
