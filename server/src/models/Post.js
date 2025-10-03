"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var commentSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
var postSchema = new mongoose_1.default.Schema({
    authorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    contentText: { type: String },
    imageUrl: { type: String },
    locationCity: { type: String },
    locationSpot: { type: String },
    fishType: { type: String },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
}, { timestamps: true });
var PostModel = mongoose_1.default.models.Post || mongoose_1.default.model('Post', postSchema);
exports.default = PostModel;
module.exports = PostModel;
