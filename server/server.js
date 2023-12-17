import app from "./app.js";
import connectionDB from "./config/dbConnect.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectionDB();
  console.log(`App is runnig at http://localhost:${PORT}`);
});
