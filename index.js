const express = require('express');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: false}))
server.use(cors());



server.listen(4001, () => console.log('server running on port 4001'))