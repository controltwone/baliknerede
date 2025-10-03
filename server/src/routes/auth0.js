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
var express_openid_connect_1 = require("express-openid-connect");
var jsonwebtoken_1 = require("jsonwebtoken");
var User_1 = require("../models/User");
var DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";
var router = express_1.default.Router();
var config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:4000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    // Auth0 callback: baseURL + '/callback' → bu yolu lib kendi yönetir
    routes: { callback: '/callback' },
};
router.use((0, express_openid_connect_1.auth)(config));
router.get('/auth0/login', function (req, res) {
    // Başarılı dönüşte app tarafına tamamla endpointine yönlendir
    // Google'a direkt yönlendirmek için connection ve prompt parametreleri gönder
    res.oidc.login({
        returnTo: '/auth0/complete',
        authorizationParams: {
            // Auth0 Google Social Connection identifier
            connection: 'google-oauth2',
            // Her seferinde hesap seçim ekranını göster
            prompt: 'select_account',
        },
    });
});
// Callback'ı express-openid-connect handle eder; biz tamamlamayı ayrı endpointte yapıyoruz
router.get('/auth0/complete', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var claims, email, name_1, user, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                claims = req.oidc.user;
                if (!claims)
                    return [2 /*return*/, res.redirect('/auth0/login')];
                email = claims.email;
                name_1 = claims.name || (email ? email.split('@')[0] : 'User');
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.create({ name: name_1, email: email, password: jsonwebtoken_1.default.sign({ t: Date.now() }, 'x'), avatarUrl: DEFAULT_AVATAR })];
            case 2:
                user = _a.sent();
                _a.label = 3;
            case 3:
                token = jsonwebtoken_1.default.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
                res.cookie('bn_token', token, {
                    httpOnly: true,
                    secure: true, // localhost kabul edilir; cross-site cookie için gerekli
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return [2 /*return*/, res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000')];
            case 4:
                e_1 = _a.sent();
                console.error('Auth0 complete error:', e_1);
                return [2 /*return*/, res.redirect('/')];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/auth0/logout', function (req, res) {
    try {
        // Clear all possible cookies
        res.clearCookie('bn_token');
        res.clearCookie('appSession');
        res.clearCookie('connect.sid');
        // Clear any other Auth0 related cookies
        var cookies = req.headers.cookie;
        if (cookies) {
            cookies.split(';').forEach(function (cookie) {
                var eqPos = cookie.indexOf('=');
                var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                if (name) {
                    res.clearCookie(name, { path: '/' });
                    res.clearCookie(name, { path: '/', domain: process.env.AUTH0_DOMAIN });
                }
            });
        }
    }
    catch (error) {
        console.error('Error clearing cookies:', error);
    }
    // Auth0 oturumu da kapat ve frontend'e dön
    return res.oidc.logout({ returnTo: process.env.CLIENT_ORIGIN || 'http://localhost:3000' });
});
// Frontend'in header kullanabilmesi için cookieden token'ı geri ver (dev amaçlı)
router.get('/auth0/token', function (req, res) {
    var _a;
    var token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.bn_token;
    if (!token)
        return res.status(401).json({ message: 'No session' });
    return res.json({ token: token });
});
exports.default = router;
