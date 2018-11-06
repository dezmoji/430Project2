const models = require('../models');

const Post = models.Post;

const dashPage = (req, res) =>{
    res.render('app', { csrfToken: req.csrfToken() });
};

const getPosts = (request, response) =>{

};

module.exports.dashPage = dashPage;
module.exports.getPosts = getPosts;