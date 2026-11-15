
const API_URL = 'http://localhost:5000/api/events';
const REVIEWS_API_URL = 'http://localhost:5000/api/reviews';

const eventDetails = document.getElementById('eventDetails');

const eventImages = {
    2: './images/stray-kids.jpg',
    3: './images/hamlet.jpg',
    4: './images/junior-vs-jaguares.jpg',
    6: './images/coldplay.jpg',
    7: './images/narda.jpg',
    9: './images/santa-fe-vs-millonarios.jpg',
    10: './images/la-ultima-funcion.jpg' 
};



async function loadEventDetails() {

    const params = new URLSearchParams(window.location.search);

    const eventId = params.get('id') ||
        sessionStorage.getItem('selectedEventId');

    if (!eventId) {
        eventDetails.innerHTML = `
            <p>No has seleccionado ningún evento.</p>
            <a href="./catalog.html">Volver al catálogo</a>
        `;
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${eventId}`);

        if (!response.ok) {
            throw new Error('No se pudo consultar el evento.');
        }

        const event = await response.json();

        let categoryDetails = '';

        if (event.category === 'concert') {
            categoryDetails = await loadConcertDetails(eventId);

        } else if (event.category === 'theater') {
            categoryDetails = await loadTheaterDetails(eventId);

        } else if (event.category === 'sports') {
            categoryDetails = await loadSportsDetails(eventId);
        }

        

        const date = new Date(event.date_time);

        const formattedDate = date.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Bogota'
        });

        const formattedTime = date.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Bogota'
        });

      

        const isPastEvent = date.getTime() < Date.now();


let eventImage = event.image_url || eventImages[eventId] || '';


if (
    !event.image_url &&
    event.name.trim().toLowerCase() === 'la última función'
) {
    eventImage = './images/la-ultima-funcion.jpg';
}
     

        eventDetails.innerHTML = `
            <article class="event-detail-card">

                <div class="event-detail-banner"
                     style="${eventImage
                        ? `background-image: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url('${eventImage}')`
                        : ''}">
                    ${getCategoryName(event.category)}
                </div>

                <div class="event-detail-content">

                    <span class="event-detail-category">
                        ${getCategoryName(event.category)}
                    </span>

                    <h1>${escapeHTML(event.name)}</h1>

                    <p>
                        <strong>Lugar:</strong>
                        ${escapeHTML(event.location)}
                    </p>

                    <p>
                        <strong>Fecha:</strong>
                        ${formattedDate}
                    </p>

                    <p>
                        <strong>Hora:</strong>
                        ${formattedTime}
                    </p>

                    <p>
                        <strong>Descripción:</strong><br>
                        ${escapeHTML(
                            event.description || 'Sin descripción disponible.'
                        )}
                    </p>

                    ${categoryDetails}

                    ${
                        isPastEvent
                        ? `
                            <div class="event-detail-price">
                                <h3>Evento finalizado</h3>

                                <p>
                                    Este evento ya se realizó.
                                    Ya no está disponible para compra.
                                </p>
                            </div>
                        `
                        : `
                            <div class="event-detail-price">

                                <h3>Precios de las entradas</h3>

                                <p>
                                    Desde ${formatPrice(event.min_price)}
                                    hasta ${formatPrice(event.max_price)}
                                </p>

                                <button
                                    class="buy-button"
                                    id="buyButton"
                                    type="button">
                                    Seleccionar entradas
                                </button>

                            </div>
                        `
                    }

                </div>
            </article>
        `;

     await loadEventReviews(eventId);

        const buyButton = document.getElementById('buyButton');

        if (buyButton) {

            buyButton.addEventListener('click', () => {

                const token = sessionStorage.getItem('token');

                if (!token) {
                    alert('Debes iniciar sesión para comprar entradas.');
                    window.location.href = './index.html';
                    return;
                }

                window.location.href =
                    `./select-tickets.html?id=${eventId}`;
            });
        }

    } catch (error) {

        console.error(error);

        eventDetails.innerHTML = `
            <p>No fue posible cargar los detalles del evento.</p>
            <a href="./catalog.html">Volver al catálogo</a>
        `;
    }
}




async function loadConcertDetails(eventId) {

    try {

        const response = await fetch(
            `${API_URL}/${eventId}/artists`
        );

        if (!response.ok) {
            throw new Error('No se pudieron consultar los artistas.');
        }

        const artists = await response.json();

        let artistsHTML = '';

        if (artists.length === 0) {

            artistsHTML = `
                <p>No hay artistas registrados para este concierto.</p>
            `;

        } else {

            artistsHTML = artists.map(artist => `
                <div class="category-detail-item">

                    <h4>${escapeHTML(artist.name)}</h4>

                    <p>
                        <strong>Hora de presentación:</strong>
                        ${formatPresentationTime(artist.presentation_time)}
                    </p>

                </div>
            `).join('');
        }

        return `
            <section class="category-detail-section">

                <h3>Artistas participantes</h3>

                ${artistsHTML}

            </section>
        `;

    } catch (error) {

        console.error('Error cargando artistas:', error);

        return `
            <section class="category-detail-section">
                <h3>Artistas participantes</h3>
                <p>No fue posible cargar la información de los artistas.</p>
            </section>
        `;
    }
}




async function loadTheaterDetails(eventId) {

    try {

        const [castResponse, intermissionsResponse] = await Promise.all([
            fetch(`${API_URL}/${eventId}/cast`),
            fetch(`${API_URL}/${eventId}/intermissions`)
        ]);

        let castHTML = '';
        let intermissionsHTML = '';

        if (castResponse.ok) {

            const cast = await castResponse.json();

            if (cast.length === 0) {

                castHTML = `
                    <p>No hay integrantes del elenco registrados.</p>
                `;

            } else {

                castHTML = cast.map(member => `
                    <div class="category-detail-item">
                        <p>${escapeHTML(member.name)}</p>
                    </div>
                `).join('');
            }

        } else {

            castHTML = `
                <p>No fue posible cargar el elenco.</p>
            `;
        }

        if (intermissionsResponse.ok) {

            const intermissions = await intermissionsResponse.json();

            intermissionsHTML = `
                <p>
                    ${escapeHTML(
                        intermissions.intermissions ||
                        'Sin información de intermedios.'
                    )}
                </p>
            `;

        } else {

            intermissionsHTML = `
                <p>No hay información de intermedios disponible.</p>
            `;
        }

        return `
            <section class="category-detail-section">

                <h3>Elenco</h3>

                ${castHTML}

            </section>

            <section class="category-detail-section">

                <h3>Intermedios</h3>

                ${intermissionsHTML}

            </section>
        `;

    } catch (error) {

        console.error('Error cargando información de teatro:', error);

        return `
            <section class="category-detail-section">
                <h3>Información de teatro</h3>
                <p>No fue posible cargar los detalles de la obra.</p>
            </section>
        `;
    }
}




async function loadSportsDetails(eventId) {

    try {

        const response = await fetch(
            `${API_URL}/${eventId}/sport-details`
        );

        if (!response.ok) {
            throw new Error('No se pudieron consultar los detalles deportivos.');
        }

        const details = await response.json();

        return `
            <section class="category-detail-section">

                <h3>Información del encuentro</h3>

                <div class="category-detail-item">

                    <p>
                        <strong>Equipo local:</strong>
                        ${escapeHTML(details.home_team)}
                    </p>

                    <p>
                        <strong>Equipo visitante:</strong>
                        ${escapeHTML(details.away_team)}
                    </p>

                    <div class="sports-scoreboard">

                        <h3>Marcador</h3>

                        <p>
                            ${escapeHTML(
                                details.scoreboard || 'Por definir'
                            )}
                        </p>

                    </div>

                </div>

            </section>
        `;

    } catch (error) {

        console.error('Error cargando detalles deportivos:', error);

        return `
            <section class="category-detail-section">
                <h3>Información del encuentro</h3>
                <p>No fue posible cargar los detalles deportivos.</p>
            </section>
        `;
    }
}




function formatPrice(price) {

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(price));
}


function formatPresentationTime(time) {

    if (!time) {
        return 'Por definir';
    }

    return String(time).slice(0, 5);
}


function getCategoryName(category) {

    const categories = {
        concert: 'Concierto',
        sports: 'Deportivo',
        theater: 'Teatro'
    };

    return categories[category] || category;
}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return characters[character];
    });
}



async function loadEventReviews(eventId) {
    const reviewsContainer = document.getElementById('reviewsContainer');

    if (!reviewsContainer) return;

    try {
        const response = await fetch(
            `${REVIEWS_API_URL}/event/${eventId}`
        );

        if (!response.ok) {
            throw new Error('No se pudieron cargar las reseñas.');
        }

        const reviews = await response.json();

        if (!Array.isArray(reviews) || reviews.length === 0) {
            reviewsContainer.innerHTML = `
                <p class="no-reviews">
                    Este evento todavía no tiene reseñas.
                </p>
            `;
            return;
        }

        const averageRating = reviews.reduce(
            (total, review) => total + Number(review.rating),
            0
        ) / reviews.length;

        const averageStars = '★'.repeat(
            Math.round(averageRating)
        ) + '☆'.repeat(5 - Math.round(averageRating));

        const reviewsHTML = reviews.map(review => {
            const rating = Number(review.rating);

            const stars = '★'.repeat(rating) +
                '☆'.repeat(5 - rating);

            const tagsHTML = Array.isArray(review.tags)
                ? review.tags.map(tag => `
                    <span class="review-tag">
                        ${escapeHTML(tag.name)}
                    </span>
                `).join('')
                : '';

            return `
                <article class="review-card">

                    <div class="review-card-header">
                        <h3>${escapeHTML(review.user_name || 'Usuario')}</h3>
                        <span class="review-stars">${stars}</span>
                    </div>

                    <p class="review-comment">
                        ${escapeHTML(review.comment)}
                    </p>

                   <p class="review-seat-quality">
                  <strong>Calidad de la silla:</strong>
                  ${escapeHTML(review.seat_quality || 'No especificada')}
                  </p>

                  <p class="review-seat-number">
                  <strong>Número de silla:</strong>
                  ${escapeHTML(review.seat_number || 'No disponible')}
                  </p>

                    <div class="review-tags">
                        ${tagsHTML}
                    </div>

                </article>
            `;
        }).join('');

        reviewsContainer.innerHTML = `
            <div class="reviews-summary">

                <span class="reviews-average">
                    ${averageRating.toFixed(1)}
                </span>

                <div>
                    <span class="review-stars">${averageStars}</span>
                    <p>${reviews.length} reseña(s)</p>
                </div>

            </div>

            <div class="reviews-list">
                ${reviewsHTML}
            </div>
        `;

    } catch (error) {
        console.error('Error cargando reseñas:', error);

        reviewsContainer.innerHTML = `
            <p class="no-reviews">
                No fue posible cargar las reseñas.
            </p>
        `;
    }
}


loadEventDetails();
