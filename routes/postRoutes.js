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

route.post('/', async (req, res) => {
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
        const newPostData = await postsModel.findById(validPost.id)
        res.status(201).json({
            //newPost
            newPostData
        })
    } catch (error) {
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        })
    }
});

route.get('/:id/comments', async (req, res) => {
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
});

route.post('/:id/comments', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { text } = req.body;
    if (Number.isNaN(id) || id % 1 != 0 || id < 0) {
        return res.status(400).json({
            message: 'Invalid id provided'
        })
    }
    try {
        const post = await postsModel.findById(id);
        if (post.length) {
            if (!text) {
               return res.status(400).json({
                errorMessage: "Please provide text for the comment."
               }) 
            }
            const newComment = {
                text,
                post_id: id
            }
            try {
                const newCommentId = await postsModel.insertComment(newComment);
                const newCommentData = await postsModel.findCommentById(newCommentId.id);
                return res.status(201).json(newCommentData);
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: "There was an error while saving the comment to the database"
                })
            }
        }
        return res.status(404).json({
            message: "The post with the specified ID does not exist." 
        })

    } catch (error) {
        res.status(500).json({
            errorerror: 'The post information could not be retrieved.',
        })
    }
})

route.put('/:id', async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const { body } = req;
    try {
        const post = await postsModel.findById(id);
        if (post.length) {
            if(!body.title || !body.contents) {
                return res.status(400).json({
                    status: 400,
                    errorMessage: "Please provide title and content for the user."
                })
            }
            const updatedPost = await postsModel.update(id, body);
            return res.status(200).json(updatedPost)
        } else {
            return res.status(404).json({
                status: 400,
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: "The post could not be modified."
        })
    }
})



module.exports = route;