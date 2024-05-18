import app from "./app.js";
import { connectDB } from "./config/database.js";

const port = process.env.PORT;

connectDB();
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
