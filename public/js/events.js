
const API_URL = 'http://localhost:5000/api/events';

const featuredEvents = document.getElementById('featuredEvents');

async function loadEvents() {
    try {
        featuredEvents.innerHTML = '<p>Cargando eventos...</p>';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('No se pudieron cargar los eventos.');
        }

        const events = await response.json();

        
        const upcomingEvents = events
            .filter(event =>
                event.name &&
                new Date(event.date_time) > new Date()
            )
            .sort((a, b) =>
                new Date(a.date_time) - new Date(b.date_time)
            );

       
        const featured = upcomingEvents.slice(0, 3);

        if (featured.length === 0) {
            featuredEvents.innerHTML =
                '<p>No hay eventos disponibles próximamente.</p>';
            return;
        }

        featuredEvents.innerHTML = featured.map(event => {
            const date = new Date(event.date_time);

            const formattedDate = date.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'America/Bogota'
            });

            const minPrice = formatPrice(event.min_price);
            const maxPrice = formatPrice(event.max_price);

            const category = getCategoryName(event.category);
            const image = event.image_url
    ? `http://localhost:5000${event.image_url}`
    : getEventImage(event.event_id);

            return `
                <article class="event-card">
                   <div class="event-image ${event.category}"
    style="background-image: url('${image}')">
    <span>${category}</span>
</div>

                    <div class="event-info">
                        <span class="event-category">${category}</span>

                        <h3>${escapeHTML(event.name)}</h3>

                        <p>${escapeHTML(event.location)}</p>
                        <p>${formattedDate}</p>

                        <div class="event-bottom">
                            <span>${minPrice} - ${maxPrice}</span>

                            <button
                                class="event-button"
                                onclick="goToCatalog(${event.event_id})">
                                Ver evento
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

    } catch (error) {
        console.error(error);

        featuredEvents.innerHTML = `
            <p class="error-message">
                No fue posible cargar los eventos.
                Intenta nuevamente más tarde.
            </p>
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

function getCategoryName(category) {
    const categories = {
        concert: 'Concierto',
        sports: 'Deportivo',
        theater: 'Teatro'
    };

    return categories[category] || category;
}

function getEventImage(eventId) {
    const images = {
        2: './images/stray-kids.jpg',
        3: './images/hamlet.jpg',
        4: './images/junior-vs-jaguares.jpg',
        6: './images/coldplay.jpg',
        7: './images/narda.jpg',
        9: './images/santa-fe-vs-millonarios.jpg'
    };

    return images[eventId] || '';
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

function goToCatalog(eventId) {
    sessionStorage.setItem('selectedEventId', eventId);
    window.location.href = './event.html';
}

loadEvents();
