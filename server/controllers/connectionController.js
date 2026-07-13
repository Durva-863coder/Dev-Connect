const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Send a connection request to another developer
// @route   POST /api/connections/request/:userId
// @access  Private
const sendRequest = async (req, res, next) => {
  const receiverId = req.params.userId;
  const senderId = req.user._id;

  try {
    // 1. Can't request self
    if (receiverId.toString() === senderId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a connection request to yourself',
      });
    }

    // 2. Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Developer profile not found',
      });
    }

    // 3. Check for existing request in either direction
    const existingConn = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingConn) {
      if (existingConn.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'You are already connected with this developer',
        });
      }

      if (existingConn.status === 'pending') {
        if (existingConn.sender.toString() === senderId.toString()) {
          return res.status(400).json({
            success: false,
            message: 'Connection request is already pending',
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'This developer has already sent you a connection request. Please accept it instead.',
          });
        }
      }

      // If rejected, let's reset to pending and switch sender to current user
      if (existingConn.status === 'rejected') {
        existingConn.sender = senderId;
        existingConn.receiver = receiverId;
        existingConn.status = 'pending';
        await existingConn.save();
        return res.status(200).json({
          success: true,
          message: 'Connection request sent successfully',
          data: existingConn,
        });
      }
    }

    // 4. Create new pending connection record
    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a connection request
// @route   PUT /api/connections/accept/:connectionId
// @access  Private
const acceptRequest = async (req, res, next) => {
  const { connectionId } = req.params;

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    // Verify current user is receiver
    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this connection request',
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Connection request is already ${connection.status}`,
      });
    }

    connection.status = 'accepted';
    await connection.save();

    return res.status(200).json({
      success: true,
      message: 'Connection request accepted successfully',
      data: connection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a connection request
// @route   PUT /api/connections/reject/:connectionId
// @access  Private
const rejectRequest = async (req, res, next) => {
  const { connectionId } = req.params;

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    // Verify current user is receiver
    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this connection request',
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Connection request is already ${connection.status}`,
      });
    }

    connection.status = 'rejected';
    await connection.save();

    return res.status(200).json({
      success: true,
      message: 'Connection request rejected successfully',
      data: connection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an established connection or cancel a request
// @route   DELETE /api/connections/remove/:userId
// @access  Private
const removeConnection = async (req, res, next) => {
  const otherUserId = req.params.userId;
  const currentUserId = req.user._id;

  try {
    // Find record in either direction
    const connection = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'No active connection or pending request found between users',
      });
    }

    await Connection.findByIdAndDelete(connection._id);

    return res.status(200).json({
      success: true,
      message: 'Connection or request removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active connections and pending requests for the authenticated user
// @route   GET /api/connections
// @access  Private
const getConnections = async (req, res, next) => {
  const currentUserId = req.user._id;

  try {
    const connections = await Connection.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('sender', 'name username profilePicture bio location college')
      .populate('receiver', 'name username profilePicture bio location college');

    const accepted = [];
    const pendingIncoming = [];
    const pendingOutgoing = [];

    connections.forEach((conn) => {
      if (conn.status === 'accepted') {
        const otherUser =
          conn.sender._id.toString() === currentUserId.toString()
            ? conn.receiver
            : conn.sender;
        accepted.push({
          connectionId: conn._id,
          user: otherUser,
          createdAt: conn.createdAt,
        });
      } else if (conn.status === 'pending') {
        if (conn.receiver._id.toString() === currentUserId.toString()) {
          pendingIncoming.push({
            connectionId: conn._id,
            user: conn.sender,
            createdAt: conn.createdAt,
          });
        } else {
          pendingOutgoing.push({
            connectionId: conn._id,
            user: conn.receiver,
            createdAt: conn.createdAt,
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Connections retrieved successfully',
      data: {
        accepted,
        pendingIncoming,
        pendingOutgoing,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
  getConnections,
};
