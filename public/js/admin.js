
document.addEventListener('DOMContentLoaded', () => {


    const navigationLinks = document.querySelectorAll('.nav-link');
    const createEventBtn = document.getElementById('createEventBtn');
    const eventsTableBody = document.getElementById('eventsTableBody');
    const searchEvent = document.getElementById('searchEvent');
    const filterCategory = document.getElementById('filterCategory');


const artistsTableBody = document.getElementById('artistsTableBody');
const searchArtist = document.getElementById('searchArtist');
const createArtistBtn = document.getElementById('createArtistBtn');
const artistFormSection = document.getElementById('artistFormSection');
const createArtistForm = document.getElementById('createArtistForm');
const artistName = document.getElementById('artistName');
const artistFormMessage = document.getElementById('artistFormMessage');
const cancelArtistForm = document.getElementById('cancelArtistForm');
const saveArtistBtn = document.getElementById('saveArtistBtn');

const castMembersTableBody = document.getElementById('castMembersTableBody');
const searchCastMember = document.getElementById('searchCastMember');
const createCastMemberBtn = document.getElementById('createCastMemberBtn');
const castMemberFormSection = document.getElementById('castMemberFormSection');
const createCastMemberForm = document.getElementById('createCastMemberForm');
const castMemberName = document.getElementById('castMemberName');
const castMemberFormMessage = document.getElementById('castMemberFormMessage');
const cancelCastMemberForm = document.getElementById('cancelCastMemberForm');
const saveCastMemberBtn = document.getElementById('saveCastMemberBtn');

let artists = [];
let castMembers = [];

const associateArtistForm = document.getElementById('associateArtistForm');
const concertSelect = document.getElementById('concertSelect');
const artistSelect = document.getElementById('artistSelect');
const presentationTime = document.getElementById('presentationTime');
const associateArtistMessage = document.getElementById('associateArtistMessage');
const associateArtistBtn = document.getElementById('associateArtistBtn');
const concertArtistsTableBody = document.getElementById('concertArtistsTableBody');
 

const usersTableBody = document.getElementById('usersTableBody');
const searchUser = document.getElementById('searchUser');
const filterUserRole = document.getElementById('filterUserRole');


const associateCastMemberForm = document.getElementById('associateCastMemberForm');
const theaterSelect = document.getElementById('theaterSelect');
const castMemberSelect = document.getElementById('castMemberSelect');
const associateCastMemberMessage = document.getElementById('associateCastMemberMessage');
const associateCastMemberBtn = document.getElementById('associateCastMemberBtn');
const theaterCastTableBody = document.getElementById('theaterCastTableBody');


const intermissionsForm = document.getElementById('intermissionsForm');
const intermissionsEventSelect = document.getElementById('intermissionsEventSelect');
const intermissionsText = document.getElementById('intermissionsText');
const intermissionsMessage = document.getElementById('intermissionsMessage');
const saveIntermissionsBtn = document.getElementById('saveIntermissionsBtn');


const sportDetailsForm = document.getElementById('sportDetailsForm');
const sportEventSelect = document.getElementById('sportEventSelect');
const homeTeamInput = document.getElementById('homeTeam');
const awayTeamInput = document.getElementById('awayTeam');
const scoreboardInput = document.getElementById('scoreboard');
const sportDetailsMessage = document.getElementById('sportDetailsMessage');
const saveScoreboardBtn = document.getElementById('saveScoreboardBtn');

let sportDetailsExist = false;

const userFormSection = document.getElementById('userFormSection');
const editUserForm = document.getElementById('editUserForm');
const closeUserForm = document.getElementById('closeUserForm');
const cancelUserForm = document.getElementById('cancelUserForm');
const userFormMessage = document.getElementById('userFormMessage');

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');
const userPassword = document.getElementById('userPassword');
const saveUserBtn = document.getElementById('saveUserBtn');
const replaceUserBtn = document.getElementById('replaceUserBtn');



const ticketsTableBody = document.getElementById('ticketsTableBody');
const searchTicket = document.getElementById('searchTicket');
const filterTicketStatus = document.getElementById('filterTicketStatus');

const dailyTicketsCount = document.getElementById('dailyTicketsCount');
const dailySalesAmount = document.getElementById('dailySalesAmount');


const reviewsTableBody = document.getElementById('reviewsTableBody');
const searchReview = document.getElementById('searchReview');
const filterReviewRating = document.getElementById('filterReviewRating');

let reviews = [];

let tickets = [];


let users = [];
let editingUserId = null;




const eventFormSection = document.getElementById('eventFormSection');
const createEventForm = document.getElementById('createEventForm');
const closeEventForm = document.getElementById('closeEventForm');
const cancelEventForm = document.getElementById('cancelEventForm');
const eventFormMessage = document.getElementById('eventFormMessage');

let editingEventId = null;

const eventFormTitle = document.querySelector('.form-header h3');
const saveEventBtn = document.getElementById('saveEventBtn');


createEventBtn.addEventListener('click', () => {

    editingEventId = null;

    createEventForm.reset();

    eventFormTitle.textContent = 'Crear Nuevo Evento';
    saveEventBtn.textContent = 'Guardar Evento';

    eventImage.required = true;

    eventImagePreview.src = '';
    eventImagePreview.hidden = true;

    eventFormMessage.textContent = '';

    eventFormSection.hidden = false;

    eventFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});


function hideEventForm() {

    eventFormSection.hidden = true;

    createEventForm.reset();

    editingEventId = null;

    eventFormTitle.textContent = 'Crear Nuevo Evento';
    saveEventBtn.textContent = 'Guardar Evento';

    eventImage.required = true;

    eventImagePreview.src = '';
    eventImagePreview.hidden = true;

    eventFormMessage.textContent = '';
}

closeEventForm.addEventListener('click', hideEventForm);
cancelEventForm.addEventListener('click', hideEventForm);


createEventForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
        eventFormMessage.textContent =
            'Debes iniciar sesión para guardar eventos.';
        return;
    }

    const imageFile = eventImage.files[0];


    if (!editingEventId && !imageFile) {
        eventFormMessage.textContent =
            'Debes seleccionar una imagen para el evento.';
        return;
    }

    const formData = new FormData();

    formData.append('name',
        document.getElementById('eventName').value.trim());

    formData.append('location',
        document.getElementById('eventLocation').value.trim());

    formData.append('date_time',
        document.getElementById('eventDate').value);

    formData.append('category',
        document.getElementById('eventCategory').value);

    formData.append('min_price',
        document.getElementById('minPrice').value);

    formData.append('max_price',
        document.getElementById('maxPrice').value);

    formData.append('description',
        document.getElementById('eventDescription').value.trim());


    if (imageFile) {
        formData.append('image', imageFile);
    }

    const isEditing = editingEventId !== null;

    const url = isEditing
        ? `/api/events/${editingEventId}`
        : '/api/events';

    try {

        saveEventBtn.disabled = true;
        saveEventBtn.textContent = isEditing
            ? 'Actualizando...'
            : 'Guardando...';

        eventFormMessage.textContent = '';

       
let response;

if (isEditing && !imageFile) {
  
    const updateData = {
        name: document.getElementById('eventName').value.trim(),
        location: document.getElementById('eventLocation').value.trim(),
        date_time: document.getElementById('eventDate').value,
        category: document.getElementById('eventCategory').value,
        min_price: document.getElementById('minPrice').value,
        max_price: document.getElementById('maxPrice').value,
        description: document.getElementById('eventDescription').value.trim()
    };

    response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    });

} else {
    
    response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
}


        const data = await response.json();

        
        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo guardar el evento.'
            );
        }

        eventFormMessage.textContent = isEditing
            ? '¡Evento actualizado correctamente!'
            : '¡Evento creado correctamente!';

        await loadEvents();

        createEventForm.reset();

        eventImagePreview.src = '';
        eventImagePreview.hidden = true;

        setTimeout(() => {
            hideEventForm();
        }, 1200);

    } catch (error) {

        console.error('Error al guardar evento:', error);

        eventFormMessage.textContent = error.message;

    } finally {

        saveEventBtn.disabled = false;

        saveEventBtn.textContent = editingEventId !== null
            ? 'Actualizar Evento'
            : 'Guardar Evento';
    }

});

