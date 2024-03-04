"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var oauth2_service_1 = require("../services/oauth2.service");
var router = express_1.default.Router();
router.get("/authorize", oauth2_service_1.authorize);
router.post("/token", oauth2_service_1.token);
router.get("/authenticate", oauth2_service_1.authenticate);
exports.default = router;
