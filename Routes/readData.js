const router = require('express').Router();
const fs = require('fs');
const csv = require('csv-parser');

router.get("/api/population/state/:state/city/:city", (req, res) => {
  const regex = /(\b[a-z](?!\s))/g
  const state = req.params.state.replace(regex, function(x){return x.toUpperCase();});
  const city = req.params.city.replace(regex, function(x){return x.toUpperCase();});


  let results =[]

  fs.createReadStream('./city_populations.csv')
    .pipe(csv())
    .on('data', (data) => {
      if ( data.state === state && data.city === city) {
        results.push(data.population);

      }
    })
    .on('end', () => {
      if (results.length === 0) {
        return res.status(400).json({
          error: 'Population data not found for the specified state and city.',
        });
      }

      return res.status(200).json({
        population: results,
      });
    });
});



module.exports = router;