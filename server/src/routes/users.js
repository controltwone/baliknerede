"use strict";
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
var User_1 = require("../models/User");
var DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";
var router = express_1.default.Router();
// GET /users/search?q=query - search users by name
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, users, results, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                q = req.query.q;
                if (!q || typeof q !== 'string') {
                    return [2 /*return*/, res.json({ users: [] })];
                }
                return [4 /*yield*/, User_1.default.find({
                        name: { $regex: q, $options: 'i' }
                    }).select('name avatarUrl').limit(10)];
            case 1:
                users = _a.sent();
                results = users.map(function (user) { return ({
                    id: String(user._id),
                    name: user.name,
                    avatarUrl: user.avatarUrl || DEFAULT_AVATAR
                }); });
                res.json({ users: results });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('User search failed:', error_1);
                res.status(500).json({ message: 'Search failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /users/:id - public profile
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.default.findById(req.params.id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                res.json({ id: String(user._id), name: user.name, avatarUrl: user.avatarUrl || DEFAULT_AVATAR, followers: (user.followers || []).length, following: (user.following || []).length });
                return [2 /*return*/];
        }
    });
}); });
// GET /users/:id/followers - list followers with names
router.get('/:id/followers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.default.findById(req.params.id).populate('followers', 'name avatarUrl')];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                list = (user.followers || []).map(function (u) { return ({ id: String(u._id), name: u.name, avatarUrl: u.avatarUrl || DEFAULT_AVATAR }); });
                res.json({ followers: list });
                return [2 /*return*/];
        }
    });
}); });
// GET /users/:id/following - list following with names
router.get('/:id/following', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.default.findById(req.params.id).populate('following', 'name avatarUrl')];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                list = (user.following || []).map(function (u) { return ({ id: String(u._id), name: u.name, avatarUrl: u.avatarUrl || DEFAULT_AVATAR }); });
                res.json({ following: list });
                return [2 /*return*/];
        }
    });
}); });
// GET /users/:id/follow-status - check if current user follows this user
router.get('/:id/follow-status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, authHeader, token, jwt, payload, currentUserId, currentUser, isFollowing, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id_1 = req.params.id;
                authHeader = req.headers.authorization;
                token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : null;
                if (!token) {
                    return [2 /*return*/, res.json({ isFollowing: false })];
                }
                return [4 /*yield*/, Promise.resolve().then(function () { return require('jsonwebtoken'); })];
            case 1:
                jwt = _b.sent();
                payload = jwt.default.verify(token, process.env.JWT_SECRET || 'dev_secret');
                currentUserId = payload.sub;
                return [4 /*yield*/, User_1.default.findById(currentUserId)];
            case 2:
                currentUser = _b.sent();
                isFollowing = ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.following) === null || _a === void 0 ? void 0 : _a.some(function (followId) { return String(followId) === String(id_1); })) || false;
                res.json({ isFollowing: isFollowing });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Follow status check failed:', error_2);
                res.json({ isFollowing: false });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