const eventImage = document.getElementById('eventImage');
const eventImagePreview = document.getElementById('eventImagePreview');

eventImage.addEventListener('change', () => {
    const file = eventImage.files[0];

    if (!file) {
        eventImagePreview.src = '';
        eventImagePreview.hidden = true;
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Selecciona un archivo de imagen válido.');
        eventImage.value = '';
        eventImagePreview.hidden = true;
        return;
    }

    eventImagePreview.src = URL.createObjectURL(file);
    eventImagePreview.hidden = false;
});


    let events = [];

    
    navigationLinks.forEach(link => {
        link.addEventListener('click', () => {

            navigationLinks.forEach(item => {
                item.classList.remove('active');
            });

            link.classList.add('active');
        });
    });

    
    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

  
    function getCategoryName(category) {
        const categories = {
            concert: 'Concierto',
            sports: 'Deporte',
            theater: 'Teatro'
        };

        return categories[category] || category || 'Sin categoría';
    }

    
    function formatDate(date) {
        if (!date) return 'No disponible';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return escapeHTML(date);
        }

        return parsedDate.toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    }

    
    async function loadEvents() {

        eventsTableBody.innerHTML = `
            <tr>
                <td colspan="5">Cargando eventos...</td>
            </tr>
        `;

        try {
            const response = await fetch('/api/events');

            if (!response.ok) {
                throw new Error('No se pudieron consultar los eventos.');
            }

            const data = await response.json();

           
            events = Array.isArray(data)
                ? data
                : data.events || data.data || [];

            if (!Array.isArray(events)) {
                throw new Error('El formato de respuesta de eventos no es válido.');
            }
renderEvents();


const totalEventsElement = document.getElementById('totalEvents');

if (totalEventsElement) {
    totalEventsElement.textContent = events.length;
}

populateConcertSelect();
populateTheaterSelect();
populateIntermissionsSelect();
populateSportEventSelect();

function populateSportEventSelect() {
    const selectedValue = sportEventSelect.value;

    const sportsEvents = events.filter(event =>
        event.category === 'sports'
    );

    sportEventSelect.innerHTML = `
        <option value="">Seleccionar evento</option>
    `;

    sportsEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.event_id;
        option.textContent = event.name;

        sportEventSelect.appendChild(option);
    });

    sportEventSelect.value = selectedValue;
}

intermissionsEventSelect.addEventListener('change', async () => {
    const eventId = intermissionsEventSelect.value;

    intermissionsText.value = '';
    intermissionsMessage.textContent = '';

    if (!eventId) return;

    try {
        const response = await fetch(`/api/events/${eventId}/intermissions`);
        const data = await response.json();

        if (response.ok) {
            intermissionsText.value = data.intermissions || '';
        } else if (response.status === 404) {
            intermissionsMessage.textContent =
                'Esta obra aún no tiene intermedios registrados. Puedes agregarlos y guardarlos.';
        } else {
            intermissionsMessage.textContent =
                data.message || 'Error al cargar los intermedios.';
        }
    } catch (error) {
        console.error('Error al cargar intermedios:', error);
        intermissionsMessage.textContent = 'Error de conexión al cargar los intermedios.';
    }
});


