
const pool = require('../services/mysql.service');


async function getAllTickets() {
    const [rows] = await pool.query(`
        SELECT
            tickets.*,
            users.name AS user_name,
            users.email AS user_email,
            events.name AS event_name,
            events.location AS event_location,
            events.date_time AS event_date,
            events.category AS event_category
        FROM tickets
        INNER JOIN users
            ON tickets.user_id = users.user_id
        INNER JOIN events
            ON tickets.event_id = events.event_id
        ORDER BY tickets.purchase_date DESC
    `);

    return rows;
}


async function getTicketById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM tickets WHERE ticket_id = ?',
        [id]
    );
    return rows[0];
}

async function getTicketsByUserId(userId) {
    const [rows] = await pool.query(
        `SELECT
            tickets.*,
            events.name AS event_name,
            events.location AS event_location,
            events.date_time AS event_date,
            events.category AS event_category,
            events.description AS event_description,
            events.min_price,
            events.max_price,
            tickets.status AS current_status
         FROM tickets
         INNER JOIN events
            ON tickets.event_id = events.event_id
         WHERE tickets.user_id = ?`,
        [userId]
    );

    return rows;
}


async function completeFinishedEventTickets() {
    const [result] = await pool.query(
        `UPDATE tickets t
         INNER JOIN events e
            ON t.event_id = e.event_id
         SET t.status = 'completed'
         WHERE t.status = 'upcoming'
         AND TIMESTAMPADD(
            MINUTE,
            CASE e.category
                WHEN 'concert' THEN 180
                WHEN 'sports' THEN 120
                WHEN 'theater' THEN 150
                ELSE 180
            END,
            e.date_time
         ) <= NOW()`
    );

    return result.affectedRows;
}


async function getDailySales() {
    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS tickets_sold,
            COALESCE(SUM(paid_price), 0) AS total_sales
         FROM tickets
         WHERE DATE(purchase_date) = CURDATE()`
    );

    return rows[0];
}

async function createTicket(ticket) {

    const {
        user_id,
        event_id,
        paid_price,
        status,
        ticket_type
    } = ticket;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let seatNumber;
        let result;
        let inserted = false;

       
        for (let attempt = 0; attempt < 20; attempt++) {

            seatNumber = `S-${Math.floor(Math.random() * 9999) + 1}`;

            try {
                const [insertResult] = await connection.query(
                    `INSERT INTO tickets
                    (user_id, event_id, paid_price, status,
                     ticket_type, seat_number)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        user_id,
                        event_id,
                        paid_price,
                        status,
                        ticket_type,
                        seatNumber
                    ]
                );

                result = insertResult;
                inserted = true;
                break;

            } catch (error) {
              
                if (error.code !== 'ER_DUP_ENTRY') {
                    throw error;
                }
            }
        }

        if (!inserted) {
            throw new Error('No se pudo asignar una silla disponible.');
        }

        await connection.commit();

        return {
            ticket_id: result.insertId,
            seat_number: seatNumber
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

async function deleteTicket(id) {
    const [result] = await pool.query(
        'DELETE FROM tickets WHERE ticket_id = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
    createTicket,
    deleteTicket,
    getDailySales,
    completeFinishedEventTickets
};
