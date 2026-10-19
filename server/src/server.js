const movieRoutes = require("./routes/movieRoutes")
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use("/api/auth", authRoutes);

app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Movie Booking API is running");

});



app.get("/api/health", (req, res) => {
    res.json(
        {
            status: "OK",
            message: "Movie Booking API is healthy"
        }
    );
});

app.use("/api/movies", movieRoutes)

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();