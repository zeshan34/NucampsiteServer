const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const user = require('../models/user');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);


            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //Query DB, look for favorite object with user in the request
        Favorite.findOne({ user: req.user })
            .then(favorites => {
                if (favorites) {
                    req.body.forEach(favorite => {
                        if (!favorite.campsites.includes(favorite._id)) {
                            favorite.campsites.push(favorite._id);
                        }
                    });
                    favorites.save()
                        .then(favorits => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', '/application/json');
                            res.json(favorites);
                        })
                        .catch(err => next(err));
                }

                else {
                    Favorite.create({
                        user: req.user._id,
                        campsites: req.body
                    })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            }).catch(err => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 200;
        res.end('PUT operation is not supported on /favorite')

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));

    })

favoriteRouter.route(':campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', '/application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    } else {
                        res.statusCode = 200;
                        res.end(`That campsite with id: ${req.params.campsiteId} is already a favorite!`)
                    }

                } else {
                    Favorite.create({
                        user: req.user._id, campsites: [req.params.campsiteId]
                    })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', '/application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                    }
            })
            .catch(err => next(err))
        })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}`);
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                   
                    const index = favorite.campsites.findIndex(x => x._id == req.params.campsiteId);
                    console.log(index)
                    if (index >= 0) {
                        favorite.campsites.splice(index, 1);
                    }
                 
                    favorite.save()
                        .then(favorite => {
                            console.log('Favorite Campsite Deleted');
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                            res.end(`The campsite with id ${req.params.campsiteId} is deleted`)
                        })
                        .catch(err => next(err));
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', '/application/json');
                    res.json(favorite);
                }
            }).catch(err => next(err));
    });

module.exports = favoriteRouter;