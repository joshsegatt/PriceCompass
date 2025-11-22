
import { User, TrackedBill, KanbanStatus, SavingsGoal } from '../types';

const NETWORK_LATENCY = 500; // ms

class ApiService {
  
  // --- USER & AUTH ---

  async checkSession(): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionEmail = sessionStorage.getItem('priceCompassSession');
        if (!sessionEmail) {
          return reject(new Error('No active session'));
        }
        const users = this._getUsers();
        const user = users.find(u => u.email === sessionEmail);
        if (user) {
          resolve(this._runBillStatusAI(user));
        } else {
          reject(new Error('Session user not found'));
        }
      }, NETWORK_LATENCY / 2);
    });
  }

  async register(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this._getUsers();
        if (users.some(u => u.email === email)) {
          return reject(new Error('An account with this email already exists.'));
        }
        const newUser: User = { email, password, isPremium: false, trackedBills: [], savingsGoals: [] };
        const updatedUsers = [...users, newUser];
        this._saveUsers(updatedUsers);
        sessionStorage.setItem('priceCompassSession', newUser.email);
        resolve(newUser);
      }, NETWORK_LATENCY);
    });
  }

  async login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this._getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          sessionStorage.setItem('priceCompassSession', user.email);
          resolve(this._runBillStatusAI(user));
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, NETWORK_LATENCY);
    });
  }

  async socialLogin(provider: 'google'): Promise<User> {
     return new Promise((resolve) => {
      setTimeout(() => {
        const socialEmail = 'google-user@example.com';
        let users = this._getUsers();
        let user = users.find(u => u.email === socialEmail);
        if (!user) {
          user = { email: socialEmail, isPremium: false, trackedBills: [], savingsGoals: [] };
          users.push(user);
          this._saveUsers(users);
        }
        sessionStorage.setItem('priceCompassSession', user.email);
        resolve(this._runBillStatusAI(user));
      }, NETWORK_LATENCY * 2);
    });
  }
  
  async logout(): Promise<void> {
    return new Promise(resolve => {
        sessionStorage.removeItem('priceCompassSession');
        resolve();
    });
  }

  async fetchUserData(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = this._getUsers();
            const user = users.find(u => u.email === email);
            if (user) {
                resolve(this._runBillStatusAI(user));
            } else {
                reject(new Error("User not found during data fetch."));
            }
        }, NETWORK_LATENCY / 2);
    });
  }
  
  async updateUser(userToUpdate: User): Promise<User> {
      return new Promise((resolve) => {
          setTimeout(() => {
              const users = this._getUsers();
              const updatedUsers = users.map(u => u.email === userToUpdate.email ? userToUpdate : u);
              this._saveUsers(updatedUsers);
              resolve(userToUpdate);
          }, NETWORK_LATENCY / 3);
      });
  }

  // --- DATA MANIPULATION ---

  async addBill(userEmail: string, bill: Omit<TrackedBill, 'id'>): Promise<TrackedBill> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBill = { ...bill, id: new Date().toISOString() };
        const users = this._getUsers();
        const updatedUsers = users.map(u => {
          if (u.email === userEmail) {
            return { ...u, trackedBills: [...u.trackedBills, newBill] };
          }
          return u;
        });
        this._saveUsers(updatedUsers);
        resolve(newBill);
      }, NETWORK_LATENCY);
    });
  }

  async updateBill(userEmail: string, updatedBill: TrackedBill): Promise<TrackedBill> {
     return new Promise((resolve) => {
        setTimeout(() => {
            const users = this._getUsers();
            const updatedUsers = users.map(u => {
                if (u.email === userEmail) {
                    const bills = u.trackedBills.map(b => b.id === updatedBill.id ? updatedBill : b);
                    return { ...u, trackedBills: bills };
                }
                return u;
            });
            this._saveUsers(updatedUsers);
            resolve(updatedBill);
        }, NETWORK_LATENCY);
    });
  }

  async deleteBill(userEmail: string, billId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this._getUsers();
        const updatedUsers = users.map(u => {
          if (u.email === userEmail) {
            const bills = u.trackedBills.filter(b => b.id !== billId);
            return { ...u, trackedBills: bills };
          }
          return u;
        });
        this._saveUsers(updatedUsers);
        resolve();
      }, NETWORK_LATENCY);
    });
  }
  
  async addSavingsGoal(userEmail: string, goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
     return new Promise((resolve) => {
      setTimeout(() => {
        const newGoal = { ...goal, id: new Date().toISOString() };
        const users = this._getUsers();
        const updatedUsers = users.map(u => {
          if (u.email === userEmail) {
            return { ...u, savingsGoals: [...(u.savingsGoals || []), newGoal] };
          }
          return u;
        });
        this._saveUsers(updatedUsers);
        resolve(newGoal);
      }, NETWORK_LATENCY);
    });
  }

  async upgradeToPremium(userEmail: string): Promise<User> {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            const users = this._getUsers();
            let updatedUser: User | null = null;
            const updatedUsers = users.map(u => {
                if(u.email === userEmail) {
                    updatedUser = { ...u, isPremium: true };
                    return updatedUser;
                }
                return u;
            });
            this._saveUsers(updatedUsers);
            if (updatedUser) {
                resolve(updatedUser);
            } else {
                reject(new Error("User not found for premium upgrade."));
            }
          }, NETWORK_LATENCY);
      });
  }

  // --- PRIVATE HELPERS ---

  private _getUsers(): User[] {
    try {
      const savedUsersJSON = localStorage.getItem('priceCompassUsersDB');
      return savedUsersJSON ? JSON.parse(savedUsersJSON) : [];
    } catch {
      return [];
    }
  }

  private _saveUsers(users: User[]) {
    localStorage.setItem('priceCompassUsersDB', JSON.stringify(users));
  }
  
  private _runBillStatusAI(user: User): User {
      const today = new Date();
      today.setHours(0,0,0,0);
      const updatedBills = user.trackedBills.map(bill => {
          if(bill.status === KanbanStatus.Paid) return bill;
          const dueDate = new Date(bill.dueDate);
          if (dueDate < today) {
              return {...bill, status: KanbanStatus.Overdue};
          }
          return bill;
      });
      return {...user, trackedBills: updatedBills};
  }
}

export const api = new ApiService();
