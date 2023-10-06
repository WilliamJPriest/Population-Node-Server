const router = require('express').Router();
const fs = require('fs');
const csv = require('csv-parser');

router.put("/api/population/state/:state/city/:city", (req, res) => {
  const regex = /(\b[a-z](?!\s))/g
  const state = req.params.state.replace(regex, function(x){return x.toUpperCase();});
  const city = req.params.city.replace(regex, function(x){return x.toUpperCase();});
  const newPopulation = req.body.population;

  let alreadyExists = false;

  const result = [];

fs.createReadStream('./city_populations.csv')
    .pipe(csv())
    .on('data', (data) => result.push(data))
    .on('end', () => { 
  
      result.forEach((info) => {
        if (info.city === city && info.state === state) {
          info.population = newPopulation;

          alreadyExists = true;
        }
        
      });

      if (alreadyExists) { 
        const writeStream = fs.createWriteStream('./city_populations.csv');
        writeStream.write('city,state,population\n')
        result.forEach((info) => {
          writeStream.write(`${info.city},${info.state},${info.population}\n`);
          alreadyExists = false
        })
        
        writeStream.end(() => {
          return res.status(200).json({
            message: 'Population data updated successfully.',
          });
        });
      } else {
        fs.appendFile('./city_populations.csv', `${city},${state},${newPopulation}\n`, (err) => {
          if (err) {
            return res.status(500).json({
              message: 'Error updating population data.',
            });
          }
          return res.status(201).json({
            message: 'Population data created successfully.',
          });
        });
      }
    });
});
module.exports = router;
