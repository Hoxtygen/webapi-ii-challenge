const express = require('express');
const postsModel = require('../data/db');

const route = express.Router()


route.get('/', async (req, res) => {
    try {
        const posts = await postsModel.find(req.query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            error: "The posts information could not be retrieved."
        });
    }
})

route.get('/:id', async (req, res) => {
    try {
        const post = await postsModel.findById(parseInt(req.params.id, 10));
        if (post.length) {
            return res.status(200).json({
                post
            });
        } else {
           return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const post = await postsModel.remove(parseInt(req.params.id, 10));
        if (post) {
            return res.status(200).json({
                message: 'post successfully deleted'
            });
        } else {
           return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "The post could not be removed"
        })
    }
})


module.exports = route;