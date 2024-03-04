// services/oauth2.service.js

import OAuth2Server, { Request, Response } from "oauth2-server";
import prisma from "../lib/prisma";
import authorizationService from "./authorization.service";

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

const authorize = async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  return server
    .authorize(request, response, {
      authenticateHandler: {
        handle: async () => {
          console.log('🚀 ~ response:', response)
          console.log('🚀 ~ request:', request)
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

const token = (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  return server
    .token(request, response, { alwaysIssueNewRefreshToken: false })
    .then((result) => {
      console.log('🚀 ~ result:', result)
      console.log('🚀 ~ token response:', response)
      console.log('🚀 ~ token request:', request)
      res.json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};

const authenticate = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);
  return server
    .authenticate(request, response)
    .then((data) => {
      req.auth = { userId: data?.user?.id, sessionType: "oauth2" };
      next();
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? { error: err.message } : err);
    });
};

export { server, authorize, token, authenticate };