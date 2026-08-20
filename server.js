const express = require("express");
const app = express();
const queueRouter = require("./routes/queue");

app.use(express.json());
app.use("/queue", queueRouter);

app.get("/", (req, res) => {
    res.send("Server dang chay");
});

// Chỉnh sửa đoạn này:
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server dang chay tai cong ${PORT}`);
});