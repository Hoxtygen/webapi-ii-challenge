const express = require('express');
const cors = require('cors');
const postsRoute = require('./routes/postRoutes')

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: false}))
server.use(cors());

server.use('/api/posts', postsRoute);

server.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the wild west, where posts can, and will make you reflect'
    })
})



server.listen(4001, () => console.log('server running on port 4001'))