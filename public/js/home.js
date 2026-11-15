
document.addEventListener('DOMContentLoaded', () => {

    const loginLink = document.getElementById('loginLink');
    const homeLink = document.getElementById('homeLink');
    const profileLink = document.getElementById('profileLink');

    const userMenuContainer = document.getElementById('userMenuContainer');
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const userGreeting = document.getElementById('userGreeting');
    const logoutButton = document.getElementById('logoutButton');

    const adminPanelLink = document.getElementById('adminPanelLink');
    const adminLogoutButton = document.getElementById('adminLogoutButton');

    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');

    let user = null;

    try {
        user = userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error al recuperar los datos del usuario:', error);
    }

    const isLoggedIn = Boolean(token && user);
    const isAdmin = isLoggedIn &&
        String(user.role || '').toLowerCase() === 'admin';


    if (profileLink) profileLink.classList.add('hidden');

    if (isAdmin) {

        if (loginLink) loginLink.classList.add('hidden');
        if (homeLink) homeLink.classList.add('hidden');
        if (profileLink) profileLink.classList.add('hidden');

        if (userMenuContainer) {
            userMenuContainer.classList.add('hidden');
        }

        if (adminPanelLink) {
            adminPanelLink.classList.remove('hidden');
        }

        if (adminLogoutButton) {
            adminLogoutButton.classList.remove('hidden');
        }
    }

    else if (isLoggedIn) {

        if (loginLink) loginLink.classList.add('hidden');
        if (homeLink) homeLink.classList.remove('hidden');
        if (profileLink) profileLink.classList.remove('hidden');

        if (userMenuContainer) {
            userMenuContainer.classList.remove('hidden');
        }

        if (userGreeting) {
            userGreeting.textContent = `Hola, ${user.name}`;
        }

        if (adminPanelLink) {
            adminPanelLink.classList.add('hidden');
        }

        if (adminLogoutButton) {
            adminLogoutButton.classList.add('hidden');
        }
    }


    else {

        if (loginLink) loginLink.classList.remove('hidden');
        if (homeLink) homeLink.classList.remove('hidden');
        if (profileLink) profileLink.classList.add('hidden');

        if (userMenuContainer) {
            userMenuContainer.classList.add('hidden');
        }

        if (adminPanelLink) {
            adminPanelLink.classList.add('hidden');
        }

        if (adminLogoutButton) {
            adminLogoutButton.classList.add('hidden');
        }
    }

   
    if (userButton && userDropdown) {
        userButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });
    }

    
    function logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        window.location.href = './home.html';
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', () => {
            const confirmLogout = confirm(
                '¿Deseas cerrar la sesión de administrador?'
            );

            if (confirmLogout) {
                logout();
            }
        });
    }

    console.log('Sesión activa:', isLoggedIn);
    console.log('Usuario:', user);
    console.log('Rol:', user?.role);
    console.log('¿Es administrador?:', isAdmin);

});

