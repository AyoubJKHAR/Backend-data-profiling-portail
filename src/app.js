import express from "express";
import lakehouseRoutes from "./routes/lakehouse.routes.js";
import pipelineRoutes from "./routes/pipeline.routes.js";
import configRoutes from "./routes/config.routes.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));

app.use("/", configRoutes);      // /add_selected_lakehouses_tables_to_config
app.use("/", lakehouseRoutes);   // /lakehouses, /lakehouse-tables
app.use("/", pipelineRoutes);    // /run-pipeline, /pipeline-status/:id

export default app;
