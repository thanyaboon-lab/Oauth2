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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
function generateAuthorizationCode(client, user, scope) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ generateAuthorizationCode:', client, user, scope);
        return JSON.stringify({
            client,
            user,
            scope,
        });
    });
}
function getClient(clientId, clientSecret) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ getClient:', clientId, clientSecret);
        const client = yield prisma_1.default.oAuthClient.findUnique({
            where: {
                clientId,
                AND: {
                    clientSecret
                }
            },
        });
        if (client) {
            return {
                id: client.clientId,
                grants: client.grants,
                redirectUris: client.redirectUris
            };
        }
        return null;
    });
}
/**
 * Save token.
 */
function saveToken(token, client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ saveToken:', token, client, user);
        yield prisma_1.default.oAuthToken.create({
            data: {
                accessToken: token.accessToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshToken: token.refreshToken,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                scope: token.scope,
                clientId: client.id,
                userId: user.id,
            }
        });
        return {
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
        };
    });
}
/**
 * Get access token.
 */
function getAccessToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ getAccessToken:', accessToken);
        const token = yield prisma_1.default.oAuthToken.findFirst({
            where: {
                accessToken
            }
        });
        if (!token)
            throw new Error("Access token not found");
        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            scope: token.scope,
            client: { id: token.clientId, grants: ["authorization_code"] },
            user: { id: token.userId }
        };
    });
}
/**
 * Verify Scope.
 */
function verifyScope(token, scope) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ verifyScope:', token);
        if (!token.scope) {
            return false;
        }
        let requestedScopes = scope.split(' ');
        let authorizedScopes = token.scope.split(' ');
        return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    });
}
/**
 * Get authorization code.
 */
function getAuthorizationCode(authorizationCode) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ getAuthorizationCode:', authorizationCode);
        const code = yield prisma_1.default.oAuthCode.findFirst({
            where: {
                authorizationCode
            }
        });
        if (!code)
            throw new Error("Authorization code not found");
        return {
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            redirectUri: code.redirectUri,
            scope: code.scope,
            client: { id: code.clientId, grants: ["authorization_code"] },
            user: { id: code.userId }
        };
    });
}
/**
 * Save authorization code.
 */
function saveAuthorizationCode(code, client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ saveAuthorizationCode:', code, client, user);
        const authorizationCode = {
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            redirectUri: code.redirectUri,
            scope: code.scope,
            clientId: client.id,
            userId: user.id
        };
        yield prisma_1.default.oAuthCode.create({
            data: authorizationCode
        });
        return Object.assign(Object.assign({}, code), { user, client });
    });
}
/**
 * Revoke authorization code.
 */
function revokeAuthorizationCode({ authorizationCode }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ revokeAuthorizationCode:', authorizationCode);
        try {
            yield prisma_1.default.oAuthCode.delete({
                where: {
                    authorizationCode
                }
            });
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
/**
 * Revoke a refresh token.
 */
function revokeToken({ refreshToken }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ revokeToken:', refreshToken);
        try {
            yield prisma_1.default.oAuthToken.delete({
                where: {
                    refreshToken
                }
            });
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
/**
 * Get refresh token.
 */
function getRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 ~ getRefreshToken:', refreshToken);
        const token = yield prisma_1.default.oAuthToken.findFirst({
            where: {
                refreshToken
            }
        });
        if (!token)
            throw new Error("Refresh token not found");
        return {
            refreshToken: token.refreshToken,
            // refreshTokenExpiresAt: token.refreshTokenExpiresAt, // never expires
            scope: token.scope,
            client: { id: token.clientId, grants: ["authorization_code"] },
            user: { id: token.userId }
        };
    });
}
exports.default = {
    generateAuthorizationCode,
    verifyScope,
    saveToken,
    saveAuthorizationCode,
    revokeAuthorizationCode,
    revokeToken,
    getAuthorizationCode,
    getAccessToken,
    getClient,
    getRefreshToken
};
