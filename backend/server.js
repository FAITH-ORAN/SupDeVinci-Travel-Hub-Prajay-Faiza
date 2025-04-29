require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoute = require('./src/routes/authRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', authRoute);

const PORT = process.env.PORT || 3000;
app.use('/', authRoute);
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});