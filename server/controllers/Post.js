const models = require('../models');

const Post = models.Post;

const dashPage = (req, res) =>{
    res.render('app', { csrfToken: req.csrfToken() });
};

const addPost = (req, res) => {
    if(!req.body.title || !req.body.text){
        return res.status(400).json({ error: 'All fields are required' });
    }; 

    const postData = {
        title: req.body.title,
        text: req.body.text,
        tags: [],
        owner: req.session.account._id
    };

    const newPost = new Post.PostModel(postData);

    const postPromise = newPost.save();

    postPromise.then(() => res.json({ redirect: '/dashboard' }));

    postPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Post already exists' });
        }
        return res.status(400).json({ error: 'An error occured' });
  });

  return postPromise;
};

const getPosts = (request, response) =>{
    const req = request;
    const res = response;
  
    return Post.PostModel.findMostRecent((err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
  
      return res.json({ posts: docs, userID: req.session.account._id });
    });
};

const deletePost = (request, response) => {
    const req = request;
    const res = response;
  
    return Post.PostModel.removeByID(req.body._id, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.status(204).json();
    });
  };

module.exports.dashPage = dashPage;
module.exports.getPosts = getPosts;
module.exports.addPost = addPost;
module.exports.deletePost = deletePost;