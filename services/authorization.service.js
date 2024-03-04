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
var prisma_1 = require("../lib/prisma");
function generateAuthorizationCode(client, user, scope) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('🚀 ~ generateAuthorizationCode:', client, user, scope);
            return [2 /*return*/, JSON.stringify({
                    client: client,
                    user: user,
                    scope: scope,
                })];
        });
    });
}
function getClient(clientId, clientSecret) {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 ~ getClient:', clientId, clientSecret);
                    return [4 /*yield*/, prisma_1.default.oAuthClient.findUnique({
                            where: {
                                clientId: clientId,
                                AND: {
                                    clientSecret: clientSecret
                                }
                            },
                        })];
                case 1:
                    client = _a.sent();
                    if (client) {
                        return [2 /*return*/, {
                                id: client.clientId,
                                grants: client.grants,
                                redirectUris: client.redirectUris
                            }];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Save token.
 */
function saveToken(token, client, user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 ~ saveToken:', token, client, user);
                    return [4 /*yield*/, prisma_1.default.oAuthToken.create({
                            data: {
                                accessToken: token.accessToken,
                                accessTokenExpiresAt: token.accessTokenExpiresAt,
                                refreshToken: token.refreshToken,
                                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                                scope: token.scope,
                                clientId: client.id,
                                userId: user.id,
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            accessToken: token.accessToken,
                            accessTokenExpiresAt: token.accessTokenExpiresAt,
                            refreshToken: token.refreshToken,
                            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                            scope: token.scope,
                            client: { id: client.id, grants: ["authorization_code"] },
                            user: { id: user.id },
                            // other formats, i.e. for Zapier
                            access_token: token.accessToken,
                            refresh_token: token.refreshToken
                        }];
            }
        });
    });
}
/**
 * Get access token.
 */
function getAccessToken(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 ~ getAccessToken:', accessToken);
                    return [4 /*yield*/, prisma_1.default.oAuthToken.findFirst({
                            where: {
                                accessToken: accessToken
                            }
                        })];
                case 1:
                    token = _a.sent();
                    if (!token)
                        throw new Error("Access token not found");
                    return [2 /*return*/, {
                            accessToken: token.accessToken,
                            accessTokenExpiresAt: token.accessTokenExpiresAt,
                            scope: token.scope,
                            client: { id: token.clientId, grants: ["authorization_code"] },
                            user: { id: token.userId }
                        }];
            }
        });
    });
}
/**
 * Verify Scope.
 */
function verifyScope(token, scope) {
    return __awaiter(this, void 0, void 0, function () {
        var requestedScopes, authorizedScopes;
        return __generator(this, function (_a) {
            console.log('🚀 ~ verifyScope:', token);
            if (!token.scope) {
                return [2 /*return*/, false];
            }
            requestedScopes = scope.split(' ');
            authorizedScopes = token.scope.split(' ');
            return [2 /*return*/, requestedScopes.every(function (s) { return authorizedScopes.indexOf(s) >= 0; })];
        });
    });
}
/**
 * Get authorization code.
 */
function getAuthorizationCode(authorizationCode) {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 ~ getAuthorizationCode:', authorizationCode);
                    return [4 /*yield*/, prisma_1.default.oAuthCode.findFirst({
                            where: {
                                authorizationCode: authorizationCode
                            }
                        })];
                case 1:
                    code = _a.sent();
                    if (!code)
                        throw new Error("Authorization code not found");
                    return [2 /*return*/, {
                            authorizationCode: code.authorizationCode,
                            expiresAt: code.expiresAt,
                            redirectUri: code.redirectUri,
                            scope: code.scope,
                            client: { id: code.clientId, grants: ["authorization_code"] },
                            user: { id: code.userId }
                        }];
            }
        });
    });
}
/**
 * Save authorization code.
 */
function saveAuthorizationCode(code, client, user) {
    return __awaiter(this, void 0, void 0, function () {
        var authorizationCode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 ~ saveAuthorizationCode:', code, client, user);
                    authorizationCode = {
                        authorizationCode: code.authorizationCode,
                        expiresAt: code.expiresAt,
                        redirectUri: code.redirectUri,
                        scope: code.scope,
                        clientId: client.id,
                        userId: user.id
                    };
                    return [4 /*yield*/, prisma_1.default.oAuthCode.create({
                            data: authorizationCode
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, code), { user: user, client: client })];
            }
        });
    });
}
/**
 * Revoke authorization code.
 */
function revokeAuthorizationCode(_a) {
    var authorizationCode = _a.authorizationCode;
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🚀 ~ revokeAuthorizationCode:', authorizationCode);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, prisma_1.default.oAuthCode.delete({
                            where: {
                                authorizationCode: authorizationCode
                            }
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_1 = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Revoke a refresh token.
 */
function revokeToken(_a) {
    var refreshToken = _a.refreshToken;
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🚀 ~ revokeToken:', refreshToken);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, prisma_1.default.oAuthToken.delete({
                            where: {
                                refreshToken: refreshToken
                            }
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_2 = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get refresh token.
 */
function getRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 ~ getRefreshToken:', refreshToken);
                    return [4 /*yield*/, prisma_1.default.oAuthToken.findFirst({
                            where: {
                                refreshToken: refreshToken
                            }
                        })];
                case 1:
                    token = _a.sent();
                    if (!token)
                        throw new Error("Refresh token not found");
                    return [2 /*return*/, {
                            refreshToken: token.refreshToken,
                            // refreshTokenExpiresAt: token.refreshTokenExpiresAt, // never expires
                            scope: token.scope,
                            client: { id: token.clientId, grants: ["authorization_code"] },
                            user: { id: token.userId }
                        }];
            }
        });
    });
}
exports.default = {
    generateAuthorizationCode: generateAuthorizationCode,
    verifyScope: verifyScope,
    saveToken: saveToken,
    saveAuthorizationCode: saveAuthorizationCode,
    revokeAuthorizationCode: revokeAuthorizationCode,
    revokeToken: revokeToken,
    getAuthorizationCode: getAuthorizationCode,
    getAccessToken: getAccessToken,
    getClient: getClient,
    getRefreshToken: getRefreshToken
};
