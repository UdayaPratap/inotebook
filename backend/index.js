const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
connectToMongo();
const app = express();
const port = 5000;

app.use(cors())
app.use(express.json()); 
//AVAILABLE ROUTES
app.use('/api/auth', cors(), require('./routes/auth'));
app.use('/api/notes', cors(), require('./routes/notes'));


app.listen(port, () => {
  console.log(`iNoteBook Backend working on port ${port}`)
}); 