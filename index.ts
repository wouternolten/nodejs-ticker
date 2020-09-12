import dotenv from "dotenv";
dotenv.config();
const port: string = process.env.PORT || "3000";

import createApp from "./src/App";

createApp().listen(port, (err: Error) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});
