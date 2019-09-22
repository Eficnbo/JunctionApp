const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Auth } = require('@hackjunction/shared');

const { hasToken } = require('../../common/middleware/token');
const { hasPermission } = require('../../common/middleware/permissions');
const { isEventOrganiser } = require('../../common/middleware/events');

const EmailTaskController = require('./controller');

const sendPreviewEmail = asyncHandler(async (req, res) => {
    await EmailTaskController.sendPreviewEmail(req.body.to, req.body.params);
    return res.status(200).json({});
});

router
    .route('/:slug/preview')
    .post(hasToken, hasPermission(Auth.Permissions.MANAGE_EVENT), isEventOrganiser, sendPreviewEmail);

module.exports = router;
