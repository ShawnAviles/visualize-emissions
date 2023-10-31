const express = require('express');
const app = express();
const port = 3000;
const healthRoutes = require('./routes/healthRoutes');
const routes = require('./routes/routes');

app.use('/health', healthRoutes);
app.use('/routes', routes);









app.listen(port, () => console.log(`App listening on port ${port}!`));