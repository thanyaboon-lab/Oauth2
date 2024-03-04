"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var oauth_flow_1 = require("./routes/oauth-flow");
// ...
// initialize express server
var app = (0, express_1.default)();
app.use("/oauth", oauth_flow_1.default);
app.listen(3000);
