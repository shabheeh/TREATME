import express from "express";
import { getImageProxy } from "../../controllers/media-proxy/mediaController";

const router = express.Router();

router.get("/:resourceType", getImageProxy);

export default router;
