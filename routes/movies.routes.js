//jshint esversion:8
const router = require("express").Router();

const Movie = require('../models/Movie.model');
const Celebrity = require("../models/Celebrity.model");
const { db } = require("../models/Celebrity.model");
// all your routes here

/************************* CREATE MOVIE *****************************/

router.get('/movies/create', (req, res, next) =>  {
    Celebrity.find()
        .then(dbCelebrities => {
            res.render('movies/new-movie', {dbCelebrities});
        })
        .catch(err => {
            res.render('celebrities/new-celebrity');
            console.log('Something went wrong while displaying movie-create view =>', err);
        });
    
});

router.post('/movies/create', (req, res, next) =>  {

    const {title, genre, plot, cast} = req.body;
    //console.log(title, genre, plot, cast);

    Movie.create({title, genre, plot, cast})
        .then(dbMovie => {
            //console.log(dbMovie);
            res.redirect('/movies');
        })
        .catch(err => {
            console.log('Something went wrong while creating new movie =>', err);
        });
});

/************************* ALL MOVIES *****************************/

router.get('/movies', (req, res, next) =>  {
    Movie.find()
        .then(dbMovies => {
            //console.log(dbMovies);
            res.render('movies/movies', {dbMovies});
        })
        .catch(err => {
            console.log('Something went wrong while getting movies from DB =>', err);
        });
    
});

/************************* MOVIE DETAILS *****************************/

router.get('/movies/:id', (req, res, next) =>  {
    const movieId = req.params.id;
    //console.log('This is the movie id =>',movieId);
    Movie.findById(movieId)
        .populate('cast')
        .then(dbMovie => {
            //console.log(dbMovie);
            res.render('movies/movie-details', {dbMovie});
        })
        .catch(err => {
            console.log('Something went wrong while getting movie from DB =>', err);
        });
    
});

/************************* MOVIE DELETE *****************************/


router.post('/movies/:id/delete', (req, res, next) =>  {

    const movieId = req.params.id;
    console.log('This is the movie id =>',movieId);
    Movie.findByIdAndRemove(movieId)
        .then(() => {
            console.log('Movie successfully deleted.');
            res.redirect('/movies');
        })
        .catch(err => {
            console.log('Something went wrong while deleting movie from DB =>', err);
        });
    
});


/************************* MOVIE UPDATE *****************************/


router.get('/movies/:id/edit', (req, res, next) =>  {
    const movieId = req.params.id;
    //console.log('This is the movie id =>',movieId);
    Movie.findById(movieId)
        .populate('cast')
        .then(dbMovie => {
            Celebrity.find()
            .then(dbCelebrities => {
                
                let castIds = [];
                dbMovie.cast.forEach(celeb => {
                    //to use castId.id instead of castId._id makes the id a string instead of new ObjectId(f9nn46fgh54fghb5364fn)
                    castIds.push(celeb.id);
                });

                dbCelebrities.forEach(celeb => {

                    //console.log(castIds.includes(celeb.id));

                    if (castIds.includes(celeb.id)) {
                        celeb.isInCast = true;
                    } else {
                        celeb.isInCast = false;
                    }

                });
                console.log(dbCelebrities[2].isInCast);

                res.render('movies/edit-movie', {dbMovie, dbCelebrities});
            })
            .catch(err => {
                console.log('Something went wrong while getting celebrities from DB =>', err);
            });
            
        })
        .catch(err => {
            console.log('Something went wrong while getting movie from DB =>', err);
        });
});

router.post('/movies/:id/edit', (req, res, next) =>  {
    
    const {title, genre, plot, cast} = req.body;
    const movieId = req.params.id;
    
    Movie.findByIdAndUpdate(movieId, {title, genre, plot, cast}, {new: true})
        .then(updatedMovie => {
            console.log('Movie successfully updated =>', updatedMovie);
            res.redirect('/movies');
        })
        .catch(err => {
            console.log('Something went wrong while updating movie =>', err);
        });
    
});


module.exports = router;