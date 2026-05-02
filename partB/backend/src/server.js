import "dotenv/config";
import { createApp } from "./app.js";

const port = process.env.PORT ?? 4000;

createApp().listen(port, () => {
  console.log(`Mini Library API listening on http://localhost:${port}`);
});
