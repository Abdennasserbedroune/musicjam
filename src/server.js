'use strict';

require('dotenv').config();

const app = require('./app');

const port = parseInt(process.env.PORT, 10) || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
