import express from "express";
import oAuthFlowRoutes from "./routes/oauth-flow";
// ...

// initialize express server
const app = express();
app.use("/oauth", oAuthFlowRoutes);

app.listen(3000);