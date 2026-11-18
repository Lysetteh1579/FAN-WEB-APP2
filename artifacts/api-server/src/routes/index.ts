import { Router, type IRouter } from "express";
import healthRouter from "./health";
import summitRouter from "./summit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(summitRouter);

export default router;
