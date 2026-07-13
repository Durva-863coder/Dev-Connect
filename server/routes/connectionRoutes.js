const express = require('express');
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
  getConnections,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/request/:userId', protect, sendRequest);
router.put('/accept/:connectionId', protect, acceptRequest);
router.put('/reject/:connectionId', protect, rejectRequest);
router.delete('/remove/:userId', protect, removeConnection);
router.get('/', protect, getConnections);

module.exports = router;
