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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.token = exports.authorize = exports.server = void 0;
const OAuth2Server = require("oauth2-server");
const authorization_service_1 = __importDefault(require("./authorization.service"));
const server = new OAuth2Server({
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
const authorize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return server
        .authorize(request, response, {
        authenticateHandler: {
            handle: () => __awaiter(void 0, void 0, void 0, function* () {
                console.log('🚀 ~ response:', response);
                console.log('🚀 ~ request:', request);
            })
        }
    })
        .then((result) => {
        res.json(result);
    })
        .catch((err) => {
        console.log("err", err);
        res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
});
exports.authorize = authorize;
const token = (req, res) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return server
        .token(request, response, { alwaysIssueNewRefreshToken: false })
        .then((result) => {
        console.log('🚀 ~ result:', result);
        console.log('🚀 ~ token response:', response);
        console.log('🚀 ~ token request:', request);
        res.json(result);
    })
        .catch((err) => {
        console.log("err", err);
        res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};
exports.token = token;
const authenticate = (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return server
        .authenticate(request, response)
        .then((data) => {
        var _a;
        req.auth = { userId: (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.id, sessionType: "oauth2" };
        next();
    })
        .catch((err) => {
        console.log("err", err);
        res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};
exports.authenticate = authenticate;
