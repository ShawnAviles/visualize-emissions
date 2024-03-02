import express from "express";
const router = express.Router();

router.route("/").get((req, res) => {
	res.status(200).send("Server is healthy");
	console.log("Server is healthy");
});

export default router;
