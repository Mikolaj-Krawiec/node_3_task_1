const express = require('express');
const path = require('path');
const app = express();

const messages = [];

app.use(express.static('client'));

app.use('/*/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen('8000', () => {
    console.log('server running on port 8000');
})