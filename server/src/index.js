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
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var db_1 = require("./lib/db");
var cookie_parser_1 = require("cookie-parser");
var auth_1 = require("./routes/auth");
var me_1 = require("./routes/me");
var auth0_1 = require("./routes/auth0");
var posts_1 = require("./routes/posts");
var upload_1 = require("./routes/upload");
var follow_1 = require("./routes/follow");
var notifications_1 = require("./routes/notifications");
var users_1 = require("./routes/users");
var admin_1 = require("./routes/admin");
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
        credentials: true
    }
});
var PORT = process.env.PORT || 4000;
var CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use((0, cors_1.default)({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express_1.default.json({ limit: '6mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '6mb' }));
app.use((0, cookie_parser_1.default)());
app.get('/health', function (_req, res) {
    res.json({ ok: true });
});
app.use('/auth', auth_1.default);
app.use('/', me_1.default);
app.use('/', auth0_1.default);
app.use('/posts', posts_1.default);
app.use('/upload', upload_1.default);
app.use('/follow', follow_1.default);
app.use('/notifications', notifications_1.default);
app.use('/users', users_1.default);
app.use('/admin', admin_1.default);
// Socket.IO event handlers
io.on('connection', function (socket) {
    console.log('User connected:', socket.id);
    // User joins with their ID
    socket.on('join', function (userId) {
        socket.join("user_".concat(userId));
        console.log("User ".concat(userId, " joined room"));
    });
    // Relay direct notification events if needed (reserved)
    socket.on('notification_emit', function (data) {
        var _a = data || {}, userId = _a.userId, payload = _a.payload;
        if (userId) {
            io.to("user_".concat(userId)).emit('notification_new', payload);
        }
    });
    // Handle post like updates
    socket.on('post_liked', function (data) {
        socket.broadcast.emit('post_like_updated', data);
    });
    // Handle post view updates
    socket.on('post_viewed', function (data) {
        socket.broadcast.emit('post_view_updated', data);
    });
    // Handle new posts
    socket.on('new_post', function (data) {
        socket.broadcast.emit('post_created', data);
    });
    // Handle user online status
    socket.on('user_online', function (userId) {
        socket.broadcast.emit('user_status_changed', { userId: userId, status: 'online' });
    });
    // Handle get online count
    socket.on('get_online_count', function () {
        var count = io.engine.clientsCount;
        socket.emit('online_count_updated', { count: count });
    });
    socket.on('disconnect', function () {
        console.log('User disconnected:', socket.id);
        // Broadcast online count update
        var count = io.engine.clientsCount - 1;
        socket.broadcast.emit('online_count_updated', { count: count });
    });
});
// Make io available to routes
app.set('io', io);
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    console.log('Booting server...');
                    console.log('Connecting to Mongo...');
                    return [4 /*yield*/, (0, db_1.connectDB)()];
                case 1:
                    _a.sent();
                    console.log('Mongo connected');
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    console.error('DB connection failed', err_1);
                    return [3 /*break*/, 4];
                case 3:
                    server.listen(PORT, function () {
                        console.log("Server listening on http://localhost:".concat(PORT));
                        console.log("Socket.IO server ready");
                    });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
start();
process.on('unhandledRejection', function (err) {
    console.error('UnhandledRejection', err);
});
process.on('uncaughtException', function (err) {
    console.error('UncaughtException', err);
});
