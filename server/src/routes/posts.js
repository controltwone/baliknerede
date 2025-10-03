"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Post_1 = require("../models/Post");
var auth_1 = require("../middleware/auth");
var Notification_1 = require("../models/Notification");
var User_1 = require("../models/User");
var Report_1 = require("../models/Report");
var DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";
var router = express_1.default.Router();
// GET /posts - list latest posts (with author name) - with pagination
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, skip, posts, totalPosts, hasMore, authHeader, token, jwt, payload, userId_1, user, followingIds_1, postsWithLikes, e_1, postsWithDefaults;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(req.query.page) || 1;
                limit = parseInt(req.query.limit) || 20;
                skip = (page - 1) * limit;
                return [4 /*yield*/, Post_1.default
                        .find()
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate('authorId', 'name avatarUrl')
                    // Get total count for pagination info
                ];
            case 1:
                posts = _a.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 2:
                totalPosts = _a.sent();
                hasMore = skip + posts.length < totalPosts;
                authHeader = req.headers.authorization;
                token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : null;
                if (!token) return [3 /*break*/, 7];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('jsonwebtoken'); })];
            case 4:
                jwt = _a.sent();
                payload = jwt.default.verify(token, process.env.JWT_SECRET || 'dev_secret');
                userId_1 = payload.sub;
                return [4 /*yield*/, User_1.default.findById(userId_1)];
            case 5:
                user = _a.sent();
                followingIds_1 = (user === null || user === void 0 ? void 0 : user.following) || [];
                postsWithLikes = posts.map(function (post) { return (__assign(__assign({}, post.toObject()), { liked: post.likes.some(function (likeId) { return String(likeId) === String(userId_1); }), isFollowing: followingIds_1.some(function (followId) { return String(followId) === String(post.authorId._id); }) })); });
                return [2 /*return*/, res.json({
                        posts: postsWithLikes,
                        pagination: {
                            page: page,
                            limit: limit,
                            totalPosts: totalPosts,
                            hasMore: hasMore,
                            totalPages: Math.ceil(totalPosts / limit)
                        }
                    })];
            case 6:
                e_1 = _a.sent();
                return [3 /*break*/, 7];
            case 7:
                postsWithDefaults = posts.map(function (post) { return (__assign(__assign({}, post.toObject()), { isFollowing: false })); });
                res.json({
                    posts: postsWithDefaults,
                    pagination: {
                        page: page,
                        limit: limit,
                        totalPosts: totalPosts,
                        hasMore: hasMore,
                        totalPages: Math.ceil(totalPosts / limit)
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
// GET /posts/by/:userId - list posts by user
router.get('/by/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Post_1.default
                    .find({ authorId: req.params.userId })
                    .sort({ createdAt: -1 })
                    .populate('authorId', 'name avatarUrl')];
            case 1:
                posts = _a.sent();
                res.json({ posts: posts });
                return [2 /*return*/];
        }
    });
}); });
// POST /posts - create post (auth)
router.post('/', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, contentText, imageUrl, locationCity, locationSpot, fishType, doc, author_1, followerIds, bulk, e_2, io, populatedPost;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body || {}, contentText = _a.contentText, imageUrl = _a.imageUrl, locationCity = _a.locationCity, locationSpot = _a.locationSpot, fishType = _a.fishType;
                return [4 /*yield*/, Post_1.default.create({
                        authorId: req.userId,
                        contentText: contentText,
                        imageUrl: imageUrl,
                        locationCity: locationCity,
                        locationSpot: locationSpot,
                        fishType: fishType,
                    })];
            case 1:
                doc = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                return [4 /*yield*/, User_1.default.findById(req.userId)];
            case 3:
                author_1 = _b.sent();
                followerIds = (author_1 === null || author_1 === void 0 ? void 0 : author_1.followers) || [];
                if (!followerIds.length) return [3 /*break*/, 5];
                bulk = followerIds.map(function (fid) { return ({
                    userId: fid,
                    actorId: author_1._id,
                    type: 'new_post',
                    postId: doc._id,
                }); });
                return [4 /*yield*/, Notification_1.default.insertMany(bulk)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_2 = _b.sent();
                return [3 /*break*/, 7];
            case 7:
                io = req.app.get('io');
                if (!io) return [3 /*break*/, 9];
                return [4 /*yield*/, Post_1.default.findById(doc._id).populate('authorId', 'name avatarUrl')];
            case 8:
                populatedPost = _b.sent();
                io.emit('post_created', {
                    post: populatedPost,
                    author: populatedPost === null || populatedPost === void 0 ? void 0 : populatedPost.authorId
                });
                _b.label = 9;
            case 9:
                res.status(201).json({ post: doc });
                return [2 /*return*/];
        }
    });
}); });
// POST /posts/:id/like - toggle like (auth)
router.post('/:id/like', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, uid, has, io, actor, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                uid = req.userId;
                has = post.likes.some(function (x) { return String(x) === String(uid); });
                if (has) {
                    post.likes = post.likes.filter(function (x) { return String(x) !== String(uid); });
                }
                else {
                    post.likes.push(uid);
                }
                post.likeCount = post.likes.length;
                return [4 /*yield*/, post.save()
                    // Emit socket event for real-time updates
                ];
            case 2:
                _a.sent();
                io = req.app.get('io');
                if (!io) return [3 /*break*/, 8];
                io.emit('post_like_updated', {
                    postId: req.params.id,
                    likeCount: post.likeCount,
                    liked: !has
                });
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 8]);
                if (!(!has && String(post.authorId) !== String(uid))) return [3 /*break*/, 6];
                return [4 /*yield*/, User_1.default.findById(uid, 'name')];
            case 4:
                actor = _a.sent();
                return [4 /*yield*/, Notification_1.default.create({
                        userId: post.authorId,
                        actorId: uid,
                        type: 'like',
                        postId: post._id,
                    })];
            case 5:
                _a.sent();
                io.to("user_".concat(post.authorId)).emit('notification_new', {
                    type: 'like',
                    actorName: (actor === null || actor === void 0 ? void 0 : actor.name) || 'Kullanıcı',
                    postId: String(post._id),
                    createdAt: new Date().toISOString(),
                });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_3 = _a.sent();
                return [3 /*break*/, 8];
            case 8:
                res.json({ likeCount: post.likeCount, liked: !has });
                return [2 /*return*/];
        }
    });
}); });
// POST /posts/:id/comments - add comment (auth)
router.post('/:id/comments', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, post, actor, io, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = (req.body || {}).text;
                if (!text)
                    return [2 /*return*/, res.status(400).json({ message: 'text is required' })];
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                post.comments.push({ userId: req.userId, text: text, createdAt: new Date() });
                post.commentCount = post.comments.length;
                return [4 /*yield*/, post.save()
                    // Yorum bildirimi (kendi gönderisi değilse)
                ];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 8]);
                if (!(String(post.authorId) !== String(req.userId))) return [3 /*break*/, 6];
                return [4 /*yield*/, User_1.default.findById(req.userId, 'name')];
            case 4:
                actor = _a.sent();
                return [4 /*yield*/, Notification_1.default.create({
                        userId: post.authorId,
                        actorId: req.userId,
                        type: 'comment',
                        postId: post._id,
                    })];
            case 5:
                _a.sent();
                io = req.app.get('io');
                if (io) {
                    io.to("user_".concat(post.authorId)).emit('notification_new', {
                        type: 'comment',
                        actorName: (actor === null || actor === void 0 ? void 0 : actor.name) || 'Kullanıcı',
                        postId: String(post._id),
                        createdAt: new Date().toISOString(),
                    });
                }
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_4 = _a.sent();
                return [3 /*break*/, 8];
            case 8:
                res.status(201).json({ commentCount: post.commentCount });
                return [2 /*return*/];
        }
    });
}); });
// GET /posts/:id/comments - list comments
router.get('/:id/comments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, comments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Post_1.default
                    .findById(req.params.id)
                    .populate('comments.userId', 'name')];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                comments = (post.comments || [])
                    .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); }) // Yeni yorumlar üstte
                    .map(function (c) {
                    var _a, _b;
                    return ({
                        userId: String(((_a = c.userId) === null || _a === void 0 ? void 0 : _a._id) || c.userId),
                        userName: ((_b = c.userId) === null || _b === void 0 ? void 0 : _b.name) || 'Kullanıcı',
                        text: c.text,
                        createdAt: c.createdAt,
                    });
                });
                res.json({ comments: comments });
                return [2 /*return*/];
        }
    });
}); });
// GET /posts/:id - get a single post with author
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, liked, authHeader, token, jwt, decoded, userId_2, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, Post_1.default
                        .findById(req.params.id)
                        .populate('authorId', 'name avatarUrl')];
            case 1:
                post = _b.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })
                        // Determine liked status if token present
                    ];
                liked = false;
                authHeader = req.headers.authorization;
                token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : null;
                if (!token) return [3 /*break*/, 5];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('jsonwebtoken'); })];
            case 3:
                jwt = _b.sent();
                decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'dev-secret');
                userId_2 = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
                if (userId_2 && Array.isArray(post.likes)) {
                    liked = post.likes.some(function (u) { return String(u) === String(userId_2); });
                }
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, res.json({
                    post: {
                        _id: String(post._id),
                        authorId: post.authorId ? { _id: String(post.authorId._id), name: post.authorId.name, avatarUrl: post.authorId.avatarUrl || DEFAULT_AVATAR } : undefined,
                        imageUrl: post.imageUrl,
                        contentText: post.contentText,
                        locationCity: post.locationCity,
                        locationSpot: post.locationSpot,
                        fishType: post.fishType,
                        likeCount: post.likeCount || 0,
                        commentCount: post.commentCount || 0,
                        viewCount: post.viewCount || 0,
                        createdAt: post.createdAt,
                        liked: liked,
                    }
                })];
            case 6:
                error_1 = _b.sent();
                console.error('Get post failed:', error_1);
                res.status(500).json({ message: 'Get post failed' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// GET /posts/my - current user's posts
router.get('/my', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Post_1.default
                    .find({ authorId: req.userId })
                    .sort({ createdAt: -1 })];
            case 1:
                posts = _a.sent();
                res.json({ posts: posts });
                return [2 /*return*/];
        }
    });
}); });
// POST /posts/:id/view - increment view count (non-admin users only)
router.post('/:id/view', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, io, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                post.viewCount = (post.viewCount || 0) + 1;
                return [4 /*yield*/, post.save()
                    // Emit socket event for view count update
                ];
            case 2:
                _a.sent();
                io = req.app.get('io');
                if (io) {
                    io.emit('post_view_updated', {
                        postId: req.params.id,
                        viewCount: post.viewCount
                    });
                }
                res.json({ viewCount: post.viewCount });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('View count update failed:', error_2);
                res.status(500).json({ message: 'View count update failed' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /posts/:id/view - get view count (for admins to see current count)
router.get('/:id/view', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                res.json({ viewCount: post.viewCount || 0 });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Get view count failed:', error_3);
                res.status(500).json({ message: 'Get view count failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /posts/:id - delete a post (only by author)
router.delete('/:id', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ message: 'Post not found' })];
                }
                // Check if user is the author
                if (post.authorId.toString() !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ message: 'Not authorized to delete this post' })];
                }
                return [4 /*yield*/, Post_1.default.findByIdAndDelete(req.params.id)];
            case 2:
                _a.sent();
                res.json({ message: 'Post deleted successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Delete post failed:', error_4);
                res.status(500).json({ message: 'Delete post failed' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /posts/:id/report - report a post
router.post('/:id/report', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reason, post, existingReport, report, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                reason = req.body.reason;
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ message: 'Post not found' })];
                }
                // Check if user is trying to report their own post
                if (post.authorId.toString() === req.userId) {
                    return [2 /*return*/, res.status(400).json({ message: 'Cannot report your own post' })];
                }
                return [4 /*yield*/, Report_1.default.findOne({
                        postId: req.params.id,
                        reporterId: req.userId
                    })];
            case 2:
                existingReport = _a.sent();
                if (existingReport) {
                    return [2 /*return*/, res.status(400).json({ message: 'You have already reported this post' })];
                }
                return [4 /*yield*/, Report_1.default.create({
                        postId: req.params.id,
                        reporterId: req.userId,
                        reason: reason,
                        status: 'pending'
                    })];
            case 3:
                report = _a.sent();
                console.log("Post ".concat(req.params.id, " reported by user ").concat(req.userId, ". Reason: ").concat(reason, ". Report ID: ").concat(report._id));
                res.json({ message: 'Report submitted successfully', reportId: report._id });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error('Report post failed:', error_5);
                res.status(500).json({ message: 'Report post failed' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
