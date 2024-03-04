import OAuth2Server, { AuthorizationCodeModel } from "oauth2-server";
import prisma from "../lib/prisma";

async function generateAuthorizationCode(client: OAuth2Server.Client, user: OAuth2Server.User, scope: string) {
  console.log('🚀 ~ generateAuthorizationCode:', client, user, scope)
  return JSON.stringify({
    client,
    user,
    scope,
  });
}

async function getClient(clientId: string, clientSecret: string): Promise<OAuth2Server.Client | OAuth2Server.Falsey> {
  console.log('🚀 ~ getClient:', clientId, clientSecret)
  const client = await prisma.oAuthClient.findUnique({
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
}

/**
 * Save token.
 */
async function saveToken(token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.Token> {
  console.log('🚀 ~ saveToken:', token, client, user)
  await prisma.oAuthToken.create({
    data: {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt!,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope as string,
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
}

/**
 * Get access token.
 */
async function getAccessToken(accessToken: string): Promise<OAuth2Server.Token> {
  console.log('🚀 ~ getAccessToken:', accessToken)
  const token = await prisma.oAuthToken.findFirst({
    where: {
      accessToken
    }
  });
  if (!token) throw new Error("Access token not found");

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    scope: token.scope,
    client: { id: token.clientId, grants: ["authorization_code"] },
    user: { id: token.userId }
  };
}

/**
 * Verify Scope.
 */

async function verifyScope(token: OAuth2Server.Token, scope: string) {
  console.log('🚀 ~ verifyScope:', token)
  if (!token.scope) {
    return false;
  }
  let requestedScopes = scope.split(' ');
  let authorizedScopes = (token.scope as string).split(' ');
  return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
}

/**
 * Get authorization code.
 */
async function getAuthorizationCode(authorizationCode: string): Promise<OAuth2Server.AuthorizationCode> {
  console.log('🚀 ~ getAuthorizationCode:', authorizationCode)
  const code = await prisma.oAuthCode.findFirst(
    {
      where: {
        authorizationCode
      }
    }
  );
  if (!code) throw new Error("Authorization code not found");

  return {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: { id: code.clientId, grants: ["authorization_code"] },
    user: { id: code.userId }
  };
}

/**
 * Save authorization code.
 */
async function saveAuthorizationCode(code: OAuth2Server.AuthorizationCode, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.AuthorizationCode> {
  console.log('🚀 ~ saveAuthorizationCode:', code, client, user)
  const authorizationCode = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope as string,
    clientId: client.id,
    userId: user.id
  };
  await prisma.oAuthCode.create({
    data: authorizationCode
  });
  return { ...code, user, client };
}

/**
 * Revoke authorization code.
 */
async function revokeAuthorizationCode({ authorizationCode }: OAuth2Server.AuthorizationCode) {
  console.log('🚀 ~ revokeAuthorizationCode:', authorizationCode)
  try {
    await prisma.oAuthCode.delete(
      {
        where: {
          authorizationCode
        }
      }
    );
    return true
  } catch (err) {
    return false
  }
}

/**
 * Revoke a refresh token.
 */
async function revokeToken({ refreshToken }: OAuth2Server.Token) {
  console.log('🚀 ~ revokeToken:', refreshToken)
  try {
    await prisma.oAuthToken.delete(
      {
        where: {
          refreshToken
        }
      }
    );
    return true
  } catch (err) {
    return false
  }
}

/**
 * Get refresh token.
 */
async function getRefreshToken(refreshToken: string): Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey> {
  console.log('🚀 ~ getRefreshToken:', refreshToken)
  const token = await prisma.oAuthToken.findFirst({
    where: {
      refreshToken
    }
  });
  if (!token) throw new Error("Refresh token not found");

  return {
    refreshToken: token.refreshToken!,
    // refreshTokenExpiresAt: token.refreshTokenExpiresAt, // never expires
    scope: token.scope,
    client: { id: token.clientId, grants: ["authorization_code"] },
    user: { id: token.userId }
  };
}

export default {
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
} as AuthorizationCodeModel;