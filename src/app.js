const express = require('express');
const bodyParser = require('body-parser');
const replaceRoutes = require('../routes/replacer.routes');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', replaceRoutes);


app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
