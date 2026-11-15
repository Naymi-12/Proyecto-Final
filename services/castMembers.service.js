const castMembersDAO = require('../dao/castMembers.dao');


async function getAllCastMembers() {
    return await castMembersDAO.getAllCastMembers();
}


async function getCastMemberById(id) {
    return await castMembersDAO.getCastMemberById(id);
}


async function createCastMember(castMember) {
    return await castMembersDAO.createCastMember(castMember);
}


async function deleteCastMember(id) {
    return await castMembersDAO.deleteCastMember(id);
}
async function getCastMembersByEventId(eventId) {
    return await castMembersDAO.getCastMembersByEventId(eventId);
}


async function addCastMemberToTheater(eventId, castMemberId) {
    return await castMembersDAO.addCastMemberToTheater(eventId, castMemberId);
}

module.exports = {
    getAllCastMembers,
    getCastMemberById,
    createCastMember,
    deleteCastMember,
    getCastMembersByEventId,
    addCastMemberToTheater  
};