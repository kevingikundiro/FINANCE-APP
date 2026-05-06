const App = {
    USERS_KEY: 'users',
    SESSION_KEY: 'userSession',
    REMEMBER_EMAIL_KEY: 'rememberEmail',

    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },

    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },

    getSession() {
        return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
    },

    setSession(session) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    },

    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    isAuthenticated() {
        return !!this.getSession();
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    },

    redirectIfAuth() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    },

    getRememberEmail() {
        return localStorage.getItem(this.REMEMBER_EMAIL_KEY) || '';
    },

    setRememberEmail(email) {
        localStorage.setItem(this.REMEMBER_EMAIL_KEY, email);
    },

    removeRememberEmail() {
        localStorage.removeItem(this.REMEMBER_EMAIL_KEY);
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(() => console.log('Service worker registered'))
                .catch(() => console.warn('Service worker registration failed'));
        }
    },

    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        return this.getUsers().find(user => user.email === session.email) || null;
    },

    createUser({ firstName, lastName, email, password }) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }
};