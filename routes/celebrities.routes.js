//jshint esversion:8
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
// all your routes here

/************************* CREATE CELEBRITY *****************************/

router.get('/celebrities/create', (req, res, next) =>  {

    res.render('celebrities/new-celebrity');
});

router.post('/celebrities/create', (req, res, next) =>  {
    const {name, occupation, catchPhrase} = req.body;

    Celebrity.create({name, occupation, catchPhrase})
        .then(dbCelebrities => {
            //console.log(dbCelebrities);
            res.redirect('/celebrities');
        })

        .catch(err => {
            res.render('celebrities/new-celebrity');
            console.log('Something went wrong while creating new celebrity', err);
        });
});

/************************* ALL CELEBRITIES *****************************/

router.get('/celebrities', (req, res, next) =>  {

    Celebrity.find()
        .then( celebritiesFromDB => {
            //console.log(celebritiesFromDB);
            res.render('celebrities/celebrities', {celebrities: celebritiesFromDB});
        })
        .catch(err => {
            console.log('Something went wrong while getting celebrities from DB', err);
        });
});

/************************* CELEBRITY DETAILS *****************************/

router.get('/celebrities/:id', (req, res, next) =>  {
    const celebrityId = req.params.id;
    //console.log('This is the celebrity id =>',celebrityId);
    Celebrity.findById(celebrityId)
        .then(dbCelebrity => {
            //console.log(dbCelebrity);
            res.render('celebrities/celebrity-details', {dbCelebrity});
        })
        .catch(err => {
            console.log('Something went wrong while getting celebrity from DB =>', err);
        });
    
});

/************************* CELEBRITY UPDATE *****************************/


router.get('/celebrities/:id/edit', (req, res, next) =>  {
    const celebrityId = req.params.id;
    //console.log('This is the celebrity id =>',celebrityId);
    Celebrity.findById(celebrityId)
        .then(dbCelebrity => {
            //console.log(dbCelebrity);
            res.render('celebrities/edit-celebrity', {dbCelebrity});
        })
        .catch(err => {
            console.log('Something went wrong while getting celebrity from DB =>', err);
        });
            
});

router.post('/celebrities/:id/edit', (req, res, next) =>  {
    
    const {name, occupation, catchPhrase} = req.body;
    const celebrityId = req.params.id;
    
    Celebrity.findByIdAndUpdate(celebrityId, {name, occupation, catchPhrase}, {new: true})
        .then(updatedCelebrity => {
            console.log('Celebrity successfully updated =>', updatedCelebrity);
            res.redirect('/celebrities');
        })
        .catch(err => {
            console.log('Something went wrong while updating celebrity =>', err);
        });
    
});

/************************* CELEBRITY DELETE *****************************/


router.post('/celebrities/:id/delete', (req, res, next) =>  {

    const celebrityId = req.params.id;
    console.log('This is the celebrity id =>',celebrityId);
    Celebrity.findByIdAndRemove(celebrityId)
        .then(() => {
            console.log('Celebrity successfully deleted.');
            res.redirect('/celebrities');
        })
        .catch(err => {
            console.log('Something went wrong while deleting celebrity from DB =>', err);
        });
    
});

module.exports = router;