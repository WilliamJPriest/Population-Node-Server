const router = require('express').Router();
const fs = require('fs');
const csv = require('csv-parser');

router.get("/api/population/state/:state/city/:city", (req, res) => {
  const regex ='#(\s|^)([a-z0-9-_]+)#i'
  const state = req.params.state.replace(regex)
  const city = req.params.city.replace(regex)
  console.log(state)
  console.log(city)
  const results = [];

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