import { User } from '../types';

const USERS_KEY = 'medflow_users';
const CURRENT_USER_KEY = 'medflow_current_user';

export const authService = {
  async login(username: string, password: string): Promise<User | null> {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  async register(username: string, password: string): Promise<User | null> {
    const users = this.getUsers();
    
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return newUser;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getUsers(): User[] {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }
};