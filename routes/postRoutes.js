const express = require('express');
const postsModel = require('../data/db');

const route = express.Router()


route.get('/', async(req, res) => {
    try {
        const posts = await postsModel.find(req.query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            error: "The posts information could not be retrieved."
        });
    }
})



module.exports = route;