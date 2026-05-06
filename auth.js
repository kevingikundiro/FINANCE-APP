document.addEventListener('DOMContentLoaded', () => {
    const page = getPageName();

    if (page === 'login.html' || page === '') {
        App.redirectIfAuth();
        initLogin();
    }

    if (page === 'register.html') {
        App.redirectIfAuth();
        initRegister();
    }

    if (page === 'forgot-password.html') {
        App.redirectIfAuth();
        initForgotPassword();
    }
});

function getPageName() {
    const parts = window.location.pathname.split('/');
    const file = parts.pop() || parts.pop();
    return file.toLowerCase();
}

function togglePassword(buttonId, inputId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!button || !input) return;

    button.addEventListener('click', () => {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        button.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
}

function checkPasswordRequirements(password) {
    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    toggleRequirement('reqLength', rules.length);
    toggleRequirement('reqUppercase', rules.uppercase);
    toggleRequirement('reqNumber', rules.number);
    toggleRequirement('reqSpecial', rules.special);

    return Object.values(rules).every(Boolean);
}

function toggleRequirement(id, isMet) {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.toggle('met', isMet);
    element.querySelector('i').className = isMet ? 'fas fa-check-circle' : 'fas fa-times-circle';
}

function showError(id, message) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
}

function showAlert(message, type = 'danger') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    alertBox.innerHTML = message;
    alertBox.className = `alert alert-${type} show`;
}

function setButtonLoading(button, loading, text) {
    if (!button) return;
    if (loading) {
        button.classList.add('loading');
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    } else {
        button.classList.remove('loading');
        button.innerHTML = text;
    }
}

