"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
var jwt = require("jsonwebtoken");
function requireAuth(req, res, next) {
    var _a;
    try {
        var auth = req.headers.authorization || '';
        var headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        // Also accept HttpOnly cookie set at Auth0 completion
        // @ts-ignore
        var cookieToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.bn_token) || null;
        var token = headerToken || cookieToken;
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        var secret = process.env.JWT_SECRET || 'dev_secret';
        var payload = jwt.verify(token, secret);
        req.userId = payload.sub;
        next();
    }
    catch (_b) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
