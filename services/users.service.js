
const usersDAO = require('../dao/users.dao');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

async function getAllUsers() {
  return await usersDAO.getAllUsers();
}

async function getUserById(id) {
  return await usersDAO.getUserById(id);
}

async function getUserByEmail(email) {
  return await usersDAO.getUserByEmail(email);
}

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function createUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  return await usersDAO.createUser({
    ...user,
    password: hashedPassword
  });
}

async function updateUser(id, user) {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  return await usersDAO.updateUser(id, {
    ...user,
    password: hashedPassword
  });
}


async function patchUser(id, user) {
    const updatedUser = { ...user };

    if (updatedUser.password !== undefined) {
        updatedUser.password = await bcrypt.hash(
            updatedUser.password,
            SALT_ROUNDS
        );
    }

    return await usersDAO.patchUser(id, updatedUser);
}

async function deleteUser(id) {
  return await usersDAO.deleteUser(id);
}

async function getUserTickets(id) {
  return await usersDAO.getUserTickets(id);
}

async function getUserReviews(id) {
  return await usersDAO.getUserReviews(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  verifyPassword,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  getUserTickets,
  getUserReviews
};
