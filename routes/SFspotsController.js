const router = require('express').Router();
const axios = require('axios');
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa');

const Spot = require('../database/SFspotsModel');

// console.log('spot model: ', Spot);

// const checkJwt = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://sagdi.auth0.com/.well-known/jwks.json`
//   }), 
//   audience: 'ZtCjLTpzf42UPGax1r5PwtptTP8JwMwA',
//   issuer: 'https://sagdi.auth0.com/',
//   algorithms: ['RS256']
// });

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
      // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.790754,-122.451414&name=&keyword=study,quiet&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
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
    const {lat, lng} = req.query
    console.log(lat, lng);
    axios.get(
        // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&name=&keyword=study,quiet&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&name=&keyword=coffee&rankby=distance&key=${process.env.gmapsapi}&type=cafe`
      ).then(response => {
          // console.log('gmaps response: ', response.data)
          // res.status(200).json(response.data.results)
          res.json(response.data.results)
        })
        .catch(err => res.status(500).json({ error: err }));
  })

router.route('/photo')
  .get((req, res) => {
    axios({
      method: 'get',
      url: 'http://bit.ly/2mTM3nY',
      responseType: 'stream'
    })
      .then(function (response) {
        response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
      });
  })

  // .get((req, res) => {
  //   axios.get(
  //     `https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyBteViGo-N3uCUN2NWHlAnPg1ow8hOoplk&photoreference=CmRaAAAAatRnbGQcNn2Lu23dL30yedDqUaFslwk0vHeUkB5Uuypn-MsrBFIiyTWYRZpS6eSPXwJ1OaXquTIZ4Wc6_WDiRRw8YUKnxKHt30374R8QLGbrIJUhetIDHOOWncnPyeo3EhDXQpkhWC9y3NNERenNFTMsGhSzAcuWrTo-sqAy7VdD4VSZfsg8Rw&maxheight=500`, {
  //     responseType: 'arraybuffer'
  //   })
  //   .then(response => Buffer.from(response.data, 'binary').toString('base64'))
  //   .catch(err => res.status(500).json({ error: err }));

  // })

module.exports = router;

// .get('https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyBteViGo-N3uCUN2NWHlAnPg1ow8hOoplk&photoreference=CmRaAAAAatRnbGQcNn2Lu23dL30yedDqUaFslwk0vHeUkB5Uuypn-MsrBFIiyTWYRZpS6eSPXwJ1OaXquTIZ4Wc6_WDiRRw8YUKnxKHt30374R8QLGbrIJUhetIDHOOWncnPyeo3EhDXQpkhWC9y3NNERenNFTMsGhSzAcuWrTo-sqAy7VdD4VSZfsg8Rw&maxheight=500', {
//   responseType: 'arraybuffer'
// })
// .then(response => Buffer.from(response.data, 'binary').toString('base64'))