
document.addEventListener('DOMContentLoaded', async () => {

    const ticketsContainer = document.getElementById('ticketsContainer');
    const upcomingTab = document.getElementById('upcomingTab');
    const historyTab = document.getElementById('historyTab');

    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');

    if (!token || !userData) {
        window.location.href = './index.html';
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        window.location.href = './index.html';
        return;
    }

    if (!user.user_id) {
        window.location.href = './index.html';
        return;
    }

    let allTickets = [];
    let currentTab = 'upcoming';

    let eventImagesFromApi = new Map();

    let reviewedEventIds = new Set();

   
    let reviewsLoaded = false;



    async function loadEventImages() {
    try {
        const response = await fetch('http://localhost:5000/api/events');

        if (!response.ok) {
            throw new Error('No se pudieron consultar las imágenes.');
        }

        const events = await response.json();

        eventImagesFromApi = new Map(
            events.map(event => [
                Number(event.event_id),
                event.image_url
            ])
        );

    } catch (error) {
        console.error('Error cargando imágenes:', error);
    }
}

function getEventImage(eventId) {

    const imageUrl = eventImagesFromApi.get(Number(eventId));

    if (imageUrl) {
        return `http://localhost:5000${imageUrl}`;
    }

    const images = {
        2: './images/stray-kids.jpg',
        3: './images/hamlet.jpg',
        4: './images/junior-vs-jaguares.jpg',
        6: './images/coldplay.jpg',
        7: './images/narda.jpg',
        9: './images/santa-fe-vs-millonarios.jpg',
        10: './images/la-ultima-funcion.jpg'
    };

    return images[eventId] || '';
}
    

    async function loadUserReviews() {

        try {

            const response = await fetch(
                `/api/reviews/user/${user.user_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'No se pudieron consultar tus reseñas.'
                );
            }

            if (!Array.isArray(data)) {
                throw new Error('Formato de reseñas incorrecto.');
            }

            reviewedEventIds.clear();

            data.forEach(review => {
                reviewedEventIds.add(Number(review.event_id));
            });

            reviewsLoaded = true;

        } catch (error) {

            console.error('Error consultando reseñas:', error);
            reviewsLoaded = false;

        }
    }

   

    try {

        await loadUserReviews();

 
        await loadEventImages();
        await loadUserReviews();

       
        const response = await fetch(
            `/api/tickets/user/${user.user_id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudieron cargar las entradas.'
            );
        }

        if (!Array.isArray(data)) {
            throw new Error('Formato de respuesta incorrecto.');
        }

        allTickets = data;

        mostrarEntradas();

    } catch (error) {

        console.error('Error al cargar entradas:', error);

        ticketsContainer.textContent =
            'No fue posible cargar tus entradas.';

    }


    upcomingTab.addEventListener('click', () => {

        currentTab = 'upcoming';

        actualizarPestanas();
        mostrarEntradas();

    });

    historyTab.addEventListener('click', () => {

        currentTab = 'history';

        actualizarPestanas();
        mostrarEntradas();

    });

    function actualizarPestanas() {

        upcomingTab.classList.toggle(
            'active',
            currentTab === 'upcoming'
        );

        historyTab.classList.toggle(
            'active',
            currentTab === 'history'
        );

    }

   

    function mostrarEntradas() {

        ticketsContainer.innerHTML = '';

        const filteredTickets = allTickets.filter(ticket => {

            const status = ticket.current_status || ticket.status;

            return currentTab === 'upcoming'
                ? status === 'upcoming'
                : status === 'completed';

        });

        if (filteredTickets.length === 0) {

            ticketsContainer.innerHTML = `
                <div class="empty-tickets">

                    <h2>
                        ${currentTab === 'upcoming'
                            ? 'No tienes eventos próximos.'
                            : 'Todavía no tienes eventos en tu historial.'}
                    </h2>

                    <p>
                        Explora nuestro catálogo para descubrir nuevos eventos.
                    </p>

                    <a href="./catalog.html">
                        Explorar eventos
                    </a>

                </div>
            `;

            return;
        }

        filteredTickets.forEach(ticket => {

            const ticketCard = document.createElement('article');

            ticketCard.classList.add('ticket-card');

            ticketCard.dataset.eventId = String(ticket.event_id);

            const eventDate = new Date(ticket.event_date);

            const formattedDate = eventDate.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const formattedTime = eventDate.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const formattedPrice = Number(ticket.paid_price)
                .toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0
                });

            const categories = {
                concert: 'Concierto',
                sports: 'Deportes',
                theater: 'Teatro'
            };

            const status = ticket.current_status || ticket.status;

            const isUpcoming = status === 'upcoming';

            const hasReviewed = reviewedEventIds.has(
                Number(ticket.event_id)
            );

        

            ticketCard.innerHTML = `

                <div class="ticket-card-image"
                    style="background-image: url('${getEventImage(ticket.event_id)}')">
                </div>

                <div class="ticket-card-content">

                    <div class="ticket-card-header">

                        <span class="ticket-category">
                            ${categories[ticket.event_category] || ticket.event_category}
                        </span>

                        <span class="ticket-status">
                            ${isUpcoming ? 'Próxima' : 'Finalizada'}
                        </span>

                    </div>

                    <div class="ticket-card-info">

                        <h2>${ticket.event_name}</h2>

                        <p>
                            <strong>Fecha:</strong>
                            ${formattedDate}
                        </p>

                        <p>
                            <strong>Hora:</strong>
                            ${formattedTime}
                        </p>

                        <p>
                            <strong>Ubicación:</strong>
                            ${ticket.event_location}
                        </p>

                        <p>
                            <strong>Entrada:</strong>
                            #${ticket.ticket_id}
                        </p>

                        <p>
                            <strong>Precio pagado:</strong>
                            ${formattedPrice}
                        </p>

                    </div>

                    <button
                        class="view-ticket-button"
                        type="button">
                        Ver entrada
                    </button>

                    ${!isUpcoming ? `

                        <button
                            class="review-event-button"
                            type="button"
                            ${!reviewsLoaded || hasReviewed ? 'disabled' : ''}>

                            ${!reviewsLoaded
                                ? 'No se pudo verificar la reseña'
                                : hasReviewed
                                    ? 'Reseña publicada'
                                    : 'Calificar evento'}

                        </button>

                        ${!hasReviewed && reviewsLoaded ? `

                            <form class="review-form" hidden>

                                <h3>Califica tu experiencia</h3>

                                <label>Calificación</label>

                                <select name="rating" required>
                                    <option value="">
                                        Selecciona una calificación
                                    </option>

                                    <option value="5">5 estrellas - Excelente</option>
                                    <option value="4">4 estrellas - Muy bueno</option>
                                    <option value="3">3 estrellas - Bueno</option>
                                    <option value="2">2 estrellas - Regular</option>
                                    <option value="1">1 estrella - Malo</option>
                                </select>

                                <label>Comentario</label>

                                <textarea
                                    name="comment"
                                    placeholder="Cuéntanos cómo fue tu experiencia..."
                                    required></textarea>

                                <label>Calidad de la silla</label>

                                <input
                                    type="text"
                                    name="seat_quality"
                                    placeholder="Ej. Muy cómoda"
                                    required>

                                <label>Etiquetas</label>

                                <input
                                    type="text"
                                    name="tags"
                                    placeholder="Buena organización, Buen ambiente">

                                <button type="submit">
                                    Publicar reseña
                                </button>

                                <p class="review-message"></p>

                            </form>

                        ` : ''}

                    ` : ''}

                </div>
            `;

            ticketsContainer.appendChild(ticketCard);

          
            const viewButton = ticketCard.querySelector(
                '.view-ticket-button'
            );

            viewButton.addEventListener('click', () => {

                window.location.href =
                    `./ticket-detail.html?id=${ticket.ticket_id}`;

            });

       

            const reviewButton = ticketCard.querySelector(
                '.review-event-button'
            );

            const reviewForm = ticketCard.querySelector(
                '.review-form'
            );

            if (reviewButton && reviewForm) {

               
                reviewButton.addEventListener('click', () => {

                    reviewForm.hidden = !reviewForm.hidden;

                });

                
                reviewForm.addEventListener('submit', async (event) => {

                    event.preventDefault();

                    const message = reviewForm.querySelector(
                        '.review-message'
                    );

                    const submitButton = reviewForm.querySelector(
                        'button[type="submit"]'
                    );

                    const formData = new FormData(reviewForm);

                    const reviewData = {

                        event_id: Number(ticket.event_id),

                        rating: Number(formData.get('rating')),

                        comment: formData.get('comment').trim(),

                        seat_quality: formData.get('seat_quality').trim(),

                        tags: formData.get('tags')
                            .split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag !== '')

                    };

                    try {

                        submitButton.disabled = true;

                        message.textContent =
                            'Publicando reseña...';

                        const response = await fetch('/api/reviews', {

                            method: 'POST',

                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },

                            body: JSON.stringify(reviewData)

                        });

                        const data = await response.json();

                        if (!response.ok) {

                            throw new Error(
                                data.message ||
                                'No se pudo publicar la reseña.'
                            );

                        }

                    
                        reviewedEventIds.add(
                            Number(ticket.event_id)
                        );

                        
                        const sameEventCards = ticketsContainer.querySelectorAll(
                            `.ticket-card[data-event-id="${ticket.event_id}"]`
                        );

                        sameEventCards.forEach(card => {

                            const button = card.querySelector(
                                '.review-event-button'
                            );

                            const form = card.querySelector(
                                '.review-form'
                            );

                            if (button) {

                                button.textContent = 'Reseña publicada';

                                button.disabled = true;

                            }

                            if (form) {
                                form.hidden = true;
                            }

                        });

                        message.textContent =
                            '¡Tu reseña se publicó correctamente!';

                        reviewForm.reset();

                        alert(
                            '¡Tu reseña se publicó correctamente!'
                        );

                    } catch (error) {

                        console.error(
                            'Error publicando reseña:',
                            error
                        );

                        message.textContent = error.message;

                        submitButton.disabled = false;

                    }

                });

            }

        });

    }

});
