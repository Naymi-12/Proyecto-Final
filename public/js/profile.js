
document.addEventListener('DOMContentLoaded', async () => {

    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');

   
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');

    const totalEntradas = document.getElementById('totalEntradas');
    const totalResenas = document.getElementById('totalResenas');

    
    if (!token || !userData) {
        window.location.href = './index.html';
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        console.error('Error al recuperar el usuario:', error);
        return;
    }

    const userId = user.user_id || user.id;

    if (!userId) {
        console.error('No se encontró el ID del usuario:', user);
        return;
    }


    profileName.textContent = user.name || user.nombre || 'Usuario';
    profileEmail.textContent = user.email || user.correo || 'Correo no disponible';

    const role = String(user.role || user.rol || 'cliente').toLowerCase();

    profileRole.textContent =
        role === 'admin' || role === 'administrador'
            ? 'Administrador'
            : 'Cliente';

    // Consultar entradas y reseñas
    await Promise.all([
        cargarEntradas(),
        cargarResenas()
    ]);

    // CONSULTAR ENTRADAS DEL USUARIO
    async function cargarEntradas() {
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${userId}/tickets`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const tickets = await response.json();

            if (!Array.isArray(tickets)) {
                throw new Error('Respuesta de entradas inválida.');
            }

            actualizarResumen(tickets, null);

        } catch (error) {
            console.error('Error al cargar entradas:', error);
            totalEntradas.textContent = '—';
        }
    }

    async function cargarResenas() {
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${userId}/reviews`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const reviews = await response.json();

            if (!Array.isArray(reviews)) {
                throw new Error('Respuesta de reseñas inválida.');
            }

            
            actualizarResumen(null, reviews);

        } catch (error) {
            console.error('Error al cargar reseñas:', error);
            totalResenas.textContent = '—';
        }
    }

    
    function actualizarResumen(tickets, reviews) {

        if (tickets !== null) {
            totalEntradas.textContent = tickets.length;
        }

        if (reviews !== null) {
            totalResenas.textContent = reviews.length;
        }
    }

});
