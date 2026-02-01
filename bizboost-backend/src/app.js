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
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api/ratings", require("./routes/rating.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => res.send("BizBoost Backend Running"));

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ force: false });
    console.log("All tables synced");

    // Static folder for uploads
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    app.use('/uploads', express.static(uploadsDir));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
  }
})();

module.exports = app;
