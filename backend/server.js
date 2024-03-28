import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import health from "./routes/health.js";
import routes from "./routes/routesPoly.js";
import metrics from "./routes/routeMetrics.js";
const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json({limit: '200mb'}));

app.use("/health", health);
app.use("/routes", routes);
app.use("/metrics", metrics);

app.listen(port, () => console.log(`App listening on port ${port}!`));

export default app;
