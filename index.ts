import app from "./src/App";
import { config } from "dotenv";
import { resolve } from "path";

const port: string = process.env.PORT || "3000";

app.listen(port, (err: Error) => {
  config({ path: resolve(__dirname, "../.env") });

  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});
