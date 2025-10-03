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
var auth_1 = require("../middleware/auth");
var Report_1 = require("../models/Report");
var Post_1 = require("../models/Post");
var User_1 = require("../models/User");
var router = express_1.default.Router();
// Admin middleware
var requireAdmin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(req.userId)];
            case 1:
                user = _a.sent();
                if (!user || !user.isAdmin) {
                    return [2 /*return*/, res.status(403).json({ message: 'Admin access required' })];
                }
                next();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ message: 'Admin check failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// GET /admin/reports - get all reports (admin only)
router.get('/reports', auth_1.requireAuth, requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reports, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Report_1.default.find()
                        .populate('postId', 'contentText imageUrl authorId createdAt')
                        .populate('reporterId', 'name email')
                        .sort({ createdAt: -1 })]; // Yeni şikayetler üstte
            case 1:
                reports = _a.sent() // Yeni şikayetler üstte
                ;
                res.json({ reports: reports });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Get reports failed:', error_2);
                res.status(500).json({ message: 'Get reports failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /admin/reports/:id/status - update report status (admin only)
router.put('/reports/:id/status', auth_1.requireAuth, requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_1, adminNotes, report, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, status_1 = _a.status, adminNotes = _a.adminNotes;
                return [4 /*yield*/, Report_1.default.findByIdAndUpdate(req.params.id, { status: status_1, adminNotes: adminNotes }, { new: true }).populate('postId', 'contentText imageUrl authorId createdAt')
                        .populate('reporterId', 'name email')];
            case 1:
                report = _b.sent();
                if (!report) {
                    return [2 /*return*/, res.status(404).json({ message: 'Report not found' })];
                }
                res.json({ report: report });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Update report status failed:', error_3);
                res.status(500).json({ message: 'Update report status failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /admin/posts/:id - delete post (admin only)
router.delete('/posts/:id', auth_1.requireAuth, requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Post_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ message: 'Post not found' })];
                }
                // Also delete related reports
                return [4 /*yield*/, Report_1.default.deleteMany({ postId: req.params.id })];
            case 2:
                // Also delete related reports
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
// GET /admin/stats - get admin statistics (admin only)
router.get('/stats', auth_1.requireAuth, requireAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalReports, pendingReports, totalPosts, totalUsers, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Report_1.default.countDocuments()];
            case 1:
                totalReports = _a.sent();
                return [4 /*yield*/, Report_1.default.countDocuments({ status: 'pending' })];
            case 2:
                pendingReports = _a.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 3:
                totalPosts = _a.sent();
                return [4 /*yield*/, User_1.default.countDocuments()];
            case 4:
                totalUsers = _a.sent();
                res.json({
                    totalReports: totalReports,
                    pendingReports: pendingReports,
                    totalPosts: totalPosts,
                    totalUsers: totalUsers
                });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error('Get admin stats failed:', error_5);
                res.status(500).json({ message: 'Get admin stats failed' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
