import express from 'express';
import {authorize, token, authenticate} from "../services/oauth2.service";

const router = express.Router();

router.get("/authorize", authorize);
router.post("/token", token);
router.get("/authenticate", authenticate);

export default router;