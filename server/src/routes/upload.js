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
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
// Support Cloudflare R2 (S3-compatible) via custom endpoint
var s3 = new client_s3_1.S3Client({
    region: process.env.R2_REGION || process.env.AWS_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT || undefined,
    forcePathStyle: !!process.env.R2_ENDPOINT, // R2 genelde path-style ister
    credentials: (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) ? {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    } : (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined,
});
router.post('/presign', auth_1.requireAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fileName, fileType, bucket, key, command, url, publicBase, publicUrl, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log('Presign request:', { userId: req.userId, body: req.body });
                _a = req.body || {}, fileName = _a.fileName, fileType = _a.fileType;
                if (!fileName || !fileType)
                    return [2 /*return*/, res.status(400).json({ message: 'fileName and fileType required' })];
                bucket = (process.env.R2_BUCKET || process.env.S3_BUCKET);
                if (!bucket)
                    return [2 /*return*/, res.status(500).json({ message: 'Bucket not configured' })];
                key = "uploads/".concat(req.userId, "/").concat(Date.now(), "-").concat(fileName);
                command = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: key, ContentType: fileType });
                return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 })
                    // Prefer R2 public base if provided, else build standard R2 hostname
                ];
            case 1:
                url = _b.sent();
                publicBase = process.env.R2_PUBLIC_BASE || (process.env.R2_ACCOUNT_ID ? "https://".concat(bucket, ".").concat(process.env.R2_ACCOUNT_ID, ".r2.cloudflarestorage.com") : undefined);
                publicUrl = publicBase ? "".concat(publicBase, "/").concat(key) : "https://".concat(bucket, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(key);
                console.log('Presign success:', { uploadUrl: url, publicUrl: publicUrl });
                return [2 /*return*/, res.json({ uploadUrl: url, publicUrl: publicUrl })];
            case 2:
                e_1 = _b.sent();
                console.error('presign error', e_1);
                return [2 /*return*/, res.status(500).json({ message: 'presign failed' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
