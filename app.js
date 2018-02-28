const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost/rotten-potatoes');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const Review = mongoose.model('Review', {
  title: String,
  description: String,
  movieTitle: String
});

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
  // console.log(req.body)
  Review.create(req.body).then((review) => {
    console.log(review)
    res.redirect('/reviews/' + review._id)
  }).catch((err) => {
    console.log(err.message)
  })
})

// SHOW
app.get('/reviews/:id', (req, res) => {
  Review.findById(req.params.id).then((review) => {
    res.render('reviews-show', { review: review })
  }).catch((err) => {
    console.log(err.message)
  })
})

app.listen(3000, () => {
  console.log('App listening on port 3000')
})
