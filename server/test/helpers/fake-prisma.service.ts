import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class FakePrismaService {
  users = new Map<string, any>();
  trackedBills = new Map<string, any>();
  savingsGoals = new Map<string, any>();
  plaidAccounts = new Map<string, any>();

  // user methods
  user = {
    findUnique: async ({ where: { id, email } }: any) => {
      if (id) return this.users.get(id) || null;
      if (email) return Array.from(this.users.values()).find((u) => u.email === email) || null;
      return null;
    },
    create: async ({ data }: any) => {
      const id = data.id || randomUUID();
      const user = { id, ...data };
      this.users.set(id, user);
      return user;
    },
    update: async ({ where: { id }, data }: any) => {
      const user = this.users.get(id);
      if (!user) throw new Error('User not found');
      const updated = { ...user, ...data };
      this.users.set(id, updated);
      return updated;
    },
  };

  // trackedBill methods
  trackedBill = {
    create: async ({ data }: any) => {
      const id = randomUUID();
      const bill = { id, ...data };
      this.trackedBills.set(id, bill);
      return bill;
    },
    findUnique: async ({ where: { id } }: any) => {
      return this.trackedBills.get(id) || null;
    },
    update: async ({ where: { id }, data }: any) => {
      const bill = this.trackedBills.get(id);
      if (!bill) throw new Error('Bill not found');
      const updated = { ...bill, ...data };
      this.trackedBills.set(id, updated);
      return updated;
    },
    delete: async ({ where: { id } }: any) => {
      const bill = this.trackedBills.get(id);
      if (!bill) throw new Error('Bill not found');
      this.trackedBills.delete(id);
      return bill;
    },
    findMany: async ({ where: { userId } }: any) => {
      return Array.from(this.trackedBills.values()).filter((b) => b.userId === userId);
    },
  };

  // savingsGoal methods
  savingsGoal = {
    create: async ({ data }: any) => {
      const id = randomUUID();
      const sg = { id, ...data };
      this.savingsGoals.set(id, sg);
      return sg;
    },
    findMany: async ({ where: { userId } }: any) => {
      return Array.from(this.savingsGoals.values()).filter((s) => s.userId === userId);
    },
    findUnique: async ({ where: { id } }: any) => {
      return this.savingsGoals.get(id) || null;
    },
    update: async ({ where: { id }, data }: any) => {
      const sg = this.savingsGoals.get(id);
      if (!sg) throw new Error('SavingsGoal not found');
      const updated = { ...sg, ...data };
      this.savingsGoals.set(id, updated);
      return updated;
    },
    delete: async ({ where: { id } }: any) => {
      const sg = this.savingsGoals.get(id);
      if (!sg) throw new Error('SavingsGoal not found');
      this.savingsGoals.delete(id);
      return sg;
    },
  };

  // plaidAccount methods
  plaidAccount = {
    create: async ({ data }: any) => {
      const id = randomUUID();
      const acct = { id, ...data };
      this.plaidAccounts.set(id, acct);
      return acct;
    },
    findMany: async ({ where: { userId } }: any) => {
      return Array.from(this.plaidAccounts.values()).filter((p) => p.userId === userId);
    },
  };

  // transaction helpers for tests
  reset() {
    this.users.clear();
    this.trackedBills.clear();
    this.savingsGoals.clear();
    this.plaidAccounts.clear();
  }
}
