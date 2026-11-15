
document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('ticketDetailContainer');

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

    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get('id');

    if (!ticketId || !user.user_id) {
        container.textContent = 'No se encontró la entrada solicitada.';
        return;
    }

    const eventImages = {
        2: './images/stray-kids.jpg',
        3: './images/hamlet.jpg',
        4: './images/junior-vs-jaguares.jpg',
        6: './images/coldplay.jpg',
        7: './images/narda.jpg',
        9: './images/santa-fe-vs-millonarios.jpg'
    };

    try {
        const response = await fetch(
            `/api/tickets/user/${user.user_id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
            throw new Error('No se pudieron cargar las entradas.');
        }

        const ticket = data.find(
            item => String(item.ticket_id) === ticketId
        );

        if (!ticket) {
            container.textContent = 'No se encontró esta entrada.';
            return;
        }

        const eventDate = new Date(ticket.event_date);
        const purchaseDate = new Date(ticket.purchase_date);

        const formattedDate = eventDate.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Bogota'
        });

        const formattedTime = eventDate.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Bogota'
        });

        const formattedPurchase = purchaseDate.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Bogota'
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

        const ticketTypes = {
            'Platea VIP': 'Platea VIP',
            'General Preferencial': 'General Preferencial'
        };

        const status = ticket.current_status || ticket.status;
        const isUpcoming = status === 'upcoming';

       
let image = eventImages[ticket.event_id] || '';

if (
    ticket.event_name &&
    ticket.event_name.trim().toLowerCase() === 'la última función'
) {
    image = './images/la-ultima-funcion.jpg';
}


try {
    const eventResponse = await fetch(
        `http://localhost:5000/api/events/${ticket.event_id}`
    );

    if (eventResponse.ok) {
        const eventData = await eventResponse.json();

        if (eventData.image_url) {
            image = `http://localhost:5000${eventData.image_url}`;
        }
    }
} catch (error) {
    console.error('No se pudo cargar la imagen del evento:', error);
}

        container.innerHTML = `
            <article class="ticket-detail-card">

                <div class="ticket-detail-image"
                     style="background-image: url('${image}')">
                </div>

                <div class="ticket-detail-heading">
                    <div>
                        <h1>${ticket.event_name}</h1>

                        <div class="ticket-detail-badges">
                            <span class="ticket-category">
                                ${categories[ticket.event_category] || ticket.event_category}
                            </span>

                            <span class="ticket-status">
                                ${isUpcoming ? 'Próxima' : 'Finalizada'}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="ticket-detail-information">

                    <div class="ticket-event-column">

                        <div class="ticket-event-information">

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
                                <strong>Compra realizada:</strong>
                                ${formattedPurchase}
                            </p>

                        </div>

                        <a
                            href="./event.html?id=${ticket.event_id}"
                            class="event-information-button">
                            Ver información del evento
                        </a>

                    </div>

                    <div class="ticket-purchase-information">

                        <h2>🎟️ Tu entrada</h2>

                        <div class="ticket-data-grid">

                            <div class="ticket-data-item">
                                <span>Número de entrada</span>
                                <strong>#${ticket.ticket_id}</strong>
                            </div>

                            <div class="ticket-data-item">
                                <span>Precio pagado</span>
                                <strong>${formattedPrice}</strong>
                            </div>

                            <div class="ticket-data-item">
                                <span>Categoría</span>
                                <strong>
                                    ${categories[ticket.event_category] || ticket.event_category}
                                </strong>
                            </div>

                            <div class="ticket-data-item">
                                <span>Estado</span>
                                <strong>${isUpcoming ? 'Próxima' : 'Finalizada'}</strong>
                            </div>

                            <div class="ticket-data-item">
                                <span>Tipo de entrada</span>
                                <strong>
                                    ${ticketTypes[ticket.ticket_type] || ticket.ticket_type || 'No disponible'}
                                </strong>
                            </div>

                            <div class="ticket-data-item">
                                <span>Número de silla</span>
                                <strong>
                                    ${ticket.seat_number || 'No asignada'}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </article>
        `;

    } catch (error) {
        console.error('Error al cargar la entrada:', error);
        container.textContent =
            'No fue posible cargar la información de esta entrada.';
    }

});
