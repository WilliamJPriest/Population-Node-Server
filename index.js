const https = require('http');
const express = require('express');
const app=express();

const hostname = '127.0.0.1';
const port = 5555;

app.use(express.json()); 

const getRoute = require('./Routes/readData');
const putRoute = require('./Routes/writeData');


app.get("/api/population/state/:state/city/:city", getRoute);
app.put("/api/population/state/:state/city/:city", putRoute)

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});