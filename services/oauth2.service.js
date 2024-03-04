"use strict";
// services/oauth2.service.js
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.authenticate = exports.token = exports.authorize = exports.server = void 0;
var oauth2_server_1 = require("oauth2-server");
var authorization_service_1 = require("./authorization.service");
var server = new oauth2_server_1.default({
    model: authorization_service_1.default,
    accessTokenLifetime: 60 * 60
});
exports.server = server;
// IMPORTANT: this the first route to be called in the process. 
// node-oauth2-server requires us to define a function called
// `authenticateHandler` that authenticate the user initiating the flow.
// This means that:
// 1. A User is authenticating through a Client, hence you need to search
// for a valid Client in the DB using `client_id` provided as parameter;
// 2. A User is authenticating via the authorization screen (same as you do
// when adding a new app to GitHub and it asks you what organization or
// privileges do you want to grant the app. The bonus of this article is
// that very screen).
// The library says that if you don't need to authenticate the user, you can
// return a falsy value. This didn't work for me so I'm not recommending it
// here. 
var authorize = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, response;
    return __generator(this, function (_a) {
        request = new oauth2_server_1.Request(req);
        response = new oauth2_server_1.Response(res);
        return [2 /*return*/, server
                .authorize(request, response, {
                authenticateHandler: {
                    handle: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log('🚀 ~ response:', response);
                            console.log('🚀 ~ request:', request);
                            return [2 /*return*/];
                        });
                    }); }
                }
            })
                .then(function (result) {
                res.json(result);
            })
                .catch(function (err) {
                console.log("err", err);
                res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
            })];
    });
}); };
exports.authorize = authorize;
var token = function (req, res) {
    var request = new oauth2_server_1.Request(req);
    var response = new oauth2_server_1.Response(res);
    return server
        .token(request, response, { alwaysIssueNewRefreshToken: false })
        .then(function (result) {
        console.log('🚀 ~ result:', result);
        console.log('🚀 ~ token response:', response);
        console.log('🚀 ~ token request:', request);
        res.json(result);
    })
        .catch(function (err) {
        console.log("err", err);
        res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};
exports.token = token;
var authenticate = function (req, res, next) {
    var request = new oauth2_server_1.Request(req);
    var response = new oauth2_server_1.Response(res);
    return server
        .authenticate(request, response)
        .then(function (data) {
        var _a;
        req.auth = { userId: (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.id, sessionType: "oauth2" };
        next();
    })
        .catch(function (err) {
        console.log("err", err);
        res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};
exports.authenticate = authenticate;
