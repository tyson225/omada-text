const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createPostValidator,
  searchPostValidator,
  addCommentValidator,
} = require('../middleware/express-validation/postValidator');

const getPosts = require('../functions/postFunctions/getPosts');
const mostLiked = require('../functions/postFunctions/mostLiked');
const mostRecent = require('../functions/postFunctions/mostRecent');
const mostComments = require('../functions/postFunctions/mostComments');
const showPost = require('../functions/postFunctions/showPost');
const showUserPosts = require('../functions/postFunctions/showUserPosts');
const userPosts = require('../functions/postFunctions/userPosts');
const createPost = require('../functions/postFunctions/createPost');
const searchForPost = require('../functions/postFunctions/searchForPost');
const likePost = require('../functions/postFunctions/likePost');
const addComment = require('../functions/postFunctions/addComment');
const likeComment = require('../functions/postFunctions/likeComment');
const deletePost = require('../functions/postFunctions/deletePost');
const deletePostLike = require('../functions/postFunctions/deletePostLike');
const deleteComment = require('../functions/postFunctions/deleteComment');
const deleteCommentLike = require('../functions/postFunctions/deleteCommentLike');

router.get('/posts', getPosts);

router.get('/posts/most-liked', mostLiked);

router.get('/posts/most-recent', mostRecent);

router.get('/posts/most-comments', mostComments);

router.get('/post/:post_id', showPost);

router.get('/user_posts/:user_id', showUserPosts);

router.get('/user_posts/', auth, userPosts);

router.post('/', auth, createPostValidator, createPost);

router.post('/search-for-post', searchPostValidator, searchForPost);

router.put('/likes/:post_id', auth, likePost);

router.put('/add-comment/:post_id', auth, addCommentValidator, addComment);

router.put('/like-comment/:post_id/:comment_id', auth, likeComment);

router.delete('/delete-post/:post_id', auth, deletePost);

router.delete('/delete-post-like/:post_id/:like_id', auth, deletePostLike);

router.delete('/remove-comment/:post_id/:comment_id', auth, deleteComment);

router.delete(
  '/remove-like-from-comment/:post_id/:comment_id/:like_id',
  auth,
  deleteCommentLike
);

module.exports = router;
