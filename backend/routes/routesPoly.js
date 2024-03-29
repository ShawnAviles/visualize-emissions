import express from "express";
const router = express.Router();
import { getRoutes } from "../controllers/requestController.js";

router.route("/").post(async (req, res) => {
	const zipCodesWithModes = req.body;
	const output = await getRoutes(zipCodesWithModes);
	// const output = {
	// 	error: "This route is closed rn",
	// 	input: zipCodesWithModes,
	// };
	res.send({
		response: "SUCCESS",
		data: output,
	});
	console.log("\nReturning JSON of large routes data!");
});

export default router;