sportEventSelect.addEventListener('change', async () => {
    const eventId = sportEventSelect.value;

    homeTeamInput.value = '';
    awayTeamInput.value = '';
    scoreboardInput.value = '';
    sportDetailsMessage.textContent = '';

    sportDetailsExist = false;

    if (!eventId) return;

    try {
        const response = await fetch(`/api/events/${eventId}/sport-details`);
        const data = await response.json();

        if (response.ok) {
            homeTeamInput.value = data.home_team || '';
            awayTeamInput.value = data.away_team || '';
            scoreboardInput.value = data.scoreboard || '';

            sportDetailsExist = true;

            homeTeamInput.readOnly = true;
            awayTeamInput.readOnly = true;

            sportDetailsMessage.textContent =
                'Datos deportivos cargados correctamente.';

        } else if (response.status === 404) {
            homeTeamInput.readOnly = false;
            awayTeamInput.readOnly = false;

            sportDetailsMessage.textContent =
                'Este evento todavía no tiene equipos registrados. Puedes agregarlos.';

        } else {
            sportDetailsMessage.textContent =
                data.message || 'Error al cargar los datos deportivos.';
        }

    } catch (error) {
        console.error('Error al cargar datos deportivos:', error);

        sportDetailsMessage.textContent =
            'Error de conexión al cargar los datos deportivos.';
    }
});
// Crear detalles deportivos o actualizar el marcador
sportDetailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventId = sportEventSelect.value;
    const home_team = homeTeamInput.value.trim();
    const away_team = awayTeamInput.value.trim();
    const scoreboard = scoreboardInput.value.trim();
    const token = sessionStorage.getItem('token');

    sportDetailsMessage.textContent = '';

    if (!eventId) {
        sportDetailsMessage.textContent = 'Selecciona un evento deportivo.';
        return;
    }

    if (!scoreboard) {
        sportDetailsMessage.textContent = 'Ingresa el marcador.';
        return;
    }

    if (!sportDetailsExist && (!home_team || !away_team)) {
        sportDetailsMessage.textContent = 'Ingresa los nombres de ambos equipos.';
        return;
    }

    if (!token) {
        sportDetailsMessage.textContent = 'Debes iniciar sesión como administrador.';
        return;
    }

    saveScoreboardBtn.disabled = true;
    saveScoreboardBtn.textContent = 'Guardando...';

    try {
        const method = sportDetailsExist ? 'PATCH' : 'POST';

        const body = sportDetailsExist
            ? { scoreboard }
            : { home_team, away_team, scoreboard };

        const response = await fetch(
            `/api/events/${eventId}/sport-details`,
            {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (response.ok) {
            sportDetailsExist = true;

            homeTeamInput.readOnly = true;
            awayTeamInput.readOnly = true;

            sportDetailsMessage.textContent =
                data.message || 'Marcador guardado correctamente.';
        } else {
            sportDetailsMessage.textContent =
                data.message || 'Error al guardar el marcador.';
        }

    } catch (error) {
        console.error('Error al guardar el marcador:', error);

        sportDetailsMessage.textContent =
            'Error de conexión al guardar el marcador.';
    } finally {
        saveScoreboardBtn.disabled = false;
        saveScoreboardBtn.textContent = 'Guardar marcador';
    }
});
intermissionsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventId = intermissionsEventSelect.value;
    const intermissions = intermissionsText.value.trim();
    const token = sessionStorage.getItem('token');

    intermissionsMessage.textContent = '';

    if (!eventId) {
        intermissionsMessage.textContent = 'Debes seleccionar una obra.';
        return;
    }

    if (!intermissions) {
        intermissionsMessage.textContent = 'Debes ingresar la información de los intermedios.';
        return;
    }

    if (!token) {
        intermissionsMessage.textContent = 'Debes iniciar sesión como administrador.';
        return;
    }

    saveIntermissionsBtn.disabled = true;
    saveIntermissionsBtn.textContent = 'Guardando...';

    try {
        const response = await fetch(`/api/events/${eventId}/intermissions`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ intermissions })
        });

        const data = await response.json();

        if (response.ok) {
            intermissionsMessage.textContent =
                data.message || 'Intermedios actualizados correctamente.';
        } else {
            intermissionsMessage.textContent =
                data.message || 'Error al guardar los intermedios.';
        }
    } catch (error) {
        console.error('Error al guardar intermedios:', error);
        intermissionsMessage.textContent = 'Error de conexión al guardar los intermedios.';
    } finally {
        saveIntermissionsBtn.disabled = false;
        saveIntermissionsBtn.textContent = 'Guardar intermedios';
    }
});

        } catch (error) {
            console.error('Error al cargar eventos:', error);

            eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No fue posible cargar los eventos.
                        Verifica la conexión con el servidor.
                    </td>
                </tr>
            `;
        }
    }


    function renderEvents() {

        const searchText = searchEvent.value.trim().toLowerCase();
        const selectedCategory = filterCategory.value;

        const filteredEvents = events.filter(event => {

            const matchesName = (event.name || '')
                .toLowerCase()
                .includes(searchText);

            const matchesCategory = !selectedCategory ||
                event.category === selectedCategory;

            return matchesName && matchesCategory;
        });

        if (filteredEvents.length === 0) {
            eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No se encontraron eventos.
                    </td>
                </tr>
            `;
            return;
        }

        eventsTableBody.innerHTML = filteredEvents.map(event => `
            <tr>
                <td>${escapeHTML(event.name)}</td>

                <td>
                    ${escapeHTML(getCategoryName(event.category))}
                </td>

                <td>
                    ${formatDate(event.date_time)}
                </td>

                <td>
                    ${escapeHTML(event.location)}
                </td>

                <td>
                    <button
                        type="button"
                        class="edit-event-btn"
                        data-id="${Number(event.event_id)}">
                        Editar
                    </button>

                    <button
                        type="button"
                        class="delete-event-btn"
                        data-id="${Number(event.event_id)}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }
      

async function loadUsers() {

    usersTableBody.innerHTML = `
        <tr>
            <td colspan="5">Cargando usuarios...</td>
        </tr>
    `;

    const token = sessionStorage.getItem('token');

    if (!token) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Debes iniciar sesión como administrador.
                </td>
            </tr>
        `;
        return;
    }

    try {

        const response = await fetch('/api/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron cargar los usuarios.'
            );
        }

        users = Array.isArray(data)
            ? data
            : data.users || data.data || [];

        if (!Array.isArray(users)) {
            throw new Error('El formato de respuesta de usuarios no es válido.');
        }

       renderUsers();

const totalUsersElement = document.getElementById('totalUsers');

if (totalUsersElement) {
    totalUsersElement.textContent = users.length;
}

    } catch (error) {

        console.error('Error al cargar usuarios:', error);

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;
    }
}



