const express = require('express');
const app = express();
const port = 3000;
const health = require('./routes/health');
const routes = require('./routes/routes');

app.use('/health', health);
app.use('/routes', routes);

app.listen(port, () => console.log(`App listening on port ${port}!`));