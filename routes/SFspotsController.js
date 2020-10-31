const router = require('express').Router();
const axios = require('axios');
// const jwt = require('express-jwt')
// const jwksRsa = require('jwks-rsa');
const fs = require('fs')

const Spot = require('../database/SFspotsModel');

// console.log('spot model: ', Spot);

router.route('/')
  .get((req, res) => {
    Spot.find()
      .then(spots => {
        res.status(200).json(spots);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  })
  // .post(checkJwt, (req, res) => {
  //   const newSpot = req.body;
  //   newSpot.author = req.user.name;
  //   const spot = new Spot(newSpot);


  //   spot.save()
  //     .then(spot => {
  //       res.status(201).json(spot);
  //     })
  //     .catch(err => {
  //       res.status(500).json({ error: err });
  //     });
  // });

router.route('/coffeelist')
  .get((req, res) => {
    axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.790754,-122.451414&name=&keyword=quiet,study&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
      // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.3107513,69.287446&name=&keyword=coffee&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
    ).then(response => {
      res.json(response.data.results)
    })
  })

router.route('/libraries')
  .get((req, res) => {
    axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.790754,-122.451414&name=library&keyword=library&rankby=distance&key=${process.env.gmapsapi}&type=library`
    ).then(response => {
      res.json(response.data.results)
    })
  })

router.route('/current')
  .get((req, res) => {
    // const {lat, lng} = req.query
    const lat = req.query.lat;
    const lng = req.query.lng;
    console.log("location: ", lat, lng);
    axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&name=&keyword=quiet&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
        // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&name=&keyword=coffee&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
      ).then(response => {
          // console.log('gmaps response: ', response.data)
          // res.status(200).json(response.data.results)
          res.json(response.data.results)
        })
        .catch(err => res.status(500).json({ error: err }));
  })

router.route('/photo')
  .get((req, res) => {
    const { photoreference } = req.query;
    // console.log(photoreference)
    axios.get(
      `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.gmapsapi}&photoreference=${photoreference}&maxheight=300`
    )
    .then(response => {
      res.send(response.request.res.responseUrl)
    })
    .catch(err => res.status(500).json({ error: err }));
  });

  // .get((req, res) => {
  //   axios({
  //     method: 'get',
  //     url: 'http://bit.ly/2mTM3nY',
  //     responseType: 'json'
  //   })
  //     .then(function (response) {
  //       // console.log(response.request.res.responseUrl);
  //       console.log(response.request.res.responseUrl);
  //       // res.send( response.data.request.res )
  //       res.send('check')
  //       // res.response.data.pipe(fs.createWriteStream('ada_lovelace.jpg')) 
  //     })
  //     .catch(err => res.send({ error: err }));

  // })

module.exports = router;