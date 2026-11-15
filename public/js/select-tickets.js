
const API_URL = 'http://localhost:5000/api/events';
const TICKETS_URL = 'http://localhost:5000/api/tickets';

const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');

let selectedEvent = null;

const eventImages = {
    2: './images/stray-kids.jpg',
    3: './images/hamlet.jpg',
    4: './images/junior-vs-jaguares.jpg',
    6: './images/coldplay.jpg',
    7: './images/narda.jpg',
    9: './images/santa-fe-vs-millonarios.jpg'
};

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(price));
}

function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Bogota'
    });
}

function formatTime(dateValue) {
    return new Date(dateValue).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota'
    });
}

function getSelectedTicketType() {
    const selected = document.querySelector(
        'input[name="ticketType"]:checked'
    );

    return selected ? selected.value : null;
}

function getSelectedPrice() {
    if (!selectedEvent) return 0;

    return getSelectedTicketType() === 'Platea VIP'
        ? Number(selectedEvent.max_price)
        : Number(selectedEvent.min_price);
}

function updateTotal() {
    if (!selectedEvent) return;

    document.getElementById('totalPrice').textContent =
        `${formatPrice(getSelectedPrice())} COP`;
}

async function loadEvent() {
    if (!eventId) {
        alert('No se seleccionó ningún evento.');
        window.location.href = './catalog.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${eventId}`);

        if (!response.ok) {
            throw new Error('No se pudo cargar el evento.');
        }

        selectedEvent = await response.json();

        const categories = {
            concert: 'Música en Vivo',
            sports: 'Deportes',
            theater: 'Teatro'
        };

        const image = selectedEvent.image_url || eventImages[eventId];

const eventImageElement = document.getElementById('eventImage');

if (image) {
    eventImageElement.style.backgroundImage =
        `url('${image}')`;
} else {
    eventImageElement.style.backgroundImage = 'none';
}
        document.getElementById('eventCategory').textContent =
            categories[selectedEvent.category] || selectedEvent.category;

        document.getElementById('eventName').textContent =
            selectedEvent.name;

        document.getElementById('eventDate').textContent =
            formatDate(selectedEvent.date_time);

        document.getElementById('eventTime').textContent =
            formatTime(selectedEvent.date_time);

        document.getElementById('eventLocation').textContent =
            selectedEvent.location;

        document.getElementById('eventDescription').textContent =
            selectedEvent.description || 'Sin descripción disponible.';

        document.getElementById('vipPrice').textContent =
            formatPrice(selectedEvent.max_price);

        document.getElementById('generalPrice').textContent =
            formatPrice(selectedEvent.min_price);

        updateTotal();

    } catch (error) {
        console.error('Error cargando evento:', error);
        document.getElementById('eventName').textContent =
            'No fue posible cargar el evento.';
    }
}


document.querySelectorAll('input[name="ticketType"]').forEach(input => {
    input.addEventListener('change', updateTotal);
});


document.getElementById('backButton').addEventListener('click', event => {
    event.preventDefault();
    window.location.href = `./event.html?id=${eventId}`;
});


document.getElementById('buyButton').addEventListener('click', async () => {

    const token = sessionStorage.getItem('token');
    const buyButton = document.getElementById('buyButton');
    const message = document.getElementById('purchaseMessage');

    if (!token) {
        alert('Debes iniciar sesión para comprar entradas.');
        window.location.href = './index.html';
        return;
    }

    if (!selectedEvent) {
        message.textContent = 'No se ha podido cargar el evento.';
        return;
    }

    const ticketType = getSelectedTicketType();
    const paidPrice = getSelectedPrice();

    if (!ticketType || paidPrice <= 0) {
        message.textContent = 'Selecciona una localidad válida.';
        return;
    }

    try {
        buyButton.disabled = true;
        buyButton.textContent = 'Procesando compra...';
        message.textContent = '';

        const response = await fetch(TICKETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                event_id: Number(eventId),
                ticket_type: ticketType,
                paid_price: paidPrice
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo completar la compra.'
            );
        }

        alert(
            `¡Compra realizada exitosamente!\n` +
            `Localidad: ${data.ticket_type}\n` +
            `Silla asignada: ${data.seat_number}`
        );

        window.location.href =
            `./ticket-detail.html?id=${data.ticket_id}`;

    } catch (error) {
        console.error('Error al comprar:', error);
        message.textContent = error.message;

        buyButton.disabled = false;
        buyButton.textContent = 'Comprar Entrada';
    }
});

loadEvent();
