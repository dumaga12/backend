const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/business", require("./routes/business.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/deals", require("./routes/deal"));
app.use("/api/deal-claims", require("./routes/dealClaim"));

app.get("/", (req, res) => res.send("BizBoost Backend Running"));

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ force: true });
    console.log("All tables synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
  }
})();

module.exports = app;
