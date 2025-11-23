
import { User, TrackedBill, KanbanStatus, SavingsGoal } from '../types';

class ApiService {
  // If VITE_API_BASE_URL is set (e.g. dev), use it. Otherwise empty string means relative path (same origin)
  private baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  private getToken(): string | null {
    return sessionStorage.getItem('jwt');
  }

  private async request(path: string, opts: RequestInit = {}) {
    const headers: Record<string, string> = {};
    if (opts.body) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, { ...opts, headers });
    if (!res.ok) {
      let errMsg = `Request failed: ${res.status}`;
      try {
        const errData = await res.json();
        errMsg = errData.message || JSON.stringify(errData);
      } catch (e) {
        try {
          errMsg = await res.text();
        } catch (e2) { }
      }
      throw new Error(errMsg);
    }

    if (res.status === 204) return null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    return res.text();
  }

  // --- USER & AUTH ---

  async checkSession(): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error('No active session');
    const data = await this.request('/user/me', { method: 'GET' });
    return data as User;
  }

  async register(email: string, password: string): Promise<User> {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { user, token } = data as { user: User; token: string };
    if (token) sessionStorage.setItem('jwt', token);
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { user, token } = data as { user: User; token: string };
    if (token) sessionStorage.setItem('jwt', token);
    return user;
  }

  async socialLogin(provider: 'google'): Promise<User> {
    // The backend expects an OAuth code exchange; frontend should supply the code
    // after an OAuth flow. This method attempts a POST to /auth/google with an
    // (empty) code — callers should replace with a real code when available.
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ code: '' }),
    });
    const { user, token } = data as { user: User; token: string };
    if (token) sessionStorage.setItem('jwt', token);
    return user;
  }

  async logout(): Promise<void> {
    sessionStorage.removeItem('jwt');
  }

  async fetchUserData(_email?: string): Promise<User> {
    // backend exposes GET /user/me for the current authenticated user
    const data = await this.request('/user/me', { method: 'GET' });
    return data as User;
  }

  async updateUser(userToUpdate: User): Promise<User> {
    // Backend does not currently expose a user update endpoint in the contract
    // but attempt a PUT to /user/me to support updates if implemented server-side.
    const data = await this.request('/user/me', {
      method: 'PUT',
      body: JSON.stringify(userToUpdate),
    });
    return data as User;
  }

  // --- DATA MANIPULATION ---

  async addBill(_userEmail: string, bill: Omit<TrackedBill, 'id'>): Promise<TrackedBill> {
    const data = await this.request('/bills', { method: 'POST', body: JSON.stringify(bill) });
    return data as TrackedBill;
  }

  async updateBill(_userEmail: string, updatedBill: TrackedBill): Promise<TrackedBill> {
    const data = await this.request(`/bills/${encodeURIComponent(updatedBill.id)}`, {
      method: 'PUT',
      body: JSON.stringify(updatedBill),
    });
    return data as TrackedBill;
  }

  async deleteBill(_userEmail: string, billId: string): Promise<void> {
    await this.request(`/bills/${encodeURIComponent(billId)}`, { method: 'DELETE' });
    return;
  }

  async addSavingsGoal(_userEmail: string, goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
    const data = await this.request('/savings', { method: 'POST', body: JSON.stringify(goal) });
    return data as SavingsGoal;
  }

  async upgradeToPremium(_userEmail: string): Promise<{ sessionId: string } | null> {
    // Start a Stripe checkout session; backend returns { sessionId }
    const data = await this.request('/billing/create-checkout-session', { method: 'POST' });
    return data as { sessionId: string } | null;
  }
}

export const api = new ApiService();
