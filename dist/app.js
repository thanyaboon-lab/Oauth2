"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const oauth_flow_1 = __importDefault(require("./routes/oauth-flow"));
// ...
// initialize express server
const app = express();
app.use("/oauth", oauth_flow_1.default);
app.listen(3000);
