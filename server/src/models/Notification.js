"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var notificationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    actorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['new_post', 'like', 'comment', 'follow'], required: true },
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' },
    read: { type: Boolean, default: false },
}, { timestamps: true });
var NotificationModel = mongoose_1.default.models.Notification || mongoose_1.default.model('Notification', notificationSchema);
exports.default = NotificationModel;
module.exports = NotificationModel;
