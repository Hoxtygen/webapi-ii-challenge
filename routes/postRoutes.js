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

route.post('/', async(req, res) => {
    try {
        const { title, contents } = req.body;
        const newPost = { title, contents }
        if (!title || !contents) {
            return res.status(400).json({
                status: 400,
                errorMessage: "Please provide title and contents for the post."
            })
        }
        const validPost = await postsModel.insert(req.body);
        res.status(201).json({
            newPost
        })
    } catch (error) {
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        })
    }
});

route.get('/:id/comments', async(req, res) => {
    try {
        const { id } = req.params;
        const post = await postsModel.findById(id);
        if (post.length) {
            const posts = await postsModel.findPostComments(id);
            res.status(200).json(posts);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "The comments information could not be retrieved." 
        })
    }
})


module.exports = route;