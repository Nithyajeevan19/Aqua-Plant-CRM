import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productionRouter from "./production";
import expensesRouter from "./expenses";
import incomeRouter from "./income";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productionRouter);
router.use(expensesRouter);
router.use(incomeRouter);
router.use(dashboardRouter);

export default router;
