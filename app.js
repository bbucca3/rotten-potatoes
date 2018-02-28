const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const Review = require('./models/review');
const Comment = require('./models/comment');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');

// INDEX
app.get('/', (req, res) => {
  Review.find().then((reviews) => {
    res.render('reviews-index', { reviews: reviews })
  }).catch((err) => {
    console.log(err)
  })
})

// NEW
app.get('/reviews/new', (req, res) => {
  res.render('reviews-new', {})
})

// CREATE
app.post('/reviews', (req, res) => {
  Review.create(req.body).then((review) => {
    console.log(review)
    res.redirect('/reviews/' + review._id)
  }).catch((err) => {
    console.log(err.message)
  })
})

// SHOW
app.get('/reviews/:id', (req, res) => {
  const findReviews = Review.findById(req.params.id)
  const findComments = Comment.find({ reviewId: Object(req.params.id) })

  Promise.all([findReviews, findComments]).then((values) => {
    console.log(values)
    res.render('reviews-show', { review: values[0], comments: values[1] })
  }).catch((err) => {
    console.log(err.message)
  })
})

// EDIT
app.get('/reviews/:id/edit', (req, res) => {
  Review.findById(req.params.id, (err, review) => {
    res.render('reviews-edit', { review: review })
  })
})

// UPDATE
app.put('/reviews/:id', (req, res) => {
  Review.findByIdAndUpdate(req.params.id, req.body).then((review) => {
    res.redirect('/reviews/' + review._id)
  }).catch((err) => {
    console.log(err.message)
  })
})

// DELETE
app.delete('/reviews/:id', function (req, res) {
  console.log("DELETE review")
  Review.findByIdAndRemove(req.params.id).then((review) => {
    res.redirect('/');
  }).catch((err) => {
    console.log(err.message);
  })
})

// NEW Comment
app.post('/reviews/comment', (req, res) => {
  Comment.create(req.body).then((comment) => {
    res.redirect('/reviews/' + comment.reviewId)
  }).catch((err) => {
    console.log(err.message)
  })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