function renderUsers() {

    const searchText = searchUser.value.trim().toLowerCase();
    const selectedRole = filterUserRole.value;

    const filteredUsers = users.filter(user => {

        const matchesSearch =
            (user.name || '').toLowerCase().includes(searchText) ||
            (user.email || '').toLowerCase().includes(searchText);

        const matchesRole =
            !selectedRole || user.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    if (filteredUsers.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No se encontraron usuarios.
                </td>
            </tr>
        `;

        return;
    }

    usersTableBody.innerHTML = filteredUsers.map(user => `

        <tr>
            <td>${Number(user.user_id)}</td>

            <td>${escapeHTML(user.name)}</td>

            <td>${escapeHTML(user.email)}</td>

            <td>
                ${user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </td>

            <td>
                <button
                    type="button"
                    class="edit-user-btn"
                    data-id="${Number(user.user_id)}">
                    Editar
                </button>

                <button
                    type="button"
                    class="delete-user-btn"
                    data-id="${Number(user.user_id)}">
                    Eliminar
                </button>
            </td>
        </tr>

    `).join('');
}



searchUser.addEventListener('input', renderUsers);
filterUserRole.addEventListener('change', renderUsers);



function openUserForm(user) {

    editingUserId = Number(user.user_id);

    userName.value = user.name || '';
    userEmail.value = user.email || '';
    userRole.value = user.role || 'user';

    // Nunca cargar ni mostrar la contraseña almacenada
    userPassword.value = '';

    userFormMessage.textContent = '';
    saveUserBtn.disabled = false;
   saveUserBtn.textContent = 'Actualizar parcialmente';

    userFormSection.hidden = false;

    userFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


function hideUserForm() {

    userFormSection.hidden = true;

    editUserForm.reset();

    editingUserId = null;

    userFormMessage.textContent = '';

    saveUserBtn.disabled = false;
    saveUserBtn.textContent = 'Actualizar parcialmente';

    replaceUserBtn.disabled = false;
    replaceUserBtn.textContent = 'Actualizar completamente';

}

closeUserForm.addEventListener('click', hideUserForm);
cancelUserForm.addEventListener('click', hideUserForm);


editUserForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
        userFormMessage.textContent =
            'Debes iniciar sesión para modificar usuarios.';
        return;
    }

    if (editingUserId === null) {
        userFormMessage.textContent =
            'No se ha seleccionado ningún usuario.';
        return;
    }

    const updateData = {
        name: userName.value.trim(),
        email: userEmail.value.trim(),
        role: userRole.value
    };

    
    if (userPassword.value.trim() !== '') {
        updateData.password = userPassword.value;
    }

    try {

        saveUserBtn.disabled = true;
        saveUserBtn.textContent = 'Guardando...';

        userFormMessage.textContent = '';

        const response = await fetch(`/api/users/${editingUserId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron actualizar los datos.'
            );
        }

        userFormMessage.textContent =
            '¡Usuario actualizado correctamente!';

        await loadUsers();

        setTimeout(() => {
            hideUserForm();
        }, 1200);

    } catch (error) {

        console.error('Error al actualizar usuario:', error);

        userFormMessage.textContent = error.message;

    } finally {

        saveUserBtn.disabled = false;
        saveUserBtn.textContent = 'Guardar Cambios';
    }

});

replaceUserBtn.addEventListener('click', async () => {

    const token = sessionStorage.getItem('token');

    if (!token) {
        userFormMessage.textContent =
            'Debes iniciar sesión como administrador.';
        return;
    }

    if (editingUserId === null) {
        userFormMessage.textContent =
            'No se ha seleccionado ningún usuario.';
        return;
    }

    // PUT requiere todos los campos, incluida una contraseña nueva.
    if (!editUserForm.reportValidity()) {
        return;
    }

    const password = userPassword.value;

    if (!password.trim()) {
        userFormMessage.textContent =
            'Debes escribir una nueva contraseña para utilizar PUT.';
        userPassword.focus();
        return;
    }

    const updateData = {
        name: userName.value.trim(),
        email: userEmail.value.trim(),
        role: userRole.value,
        password: password
    };

    try {

        replaceUserBtn.disabled = true;
        saveUserBtn.disabled = true;
        replaceUserBtn.textContent = 'Actualizando...';

        userFormMessage.textContent = '';

        const response = await fetch(`/api/users/${editingUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo actualizar completamente el usuario.'
            );
        }

        userFormMessage.textContent =
            '¡Usuario actualizado completamente!';

        await loadUsers();

        setTimeout(() => {
            hideUserForm();
        }, 1200);

    } catch (error) {

        console.error('Error al actualizar usuario mediante PUT:', error);

        userFormMessage.textContent = error.message;

    } finally {

        replaceUserBtn.disabled = false;
        saveUserBtn.disabled = false;
        replaceUserBtn.textContent = 'Actualizar completamente (PUT)';
    }
});



usersTableBody.addEventListener('click', async (event) => {

    const editButton = event.target.closest('.edit-user-btn');

    if (editButton) {

        const userId = Number(editButton.dataset.id);
        const token = sessionStorage.getItem('token');

        if (!token) {
            alert('Debes iniciar sesión como administrador.');
            return;
        }

        try {

            editButton.disabled = true;
            editButton.textContent = 'Cargando...';

           
            const response = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'No se pudo consultar el usuario.'
                );
            }

       
            const selectedUser = data.user || data.data || data;

            if (!selectedUser.user_id) {
                throw new Error('La respuesta no contiene los datos del usuario.');
            }

           
            openUserForm(selectedUser);

        } catch (error) {

            console.error('Error al consultar usuario:', error);
            alert(error.message);

        } finally {

            editButton.disabled = false;
            editButton.textContent = 'Editar';
        }

        return;
    }

   


    const deleteButton = event.target.closest('.delete-user-btn');

    if (!deleteButton) return;

    const userId = Number(deleteButton.dataset.id);

    const selectedUser = users.find(
        user => Number(user.user_id) === userId
    );

    if (!selectedUser) {
        alert('No se encontró el usuario.');
        return;
    }

    const confirmed = confirm(
        `¿Estás seguro de eliminar al usuario ${selectedUser.name}?`
    );

    if (!confirmed) return;

    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para eliminar usuarios.');
        return;
    }

    try {

        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo eliminar el usuario.'
            );
        }

        alert('Usuario eliminado correctamente.');

        await loadUsers();

    } catch (error) {

        console.error('Error al eliminar usuario:', error);

        alert(error.message);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Eliminar';
    }

}); 

// ======================================
// GESTIÓN DE ENTRADAS Y VENTAS
// ======================================

// Cargar todas las entradas
async function loadTickets() {

    ticketsTableBody.innerHTML = `
        <tr>
            <td colspan="9">Cargando entradas...</td>
        </tr>
    `;

    const token = sessionStorage.getItem('token');

    if (!token) {
        ticketsTableBody.innerHTML = `
            <tr>
                <td colspan="9">Debes iniciar sesión como administrador.</td>
            </tr>
        `;
        return;
    }

    try {
        const response = await fetch('/api/tickets', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron cargar las entradas.'
            );
        }

        tickets = Array.isArray(data)
            ? data
            : data.tickets || data.data || [];

        if (!Array.isArray(tickets)) {
            throw new Error('El formato de respuesta de entradas no es válido.');
        }

        renderTickets();

    } catch (error) {
        console.error('Error al cargar entradas:', error);

        ticketsTableBody.innerHTML = `
            <tr>
                <td colspan="9">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


// Mostrar las entradas en la tabla
function renderTickets() {

    const searchText = searchTicket.value.trim().toLowerCase();
    const selectedStatus = filterTicketStatus.value;

    const filteredTickets = tickets.filter(ticket => {

        const matchesSearch =
            String(ticket.ticket_id || '').includes(searchText) ||
            (ticket.user_name || '').toLowerCase().includes(searchText) ||
            (ticket.user_email || '').toLowerCase().includes(searchText) ||
            (ticket.event_name || '').toLowerCase().includes(searchText);

        const matchesStatus =
            !selectedStatus || ticket.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredTickets.length === 0) {
        ticketsTableBody.innerHTML = `
            <tr>
                <td colspan="9">No se encontraron entradas.</td>
            </tr>
        `;
        return;
    }

    ticketsTableBody.innerHTML = filteredTickets.map(ticket => {

        const statusName = ticket.status === 'completed'
            ? 'Completada'
            : ticket.status === 'upcoming'
                ? 'Próxima'
                : ticket.status || 'Sin estado';

        const ticketType = ticket.ticket_type || 'No especificado';

        const price = Number(ticket.paid_price || 0).toLocaleString(
            'es-CO',
            {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }
        );

        return `
            <tr>
                <td>${Number(ticket.ticket_id)}</td>

                <td>
                    ${escapeHTML(ticket.user_name || 'Usuario #' + ticket.user_id)}
                    <br>
                    <small>${escapeHTML(ticket.user_email || '')}</small>
                </td>

                <td>${escapeHTML(ticket.event_name || 'Evento #' + ticket.event_id)}</td>

                <td>${escapeHTML(ticketType)}</td>

                <td>${escapeHTML(ticket.seat_number || 'No asignado')}</td>

                <td>${price}</td>

                <td>${formatDate(ticket.purchase_date)}</td>

                <td>${escapeHTML(statusName)}</td>

                <td>
                    <button
                        type="button"
                        class="delete-ticket-btn"
                        data-id="${Number(ticket.ticket_id)}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}




async function loadDailySales() {

    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('No hay token de administrador.');
        return;
    }

    try {
        const response = await fetch('/api/tickets/admin/daily-sales', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        console.log('RESPUESTA DE VENTAS:', data);

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron consultar las ventas.'
            );
        }

        const totalSales = Number(data.total_sales || 0);
        const ticketsSold = Number(data.tickets_sold || 0);

        const formattedSales = totalSales.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        });

   
        if (dailyTicketsCount) {
            dailyTicketsCount.textContent = ticketsSold;
        }

        if (dailySalesAmount) {
            dailySalesAmount.textContent = formattedSales;
        }

   
        const dailyTickets = document.getElementById('dailyTickets');
        const dailySales = document.getElementById('dailySales');

        if (dailyTickets) {
            dailyTickets.textContent = ticketsSold;
        }

        if (dailySales) {
            dailySales.textContent = formattedSales;
        }

    } catch (error) {
        console.error('Error al consultar las ventas:', error);

        if (dailyTicketsCount) {
            dailyTicketsCount.textContent = 'Error';
        }

        if (dailySalesAmount) {
            dailySalesAmount.textContent = 'Error';
        }
    }
}


searchTicket.addEventListener('input', renderTickets);
filterTicketStatus.addEventListener('change', renderTickets);


// Eliminar entradas desde la tabla
ticketsTableBody.addEventListener('click', async (event) => {

    const deleteButton = event.target.closest('.delete-ticket-btn');

    if (!deleteButton) return;

    const ticketId = Number(deleteButton.dataset.id);

    const selectedTicket = tickets.find(
        ticket => Number(ticket.ticket_id) === ticketId
    );

    if (!selectedTicket) {
        alert('No se encontró la entrada.');
        return;
    }

    const confirmed = confirm(
        `¿Estás seguro de eliminar la entrada #${ticketId}?`
    );

    if (!confirmed) return;

    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para eliminar entradas.');
        return;
    }

    try {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        const response = await fetch(`/api/tickets/${ticketId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo eliminar la entrada.'
            );
        }

        alert('Entrada eliminada correctamente.');

        await loadTickets();
        await loadDailySales();

    } catch (error) {
        console.error('Error al eliminar entrada:', error);

        alert(error.message);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Eliminar';
    }
});


// ======================================
// GESTIÓN DE RESEÑAS
// ======================================

// Consultar todas las reseñas
async function loadReviews() {

    reviewsTableBody.innerHTML = `
        <tr>
            <td colspan="8">Cargando reseñas...</td>
        </tr>
    `;

    const token = sessionStorage.getItem('token');

    if (!token) {
        reviewsTableBody.innerHTML = `
            <tr>
                <td colspan="8">Debes iniciar sesión como administrador.</td>
            </tr>
        `;
        return;
    }

    try {
        const response = await fetch('/api/reviews', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron cargar las reseñas.'
            );
        }

        reviews = Array.isArray(data)
            ? data
            : data.reviews || data.data || [];

        if (!Array.isArray(reviews)) {
            throw new Error('El formato de respuesta de reseñas no es válido.');
        }

        renderReviews();

    } catch (error) {
        console.error('Error al cargar reseñas:', error);

        reviewsTableBody.innerHTML = `
            <tr>
                <td colspan="8">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


// Mostrar las reseñas en la tabla
function renderReviews() {

    const searchText = searchReview.value.trim().toLowerCase();
    const selectedRating = filterReviewRating.value;

    const filteredReviews = reviews.filter(review => {

        const matchesSearch =
            String(review.review_id).includes(searchText) ||
            (review.user_name || '').toLowerCase().includes(searchText) ||
            (review.event_name || '').toLowerCase().includes(searchText) ||
            (review.comment || '').toLowerCase().includes(searchText);

        const matchesRating =
            !selectedRating ||
            Number(review.rating) === Number(selectedRating);

        return matchesSearch && matchesRating;
    });

    if (filteredReviews.length === 0) {
        reviewsTableBody.innerHTML = `
            <tr>
                <td colspan="8">No se encontraron reseñas.</td>
            </tr>
        `;
        return;
    }

    reviewsTableBody.innerHTML = filteredReviews.map(review => {

        const rating = Math.min(5, Math.max(0, Number(review.rating) || 0));

        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        const tags = Array.isArray(review.tags) && review.tags.length > 0
            ? review.tags.map(tag => escapeHTML(tag.name)).join(', ')
            : 'Sin etiquetas';

        return `
            <tr>
                <td>${Number(review.review_id)}</td>

                <td>${escapeHTML(review.user_name || 'Usuario #' + review.user_id)}</td>

                <td>${escapeHTML(review.event_name || 'Evento #' + review.event_id)}</td>

                <td title="${rating} de 5">
                    ${stars} (${rating}/5)
                </td>

                <td>${escapeHTML(review.comment || 'Sin comentario')}</td>

                <td>${escapeHTML(review.seat_quality || 'No especificada')}</td>

                <td>${tags}</td>

                <td>
                    <button
                        type="button"
                        class="delete-review-btn"
                        data-id="${Number(review.review_id)}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}



searchReview.addEventListener('input', renderReviews);
filterReviewRating.addEventListener('change', renderReviews);


reviewsTableBody.addEventListener('click', async (event) => {

    const deleteButton = event.target.closest('.delete-review-btn');

    if (!deleteButton) return;

    const reviewId = Number(deleteButton.dataset.id);

    const selectedReview = reviews.find(
        review => Number(review.review_id) === reviewId
    );

    if (!selectedReview) {
        alert('No se encontró la reseña.');
        return;
    }

    const confirmed = confirm(
        `¿Estás segura de eliminar la reseña #${reviewId} de ${selectedReview.user_name}?`
    );

    if (!confirmed) return;

    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión como administrador.');
        return;
    }

    try {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo eliminar la reseña.'
            );
        }

        alert('Reseña eliminada correctamente.');

        await loadReviews();

    } catch (error) {
        console.error('Error al eliminar reseña:', error);

        alert(error.message);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Eliminar';
    }
});


async function loadArtists() {

    artistsTableBody.innerHTML = `
        <tr><td colspan="3">Cargando artistas...</td></tr>
    `;

    try {
        const response = await fetch('/api/artists');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudieron cargar los artistas.');
        }

        artists = Array.isArray(data) ? data : data.artists || data.data || [];

        if (!Array.isArray(artists)) {
            throw new Error('Formato de artistas no válido.');
        }

        renderArtists();
        populateArtistSelect();

    } catch (error) {
        console.error('Error al cargar artistas:', error);

        artistsTableBody.innerHTML = `
            <tr><td colspan="3">${escapeHTML(error.message)}</td></tr>
        `;
    }
}


function populateConcertSelect() {

    const selectedValue = concertSelect.value;

    const concerts = events.filter(event =>
        event.category === 'concert'
    );

    concertSelect.innerHTML = `
        <option value="">Seleccionar concierto</option>
    `;

    concerts.forEach(concert => {
        const option = document.createElement('option');

        option.value = concert.event_id;
        option.textContent = concert.name;

        concertSelect.appendChild(option);
    });

    concertSelect.value = selectedValue;
}
function populateTheaterSelect() {

    const selectedValue = theaterSelect.value;

    const theaters = events.filter(event =>
        event.category === 'theater'
    );

    theaterSelect.innerHTML = `
        <option value="">Seleccionar obra</option>
    `;

    theaters.forEach(theater => {
        const option = document.createElement('option');

        option.value = theater.event_id;
        option.textContent = theater.name;

        theaterSelect.appendChild(option);
    });

    theaterSelect.value = selectedValue;
}

function populateIntermissionsSelect() {

    const selectedValue = intermissionsEventSelect.value;

    const theaters = events.filter(event =>
        event.category === 'theater'
    );

    intermissionsEventSelect.innerHTML = `
        <option value="">Seleccionar obra</option>
    `;

    theaters.forEach(theater => {
        const option = document.createElement('option');

        option.value = theater.event_id;
        option.textContent = theater.name;

        intermissionsEventSelect.appendChild(option);
    });

    intermissionsEventSelect.value = selectedValue;
}

async function loadConcertArtists(eventId) {

    if (!eventId) {
        concertArtistsTableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Selecciona un concierto para consultar sus artistas.
                </td>
            </tr>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/artists/event/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudieron consultar los artistas.');
        }

        const assignedArtists = Array.isArray(data)
            ? data
            : data.artists || data.data || [];

        if (assignedArtists.length === 0) {
            concertArtistsTableBody.innerHTML = `
                <tr>
                    <td colspan="3">Este concierto todavía no tiene artistas asignados.</td>
                </tr>
            `;
            return;
        }

        concertArtistsTableBody.innerHTML = assignedArtists.map(artist => `
            <tr>
                <td>${Number(artist.artist_id)}</td>
                <td>${escapeHTML(artist.name)}</td>
                <td>${escapeHTML(artist.presentation_time || 'No definida')}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al consultar artistas del concierto:', error);

        concertArtistsTableBody.innerHTML = `
            <tr>
                <td colspan="3">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


concertSelect.addEventListener('change', () => {
    associateArtistMessage.textContent = '';
    loadConcertArtists(concertSelect.value);
});



async function loadTheaterCast(eventId) {

    if (!eventId) {
        theaterCastTableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    Selecciona una obra para consultar sus integrantes.
                </td>
            </tr>
        `;
        return;
    }

    try {

        const response = await fetch(`/api/cast-members/event/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron consultar los integrantes.'
            );
        }

        const assignedMembers = Array.isArray(data)
            ? data
            : data.castMembers || data.cast_members || data.data || [];

        if (assignedMembers.length === 0) {
            theaterCastTableBody.innerHTML = `
                <tr>
                    <td colspan="2">
                        Esta obra todavía no tiene integrantes asignados.
                    </td>
                </tr>
            `;
            return;
        }

        theaterCastTableBody.innerHTML = assignedMembers.map(member => `
            <tr>
                <td>${Number(member.cast_member_id)}</td>
                <td>${escapeHTML(member.name)}</td>
            </tr>
        `).join('');

    } catch (error) {

        console.error('Error al consultar integrantes:', error);

        theaterCastTableBody.innerHTML = `
            <tr>
                <td colspan="2">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


theaterSelect.addEventListener('change', () => {
    console.log('Obra seleccionada:', theaterSelect.value);

    associateCastMemberMessage.textContent = '';

    loadTheaterCast(theaterSelect.value);
});

if (theaterSelect.value) {
    loadTheaterCast(theaterSelect.value);
}





associateArtistForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');
    const eventId = concertSelect.value;
    const artistId = artistSelect.value;
    const time = presentationTime.value;

    if (!token) {
        associateArtistMessage.textContent =
            'Debes iniciar sesión como administrador.';
        return;
    }

    if (!eventId || !artistId || !time) {
        associateArtistMessage.textContent =
            'Completa todos los campos.';
        return;
    }

    try {
        associateArtistBtn.disabled = true;
        associateArtistBtn.textContent = 'Asociando...';
        associateArtistMessage.textContent = '';

        const response = await fetch(`/api/artists/event/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                artist_id: Number(artistId),
                presentation_time: time
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error
                    ? `${data.message}: ${data.error}`
                    : data.message || 'No se pudo asociar el artista.'
            );
        }

        associateArtistMessage.textContent =
            '¡Artista asociado correctamente!';

        presentationTime.value = '';

        await loadConcertArtists(eventId);

    } catch (error) {
        console.error('Error al asociar artista:', error);
        associateArtistMessage.textContent = error.message;

    } finally {
        associateArtistBtn.disabled = false;
        associateArtistBtn.textContent = 'Asociar Artista';
    }
});


async function loadTheaterCast(eventId) {

    if (!eventId) {
        theaterCastTableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    Selecciona una obra para consultar sus integrantes.
                </td>
            </tr>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/cast-members/event/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron consultar los integrantes.'
            );
        }

        const assignedMembers = Array.isArray(data)
            ? data
            : data.castMembers || data.cast_members || data.data || [];

        if (assignedMembers.length === 0) {
            theaterCastTableBody.innerHTML = `
                <tr>
                    <td colspan="2">
                        Esta obra todavía no tiene integrantes asignados.
                    </td>
                </tr>
            `;
            return;
        }

        theaterCastTableBody.innerHTML = assignedMembers.map(member => `
            <tr>
                <td>${Number(member.cast_member_id)}</td>
                <td>${escapeHTML(member.name)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al consultar integrantes:', error);

        theaterCastTableBody.innerHTML = `
            <tr>
                <td colspan="2">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


theaterSelect.addEventListener('change', () => {
    associateCastMemberMessage.textContent = '';
    loadTheaterCast(theaterSelect.value);
});


associateCastMemberForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');
    const eventId = theaterSelect.value;
    const castMemberId = castMemberSelect.value;

    if (!token) {
        associateCastMemberMessage.textContent =
            'Debes iniciar sesión como administrador.';
        return;
    }

    if (!eventId || !castMemberId) {
        associateCastMemberMessage.textContent =
            'Selecciona una obra y un integrante.';
        return;
    }

    try {
        associateCastMemberBtn.disabled = true;
        associateCastMemberBtn.textContent = 'Asociando...';
        associateCastMemberMessage.textContent = '';

        const response = await fetch(`/api/cast-members/event/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                cast_member_id: Number(castMemberId)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error
                    ? `${data.message}: ${data.error}`
                    : data.message || 'No se pudo asociar el integrante.'
            );
        }

        associateCastMemberMessage.textContent =
            '¡Integrante asociado correctamente!';

        castMemberSelect.value = '';

        await loadTheaterCast(eventId);

    } catch (error) {
        console.error('Error al asociar integrante:', error);
        associateCastMemberMessage.textContent = error.message;

    } finally {
        associateCastMemberBtn.disabled = false;
        associateCastMemberBtn.textContent = 'Asociar Integrante';
    }
});



async function loadTheaterCast(eventId) {

    if (!eventId) {
        theaterCastTableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    Selecciona una obra para consultar sus integrantes.
                </td>
            </tr>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/cast-members/event/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron consultar los integrantes.'
            );
        }

        const assignedMembers = Array.isArray(data)
            ? data
            : data.castMembers || data.cast_members || data.data || [];

        if (assignedMembers.length === 0) {
            theaterCastTableBody.innerHTML = `
                <tr>
                    <td colspan="2">
                        Esta obra todavía no tiene integrantes asignados.
                    </td>
                </tr>
            `;
            return;
        }

        theaterCastTableBody.innerHTML = assignedMembers.map(member => `
            <tr>
                <td>${Number(member.cast_member_id)}</td>
                <td>${escapeHTML(member.name)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al consultar integrantes:', error);

        theaterCastTableBody.innerHTML = `
            <tr>
                <td colspan="2">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


theaterSelect.addEventListener('change', () => {
    associateCastMemberMessage.textContent = '';
    loadTheaterCast(theaterSelect.value);
});


associateCastMemberForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');
    const eventId = theaterSelect.value;
    const castMemberId = castMemberSelect.value;

    if (!token) {
        associateCastMemberMessage.textContent =
            'Debes iniciar sesión como administrador.';
        return;
    }

    if (!eventId || !castMemberId) {
        associateCastMemberMessage.textContent =
            'Selecciona una obra y un integrante.';
        return;
    }

    try {
        associateCastMemberBtn.disabled = true;
        associateCastMemberBtn.textContent = 'Asociando...';
        associateCastMemberMessage.textContent = '';

        const response = await fetch(`/api/cast-members/event/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                cast_member_id: Number(castMemberId)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error
                    ? `${data.message}: ${data.error}`
                    : data.message || 'No se pudo asociar el integrante.'
            );
        }

        associateCastMemberMessage.textContent =
            '¡Integrante asociado correctamente!';

        castMemberSelect.value = '';

        await loadTheaterCast(eventId);

    } catch (error) {
        console.error('Error al asociar integrante:', error);
        associateCastMemberMessage.textContent = error.message;

    } finally {
        associateCastMemberBtn.disabled = false;
        associateCastMemberBtn.textContent = 'Asociar Integrante';
    }
});


function populateArtistSelect() {

    artistSelect.innerHTML = `
        <option value="">Seleccionar artista</option>
    `;

    artists.forEach(artist => {
        const option = document.createElement('option');

        option.value = artist.artist_id;
        option.textContent = artist.name;

        artistSelect.appendChild(option);
    });
}
function populateCastMemberSelect() {

    castMemberSelect.innerHTML = `
        <option value="">Seleccionar integrante</option>
    `;

    castMembers.forEach(member => {
        const option = document.createElement('option');

        option.value = member.cast_member_id;
        option.textContent = member.name;

        castMemberSelect.appendChild(option);
    });
}


function renderArtists() {

    const searchText = searchArtist.value.trim().toLowerCase();

    const filteredArtists = artists.filter(artist =>
        (artist.name || '').toLowerCase().includes(searchText)
    );

    if (filteredArtists.length === 0) {
        artistsTableBody.innerHTML = `
            <tr><td colspan="3">No se encontraron artistas.</td></tr>
        `;
        return;
    }

    artistsTableBody.innerHTML = filteredArtists.map(artist => `
        <tr>
            <td>${Number(artist.artist_id)}</td>
            <td>${escapeHTML(artist.name)}</td>
            <td>
                <button
                    type="button"
                    class="delete-artist-btn"
                    data-id="${Number(artist.artist_id)}">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}



createArtistBtn.addEventListener('click', () => {
    createArtistForm.reset();
    artistFormMessage.textContent = '';
    saveArtistBtn.disabled = false;
    saveArtistBtn.textContent = 'Guardar Artista';

    artistFormSection.hidden = false;
    artistFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});


cancelArtistForm.addEventListener('click', () => {
    artistFormSection.hidden = true;
    createArtistForm.reset();
    artistFormMessage.textContent = '';
});


createArtistForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');
    const name = artistName.value.trim();

    if (!token) {
        artistFormMessage.textContent = 'Debes iniciar sesión como administrador.';
        return;
    }

    if (!name) {
        artistFormMessage.textContent = 'Escribe el nombre del artista.';
        return;
    }

    try {
        saveArtistBtn.disabled = true;
        saveArtistBtn.textContent = 'Guardando...';

        const response = await fetch('/api/artists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();
        console.log('Respuesta del backend:', data);

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo registrar el artista.');
        }

        artistFormMessage.textContent = '¡Artista registrado correctamente!';

        await loadArtists();

        setTimeout(() => {
            artistFormSection.hidden = true;
            createArtistForm.reset();
            artistFormMessage.textContent = '';
        }, 1200);

    } catch (error) {
        console.error('Error al registrar artista:', error);
        artistFormMessage.textContent = error.message;

    } finally {
        saveArtistBtn.disabled = false;
        saveArtistBtn.textContent = 'Guardar Artista';
    }
});


searchArtist.addEventListener('input', renderArtists);



artistsTableBody.addEventListener('click', async (event) => {

    const deleteButton = event.target.closest('.delete-artist-btn');

    if (!deleteButton) return;

    const artistId = Number(deleteButton.dataset.id);

    const selectedArtist = artists.find(
        artist => Number(artist.artist_id) === artistId
    );

    if (!selectedArtist) {
        alert('No se encontró el artista.');
        return;
    }

    if (!confirm(`¿Deseas eliminar al artista ${selectedArtist.name}?`)) {
        return;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión como administrador.');
        return;
    }

    try {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        const response = await fetch(`/api/artists/${artistId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo eliminar el artista.');
        }

        alert('Artista eliminado correctamente.');
        await loadArtists();

    } catch (error) {
        console.error('Error al eliminar artista:', error);
        alert(error.message);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Eliminar';
    }
});



