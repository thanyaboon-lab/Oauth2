import OAuth2Server from 'oauth2-server';
import prisma from "../lib/prisma";
import authorizationService from "./authorization.service";
import { NextFunction } from "express";

const server = new OAuth2Server({
  model: authorizationService,
  accessTokenLifetime: 60 * 60
});

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

const authorize = async (req: any, res: any) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  return server
    .authorize(request, response, {
      authenticateHandler: {
        handle: async () => {
          console.log('authorize');
          
          const {client_id} = req.query || {};
          if (!client_id) throw new Error("Client ID not found");
          const client = await prisma.oAuthClient.findFirst({
            where: {
              clientId: client_id
            }
          })
          console.log('🚀 ~ authorize client:', client)
          if (!client) throw new Error("Client not found");
          // Only present in Flow 2 (authentication screen)
          const {userId} = req.auth || {};
          console.log('🚀 ~ req.auth:', req.auth)
          console.log('🚀 ~ userId:', userId)

          return {}
          // At this point, if there's no 'userId' attached to the client or the request doesn't originate from an authentication screen, then do not bind this authorization code to any user, just the client
          // if (!client.userId && !userId) return {}; // falsy value
          // const user = await usersDb.findOne({
          //   ...(client.userId && {_id: client.userId}),
          //   ...(userId && {clerkId: userId})
          // });
          // if (!user) throw new Error("User not found");
          // return {_id: user._id};
        }
      }
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};

const token = (req:any, res:any) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  return server
    .token(request, response, { alwaysIssueNewRefreshToken: false })
    .then((result) => {
      console.log('🚀 /token  result:', result)
      // console.log('🚀 ~ token response:', response)
      // console.log('🚀 ~ token request:', request)
      res.json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};

const authenticate = (req: any, res: any, next: NextFunction) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  return server
  .authenticate(request, response)
  .then((data:any) => {
      console.log('🚀 ~ authenticate:', data)
      req.auth = { userId: data?.user?.id, sessionType: "oauth2" };
      next();
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};

export { server, authorize, token, authenticate };