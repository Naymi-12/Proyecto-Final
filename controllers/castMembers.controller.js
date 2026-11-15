const castMembersService = require('../services/castMembers.service');

async function getAllCastMembers(req, res) {
    try {
        const castMembers = await castMembersService.getAllCastMembers();

        return res.status(200).json(castMembers);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving cast members',
            error: error.message
        });
    }
}


async function getCastMemberById(req, res) {
    try {
        const castMember = await castMembersService.getCastMemberById(req.params.id);

        if (!castMember) {
            return res.status(404).json({
                message: 'Cast member not found'
            });
        }

        return res.status(200).json(castMember);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving cast member',
            error: error.message
        });
    }
}


async function createCastMember(req, res) {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: 'Cast member name is required'
            });
        }

        const castMemberId = await castMembersService.createCastMember({
            name: name.trim()
        });

        return res.status(201).json({
            message: 'Cast member created successfully',
            cast_member_id: castMemberId
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error creating cast member',
            error: error.message
        });
    }
}


async function deleteCastMember(req, res) {
    try {
        const id = req.params.id;

        const castMember = await castMembersService.getCastMemberById(id);

        if (!castMember) {
            return res.status(404).json({
                message: 'Cast member not found'
            });
        }

        await castMembersService.deleteCastMember(id);

        return res.status(200).json({
            message: 'Cast member deleted successfully',
            cast_member_id: id
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting cast member',
            error: error.message
        });
    }
}

async function getCastMembersByEventId(req, res) {
    try {
        const eventId = req.params.id;

        const castMembers = await castMembersService.getCastMembersByEventId(eventId);

        return res.status(200).json(castMembers);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving cast members for theater',
            error: error.message
        });
    }
}


async function addCastMemberToTheater(req, res) {
    try {
        const eventId = req.params.id;
        const { cast_member_id } = req.body;

        if (!cast_member_id || !Number.isInteger(Number(cast_member_id))) {
            return res.status(400).json({
                message: 'A valid cast member ID is required'
            });
        }

        const eventsService = require('../services/events.service');
        const theater = await eventsService.getEventById(eventId);

        if (!theater) {
            return res.status(404).json({
                message: 'Theater event not found'
            });
        }

        if (theater.category !== 'theater') {
            return res.status(400).json({
                message: 'Cast members can only be assigned to theater events'
            });
        }

        const castMember = await castMembersService.getCastMemberById(cast_member_id);

        if (!castMember) {
            return res.status(404).json({
                message: 'Cast member not found'
            });
        }

        await castMembersService.addCastMemberToTheater(eventId, cast_member_id);

        return res.status(201).json({
            message: 'Cast member assigned to theater successfully',
            event_id: Number(eventId),
            cast_member_id: Number(cast_member_id)
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'This cast member is already assigned to this theater'
            });
        }

        return res.status(500).json({
            message: 'Error assigning cast member to theater',
            error: error.message
        });
    }

}

module.exports = {
    getAllCastMembers,
    getCastMemberById,
    createCastMember,
    deleteCastMember,
    getCastMembersByEventId,
    addCastMemberToTheater  
};