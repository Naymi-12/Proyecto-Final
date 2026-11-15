
const express = require('express');
const router = express.Router();

const castMembersController = require('../controllers/castMembers.controller');

const verifyToken = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/authorize.middleware');


/**
 * @swagger
 * /api/cast-members:
 *   get:
 *     summary: Retrieve all cast members
 *     description: Returns a list of all registered cast members.
 *     tags: [Cast Members]
 *     responses:
 *       200:
 *         description: Cast members retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/', castMembersController.getAllCastMembers);


/**
 * @swagger
 * /api/cast-members/event/{id}:
 *   get:
 *     summary: Retrieve cast members assigned to a theater event
 *     description: Returns all cast members associated with a specific theater event.
 *     tags: [Cast Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Theater event ID.
 *     responses:
 *       200:
 *         description: Cast members retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cast_member_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Example
 *       500:
 *         description: Internal server error.
 */
router.get('/event/:id', castMembersController.getCastMembersByEventId);


/**
 * @swagger
 * /api/cast-members/{id}:
 *   get:
 *     summary: Retrieve a cast member by ID
 *     description: Returns the information of a specific cast member.
 *     tags: [Cast Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cast member ID.
 *     responses:
 *       200:
 *         description: Cast member retrieved successfully.
 *       404:
 *         description: Cast member not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', castMembersController.getCastMemberById);


/**
 * @swagger
 * /api/cast-members:
 *   post:
 *     summary: Create a new cast member
 *     description: Registers a new cast member. Only administrators can perform this operation.
 *     tags: [Cast Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Example
 *     responses:
 *       201:
 *         description: Cast member created successfully.
 *       400:
 *         description: Cast member name is missing or empty.
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator permissions are required.
 *       500:
 *         description: Internal server error.
 */
router.post('/', verifyToken, requireAdmin, castMembersController.createCastMember);


/**
 * @swagger
 * /api/cast-members/event/{id}:
 *   post:
 *     summary: Assign a cast member to a theater event
 *     description: Associates an existing cast member with a theater event. Only administrators can perform this operation.
 *     tags: [Cast Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Theater event ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cast_member_id
 *             properties:
 *               cast_member_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cast member assigned successfully.
 *       400:
 *         description: Invalid cast member ID or event is not a theater.
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator permissions are required.
 *       404:
 *         description: Theater event or cast member not found.
 *       409:
 *         description: Cast member is already assigned to this theater.
 *       500:
 *         description: Internal server error.
 */
router.post(
    '/event/:id',
    verifyToken,
    requireAdmin,
    castMembersController.addCastMemberToTheater
);


/**
 * @swagger
 * /api/cast-members/{id}:
 *   delete:
 *     summary: Delete a cast member
 *     description: Deletes an existing cast member. Only administrators can perform this operation.
 *     tags: [Cast Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cast member ID.
 *     responses:
 *       200:
 *         description: Cast member deleted successfully.
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator permissions are required.
 *       404:
 *         description: Cast member not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', verifyToken, requireAdmin, castMembersController.deleteCastMember);


module.exports = router;