function initLogin() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberInput = document.getElementById('remember');
    const loginBtn = document.getElementById('loginBtn');

    emailInput.value = App.getRememberEmail();
    rememberInput.checked = !!emailInput.value;
    togglePassword('passwordToggle', 'password');

    form.addEventListener('submit', event => {
        event.preventDefault();
        clearErrors();
        showAlert('', '');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let hasError = false;

        if (!email) {
            showError('emailError', 'Email is required');
            emailInput.classList.add('error');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError('emailError', 'Enter a valid email');
            emailInput.classList.add('error');
            hasError = true;
        }

        if (!password) {
            showError('passwordError', 'Password is required');
            passwordInput.classList.add('error');
            hasError = true;
        }

        if (hasError) return;

        const existingUser = App.getUsers().find(user => user.email === email);
        if (!existingUser) {
            showAlert('No account found with this email. <a href="register.html">Register now</a>.', 'danger');
            return;
        }

        if (existingUser.password !== password) {
            showAlert('Incorrect password. Please try again.', 'danger');
            return;
        }

        App.setSession({
            userId: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            loginTime: new Date().toISOString()
        });

        if (rememberInput.checked) {
            App.setRememberEmail(email);
        } else {
            App.removeRememberEmail();
        }

        setButtonLoading(loginBtn, true, 'Logging in...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    });
}

function initRegister() {
    const form = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('terms');
    const registerBtn = document.getElementById('registerBtn');

    togglePassword('passwordToggle', 'password');
    togglePassword('confirmPasswordToggle', 'confirmPassword');

    passwordInput.addEventListener('input', () => {
        const requirements = document.getElementById('passwordRequirements');
        requirements.classList.add('show');
        checkPasswordRequirements(passwordInput.value);
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        clearErrors();
        showAlert('', '');

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        let hasError = false;

        if (!validateName(firstName)) {
            showError('firstNameError', 'Enter a valid first name');
            firstNameInput.classList.add('error');
            hasError = true;
        }

        if (!validateName(lastName)) {
            showError('lastNameError', 'Enter a valid last name');
            lastNameInput.classList.add('error');
            hasError = true;
        }

        if (!email) {
            showError('emailError', 'Email is required');
            emailInput.classList.add('error');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError('emailError', 'Enter a valid email');
            emailInput.classList.add('error');
            hasError = true;
        }

        if (App.getUsers().some(user => user.email === email)) {
            showError('emailError', 'Email is already registered');
            emailInput.classList.add('error');
            hasError = true;
        }

        if (!checkPasswordRequirements(password)) {
            showError('passwordError', 'Password must satisfy all requirements');
            passwordInput.classList.add('error');
            hasError = true;
        }

        if (!confirmPassword) {
            showError('confirmPasswordError', 'Confirm your password');
            confirmInput.classList.add('error');
            hasError = true;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            confirmInput.classList.add('error');
            hasError = true;
        }

        if (!termsInput.checked) {
            showAlert('You must agree to the terms and conditions.', 'danger');
            hasError = true;
        }

        if (hasError) return;

        setButtonLoading(registerBtn, true, 'Creating account...');
        setTimeout(() => {
            App.createUser({ firstName, lastName, email, password });
            showAlert('Account created successfully! Redirecting to login...', 'success');
            setButtonLoading(registerBtn, false, 'Create Account');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }, 800);
    });
}

function initForgotPassword() {
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');
    const resetSection = document.getElementById('resetSection');
    const resetPasswordInput = document.getElementById('resetPassword');
    const resetConfirmInput = document.getElementById('resetConfirmPassword');
    const resetForm = document.getElementById('resetForm');
    const requestButton = document.getElementById('requestPasswordBtn');
    const resetButton = document.getElementById('resetPasswordBtn');
    const rememberEmail = App.getRememberEmail();

    togglePassword('resetPasswordToggle', 'resetPassword');
    togglePassword('resetConfirmPasswordToggle', 'resetConfirmPassword');

    if (rememberEmail) {
        emailInput.value = rememberEmail;
    }

    emailForm.addEventListener('submit', event => {
        event.preventDefault();
        clearErrors();
        showAlert('', '');

        const email = emailInput.value.trim();
        if (!email) {
            showError('emailError', 'Email is required');
            emailInput.classList.add('error');
            return;
        }

        if (!validateEmail(email)) {
            showError('emailError', 'Enter a valid email');
            emailInput.classList.add('error');
            return;
        }

        const existingUser = App.getUsers().find(user => user.email === email);
        if (!existingUser) {
            showAlert('No account found with that email.', 'danger');
            return;
        }

        resetSection.classList.remove('hidden');
        resetSection.classList.add('show');
        showAlert('User found. Set a new password below.', 'success');
    });

    resetPasswordInput.addEventListener('input', () => {
        const requirements = document.getElementById('passwordRequirements');
        requirements.classList.add('show');
        checkPasswordRequirements(resetPasswordInput.value);
    });

    resetForm.addEventListener('submit', event => {
        event.preventDefault();
        clearErrors();
        showAlert('', '');

        const email = emailInput.value.trim();
        const password = resetPasswordInput.value;
        const confirmPassword = resetConfirmInput.value;
        let hasError = false;

        if (!checkPasswordRequirements(password)) {
            showError('resetPasswordError', 'Password must satisfy all requirements');
            resetPasswordInput.classList.add('error');
            hasError = true;
        }

        if (!confirmPassword) {
            showError('resetConfirmPasswordError', 'Confirm your password');
            resetConfirmInput.classList.add('error');
            hasError = true;
        } else if (password !== confirmPassword) {
            showError('resetConfirmPasswordError', 'Passwords do not match');
            resetConfirmInput.classList.add('error');
            hasError = true;
        }

        if (hasError) return;

        const users = App.getUsers();
        const userIndex = users.findIndex(user => user.email === email);
        if (userIndex < 0) {
            showAlert('Unable to reset password. Try again.', 'danger');
            return;
        }

        users[userIndex].password = password;
        App.saveUsers(users);

        setButtonLoading(resetButton, true, 'Saving password...');
        setTimeout(() => {
            showAlert('Password reset successfully! Redirecting to login...', 'success');
            setButtonLoading(resetButton, false, 'Reset Password');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }, 800);
    });
}
