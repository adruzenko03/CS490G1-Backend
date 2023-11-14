const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Mock signup endpoint
app.post('/signup', (req, res) => {
  // Log the request body to see what's being sent by the client
  console.log(req.body);

  // Send back a dummy response
  res.status(201).json({ message: 'User registered successfully!', user: req.body });
});

app.post('/coach-survey', (req, res) => {
    // Log the request body to see what's being sent by the client
    console.log(req.body);
  
    // Send back a dummy response
    res.status(201).json({ message: 'Coach Survey data recieved successfully!'});
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
