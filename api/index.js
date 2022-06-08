const express = require('express');
const apiRouter = express.Router();

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;