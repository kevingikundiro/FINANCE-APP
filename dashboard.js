document.addEventListener('DOMContentLoaded', () => {
    App.requireAuth();
    App.registerServiceWorker();

    const session = App.getSession();
    const userName = document.getElementById('userName');
    const profileImg = document.getElementById('profileImg');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileLink = document.getElementById('profileLink');
    const settingsLink = document.getElementById('settingsLink');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const viewAllLink = document.getElementById('viewAllLink');
    const actionButtons = document.querySelectorAll('.action-btn');
    const timeframeButtons = document.querySelectorAll('.btn-small');

    if (session && userName) {
        userName.textContent = session.name.split(' ')[0];
    }

    if (profileImg && profileDropdown) {
        profileImg.addEventListener('click', () => {
            profileDropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', event => {
        if (!event.target.closest('.user-profile')) {
            profileDropdown.classList.remove('active');
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', event => {
            event.preventDefault();
            App.clearSession();
            window.location.href = 'login.html';
        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', event => {
            event.preventDefault();
            window.location.href = 'profile.html';
        });
    }

    if (settingsLink) {
        settingsLink.addEventListener('click', event => {
            event.preventDefault();
            window.location.href = 'settings.html';
        });
    }

    if (navItems.length) {
        navItems.forEach(item => {
            item.addEventListener('click', event => {
                event.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                const sectionName = item.querySelector('span')?.textContent || 'Dashboard';
                const headerTitle = document.querySelector('.header-left h1');
                if (headerTitle) {
                    headerTitle.textContent = sectionName === 'Dashboard'
                        ? `Welcome Back, ${session.name.split(' ')[0]}!`
                        : sectionName;
                }
            });
        });
    }

    if (viewAllLink) {
        viewAllLink.addEventListener('click', event => {
            event.preventDefault();
            document.getElementById('transactionsSection')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.querySelector('span')?.textContent || 'Action';
            alert(`${action} feature is coming soon. Stay tuned!`);
        });
    });

    timeframeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    renderSpendingChart();
    renderCategoryChart();
});

function renderSpendingChart() {
    const canvas = document.getElementById('spendingChart');
    if (!canvas) return;

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Spending',
                data: [120, 190, 150, 220, 180, 200, 160],
                borderColor: '#6C5CE7',
                backgroundColor: 'rgba(108, 92, 231, 0.12)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'],
            datasets: [{
                data: [30, 20, 15, 25, 10],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
