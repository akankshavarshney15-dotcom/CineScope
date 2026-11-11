
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/movies", async (req, res) => {
    try {
        const params = new URLSearchParams(req.query);
        const apiKey = process.env.OMDB_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                Response: "False",
                Error: "API key is not configured."
            });
        }

        params.delete("apikey");
        params.set("apikey", apiKey);

        const response = await fetch(
            `https://www.omdbapi.com/?${params.toString()}`
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("OMDb error:", error);

        res.status(500).json({
            Response: "False",
            Error: "Unable to fetch movie data."
        });
    }
});

app.listen(PORT, () => {
    console.log(`CineScope server running on port ${PORT}`);
});
