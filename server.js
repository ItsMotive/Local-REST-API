const express = require('express');
const studentRoutes = require('./src/student/routes')

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World")
});

app.use('/api/v1', studentRoutes)

app.use((req, res) => {
    res.status(404);
    res.json({ Message: "The requested URL was not found" });
});

app.listen(port, () => console.log(`App listening on port ${port}`));