import express from "express";
const router = express.Router();
import { getMetrics } from "../controllers/requestController.js";

router.route("/").post(async (req, res) => {
	const zipCodesAndTable = req.body;
	const output = await getMetrics(zipCodesAndTable);
	res.send({
		response: "SUCCESS",
		data: output,
	});
	console.log("\nReturning JSON with metrics for requested routes!");
});

export default router;
