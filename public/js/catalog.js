
const API_URL = 'http://localhost:5000/api/events';

const catalogEvents = document.getElementById('catalogEvents');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const eventCount = document.getElementById('eventCount');
const pagination = document.getElementById('pagination');

let allEvents = [];
let currentPage = 1;
const eventsPerPage = 3;

async function loadCatalogEvents() {
    try {
        catalogEvents.innerHTML = '<p>Cargando eventos...</p>';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('No se pudieron obtener los eventos.');
        }

        const events = await response.json();

        allEvents = events.filter(event =>
            event.name &&
            new Date(event.date_time) > new Date()
        );

        applyFilters();

    } catch (error) {
        console.error(error);

        catalogEvents.innerHTML =
            '<p>No fue posible cargar los eventos. Intenta nuevamente.</p>';

        eventCount.textContent = 'Error al cargar';
    }
}

function applyFilters() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    let filteredEvents = allEvents.filter(event => {
        const matchesName = event.name.toLowerCase().includes(search);

        const matchesCategory =
            category === 'all' || event.category === category;

        return matchesName && matchesCategory;
    });

    filteredEvents.sort((a, b) =>
        new Date(a.date_time) - new Date(b.date_time)
    );

    renderEvents(filteredEvents);
}

function renderEvents(events) {
    eventCount.textContent =
        `${events.length} evento(s) encontrado(s)`;

    if (events.length === 0) {
        catalogEvents.innerHTML =
            '<p>No se encontraron eventos disponibles.</p>';

        pagination.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(events.length / eventsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * eventsPerPage;
    const pageEvents = events.slice(start, start + eventsPerPage);

     const getImageUrl = (event) => {
    if (event.image_url) {
        return `http://localhost:5000${event.image_url}`;
    }

    return getEventImage(event.event_id);
};

    catalogEvents.innerHTML = pageEvents.map(event => {
        const date = new Date(event.date_time);

        const formattedDate = date.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Bogota'
        });

        return `
            <article class="event-card">
                <div class="event-image ${event.category}"
         style="background-image: url('${getImageUrl(event)}')">
       <span>${getCategoryName(event.category)}</span>
     </div>

                <div class="event-info">
                    <span class="event-category">
                        ${getCategoryName(event.category)}
                    </span>

                    <h3>${escapeHTML(event.name)}</h3>

                    <p>${escapeHTML(event.location)}</p>
                    <p>${formattedDate}</p>

                    <div class="event-bottom">
                        <span>
                            ${formatPrice(event.min_price)}
                            -
                            ${formatPrice(event.max_price)}
                        </span>

                        <button
                            class="event-button"
                            onclick="selectEvent(${Number(event.event_id)})">
                            Ver evento
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const previousButton = document.createElement('button');
    previousButton.textContent = 'Anterior';
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener('click', () => {
        currentPage--;
        applyFilters();
    });

    pagination.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');

        button.textContent = page;

        if (page === currentPage) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentPage = page;
            applyFilters();
        });

        pagination.appendChild(button);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener('click', () => {
        currentPage++;
        applyFilters();
    });

    pagination.appendChild(nextButton);
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

function selectEvent(eventId) {
    sessionStorage.setItem('selectedEventId', eventId);
    window.location.href = './event.html';
}
searchInput.addEventListener('input', () => {
    currentPage = 1;
    applyFilters();
});

categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});

loadCatalogEvents();
