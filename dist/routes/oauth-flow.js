"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const oauth2_service_1 = require("../services/oauth2.service");
const router = express.Router();
router.get("/authorize", oauth2_service_1.authorize);
router.post("/token", oauth2_service_1.token);
router.get("/authenticate", oauth2_service_1.authenticate);
exports.default = router;
