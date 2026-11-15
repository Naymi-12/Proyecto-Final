const pool = require('../services/mysql.service');


async function getAllCastMembers() {
    const [rows] = await pool.query(
        'SELECT * FROM cast_members'
    );

    return rows;
}


async function getCastMemberById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM cast_members WHERE cast_member_id = ?',
        [id]
    );

    return rows[0];
}


async function createCastMember(castMember) {
    const { name } = castMember;

    const [result] = await pool.query(
        'INSERT INTO cast_members (name) VALUES (?)',
        [name]
    );

    return result.insertId;
}


async function deleteCastMember(id) {
    const [result] = await pool.query(
        'DELETE FROM cast_members WHERE cast_member_id = ?',
        [id]
    );

    return result.affectedRows;
}

async function getCastMembersByEventId(eventId) {
    const [rows] = await pool.query(
        `SELECT
            cm.cast_member_id,
            cm.name
        FROM cast_members cm
        INNER JOIN theater_cast tc
            ON cm.cast_member_id = tc.cast_member_id
        WHERE tc.event_id = ?`,
        [eventId]
    );

    return rows;
}


async function addCastMemberToTheater(eventId, castMemberId) {
    const [result] = await pool.query(
        `INSERT INTO theater_cast (event_id, cast_member_id)
         VALUES (?, ?)`,
        [eventId, castMemberId]
    );

    return result.affectedRows;
}
module.exports = {
    getAllCastMembers,
    getCastMemberById,
    createCastMember,
    deleteCastMember,
    getCastMembersByEventId,
    addCastMemberToTheater,
};