async function loadCastMembers() {

    castMembersTableBody.innerHTML = `
        <tr><td colspan="3">Cargando elenco...</td></tr>
    `;

    try {
        const response = await fetch('/api/cast-members');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo cargar el elenco.');
        }

        castMembers = Array.isArray(data)
            ? data
            : data.castMembers || data.cast_members || data.data || [];

        if (!Array.isArray(castMembers)) {
            throw new Error('Formato de miembros del elenco no válido.');
        }

        renderCastMembers();
        populateCastMemberSelect();

    } catch (error) {
        console.error('Error al cargar elenco:', error);

        castMembersTableBody.innerHTML = `
            <tr><td colspan="3">${escapeHTML(error.message)}</td></tr>
        `;
    }
}


function renderCastMembers() {

    const searchText = searchCastMember.value.trim().toLowerCase();

    const filteredMembers = castMembers.filter(member =>
        (member.name || '').toLowerCase().includes(searchText)
    );

    if (filteredMembers.length === 0) {
        castMembersTableBody.innerHTML = `
            <tr><td colspan="3">No se encontraron miembros del elenco.</td></tr>
        `;
        return;
    }

    castMembersTableBody.innerHTML = filteredMembers.map(member => `
        <tr>
            <td>${Number(member.cast_member_id)}</td>
            <td>${escapeHTML(member.name)}</td>
            <td>
                <button
                    type="button"
                    class="delete-cast-member-btn"
                    data-id="${Number(member.cast_member_id)}">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}


createCastMemberBtn.addEventListener('click', () => {
    createCastMemberForm.reset();
    castMemberFormMessage.textContent = '';
    saveCastMemberBtn.disabled = false;
    saveCastMemberBtn.textContent = 'Guardar Actor';

    castMemberFormSection.hidden = false;
    castMemberFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});



cancelCastMemberForm.addEventListener('click', () => {
    castMemberFormSection.hidden = true;
    createCastMemberForm.reset();
    castMemberFormMessage.textContent = '';
});



createCastMemberForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const token = sessionStorage.getItem('token');
    const name = castMemberName.value.trim();

    if (!token) {
        castMemberFormMessage.textContent = 'Debes iniciar sesión como administrador.';
        return;
    }

    if (!name) {
        castMemberFormMessage.textContent = 'Escribe el nombre del actor.';
        return;
    }

    try {
        saveCastMemberBtn.disabled = true;
        saveCastMemberBtn.textContent = 'Guardando...';

        const response = await fetch('/api/cast-members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo registrar el actor.');
        }

        castMemberFormMessage.textContent = '¡Actor registrado correctamente!';

        await loadCastMembers();

        setTimeout(() => {
            castMemberFormSection.hidden = true;
            createCastMemberForm.reset();
            castMemberFormMessage.textContent = '';
        }, 1200);

    } catch (error) {
        console.error('Error al registrar actor:', error);
        castMemberFormMessage.textContent = error.message;

    } finally {
        saveCastMemberBtn.disabled = false;
        saveCastMemberBtn.textContent = 'Guardar Actor';
    }
});



searchCastMember.addEventListener('input', renderCastMembers);



castMembersTableBody.addEventListener('click', async (event) => {

    const deleteButton = event.target.closest('.delete-cast-member-btn');

    if (!deleteButton) return;

    const memberId = Number(deleteButton.dataset.id);

    const selectedMember = castMembers.find(
        member => Number(member.cast_member_id) === memberId
    );

    if (!selectedMember) {
        alert('No se encontró el miembro del elenco.');
        return;
    }

    if (!confirm(`¿Deseas eliminar a ${selectedMember.name}?`)) {
        return;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión como administrador.');
        return;
    }

    try {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        const response = await fetch(`/api/cast-members/${memberId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo eliminar el actor.');
        }

        alert('Miembro del elenco eliminado correctamente.');
        await loadCastMembers();

    } catch (error) {
        console.error('Error al eliminar miembro del elenco:', error);
        alert(error.message);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Eliminar';
    }
});


    searchEvent.addEventListener('input', renderEvents);


    filterCategory.addEventListener('change', renderEvents);

   
