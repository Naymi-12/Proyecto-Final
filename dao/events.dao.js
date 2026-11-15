const pool = require('../services/mysql.service');

async function getAllEvents(category) {
    let query = 'SELECT * FROM events';
    const values = [];

    if (category) {
        query += ' WHERE category = ?';
        values.push(category);
    }

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getEventById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM events WHERE event_id = ?',
        [id]
    );
    return rows[0];
}



async function createEvent(event) {
    const {
        name,
        location,
        date_time,
        category,
        min_price,
        max_price,
        description,
        image_url
    } = event;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO events
            (
                name,
                location,
                date_time,
                category,
                min_price,
                max_price,
                description,
                image_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                location,
                date_time,
                category,
                min_price,
                max_price,
                description,
                image_url
            ]
        );

        const eventId = result.insertId;

       if (category === 'concert') {
    await connection.query(
        `INSERT INTO concert_details
         (event_id, presentation_schedule)
         VALUES (?, ?)`,
        [eventId, 'Horario pendiente']
    );
}

        await connection.commit();

        return eventId;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}


async function updateEvent(id, event) {
    const {
        name,
        location,
        date_time,
        category,
        min_price,
        max_price,
        description,
        image_url
    } = event;

    const [result] = await pool.query(
        `UPDATE events
        SET name = ?,
            location = ?,
            date_time = ?,
            category = ?,
            min_price = ?,
            max_price = ?,
            description = ?,
            image_url = ?
        WHERE event_id = ?`,
        [
            name,
            location,
            date_time,
            category,
            min_price,
            max_price,
            description,
            image_url,
            id
        ]
    );

    return result;
}
async function patchEvent(id, event) {
    const fields = [];
    const values = [];

    const allowedFields = [
        'name',
        'location',
        'date_time',
        'category',
        'min_price',
        'max_price',
        'description'
    ];

    for (const field of allowedFields) {
        if (event[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(event[field]);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const [result] = await pool.query(
        `UPDATE events SET ${fields.join(', ')} WHERE event_id = ?`,
        values
    );

    return result;
}

async function deleteEvent(id) {
    const [result] = await pool.query(
        'DELETE FROM events WHERE event_id = ?',
        [id]
    );

    return result;
}
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    patchEvent,
    deleteEvent
};