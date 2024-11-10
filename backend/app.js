const express = require('express');
const app = express();
const validateTokenRoute = require('./routes/validateToken');

app.use(express.json());
app.use('/api', validateTokenRoute);

// ...existing code...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