eventsTableBody.addEventListener('click', async (event) => {

    
const editButton = event.target.closest('.edit-event-btn');

if (editButton) {

    const eventId = Number(editButton.dataset.id);

    const selectedEvent = events.find(
        item => Number(item.event_id) === eventId
    );

    if (!selectedEvent) {
        alert('No se encontró el evento.');
        return;
    }

    editingEventId = eventId;

    
    document.getElementById('eventName').value =
        selectedEvent.name || '';

    document.getElementById('eventLocation').value =
        selectedEvent.location || '';

    const eventDate = new Date(selectedEvent.date_time);

    const localDate = new Date(
        eventDate.getTime() -
        eventDate.getTimezoneOffset() * 60000
    );

    document.getElementById('eventDate').value =
        localDate.toISOString().slice(0, 16);

    document.getElementById('eventCategory').value =
        selectedEvent.category || '';

    document.getElementById('minPrice').value =
        selectedEvent.min_price || 0;

    document.getElementById('maxPrice').value =
        selectedEvent.max_price || 0;

    document.getElementById('eventDescription').value =
        selectedEvent.description || '';

    eventImage.required = false;
    eventImage.value = '';

    if (selectedEvent.image_url) {
        eventImagePreview.src =
            `http://localhost:5000${selectedEvent.image_url}`;

        eventImagePreview.hidden = false;
    } else {
        eventImagePreview.src = '';
        eventImagePreview.hidden = true;
    }

    eventFormTitle.textContent = 'Editar Evento';
    saveEventBtn.textContent = 'Actualizar Evento';

    eventFormMessage.textContent = '';

    eventFormSection.hidden = false;

    eventFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    return;
}

    const deleteButton = event.target.closest('.delete-event-btn');

    if (!deleteButton) return;

    const eventId = deleteButton.dataset.id;
    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para eliminar eventos.');
        return;
    }

    const confirmed = confirm(
        '¿Estás seguro de que deseas eliminar este evento?'
    );

    if (!confirmed) return;

    try {

        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo eliminar el evento.'
            );
        }

        alert('Evento eliminado correctamente.');

        await loadEvents();

    } catch (error) {

        console.error('Error al eliminar evento:', error);

        alert(error.message);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Eliminar';
    }

});


const logoutAdminBtn = document.getElementById('logoutAdminBtn');

if (logoutAdminBtn) {
    logoutAdminBtn.addEventListener('click', () => {
        const confirmLogout = confirm(
            '¿Estás seguro de que deseas cerrar sesión?'
        );

        if (!confirmLogout) return;

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        window.location.href = './home.html';
    });
}

loadEvents();
loadUsers();
loadTickets();
loadDailySales();
loadArtists();
loadCastMembers();
loadReviews();
});
