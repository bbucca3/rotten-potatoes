const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const app = express();

mongoose.connect('mongodb://localhost/rotten-potatoes');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const Review = mongoose.model('Review', {
  title: String
});

app.get('/', (req, res) => {
  Review.find().then((reviews) => {
    res.render('reviews-index', { reviews: reviews })
  }).catch((err) => {
    console.log(err)
  })
})

app.listen(3000, () => {
  console.log('App listening on port 3000')
})
