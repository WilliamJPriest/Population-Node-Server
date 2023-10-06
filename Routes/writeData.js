const router = require('express').Router();
const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');


router.put("/api/population/state/:state/city/:city", (req, res) => {
  const regex = /(\b[a-z](?!\s))/g
  const state = req.params.state.replace(regex, function(x){return x.toUpperCase();});
  const city = req.params.city.replace(regex, function(x){return x.toUpperCase();});
  const newPopulation = req.body.population;

  console.log(state)
  console.log(city)
  const results = [];
 

  let alreadyExists = false;
  let updatedData = '';

  const readStream = fs.createReadStream('./city_populations.csv');
  const writeStream = fs.createWriteStream('./temp.csv');

  readStream
    .pipe(csv())
    .on('data', (data) => {
        if (data.City === city && data.State == state) {
          data.Population = newPopulation;
          alreadyExists = true
        }
        results.push(data);
      })
    .on('end', () => {
      readStream.close();
      writeStream.end();

      if (alreadyExists) {
        const ws = fs.createWriteStream(csvFilename);
        ws.write('City,Population\n'); // Writing the header
        newData.forEach((row) => {
          ws.write(`${row.City},${row.State},${row.Population}\n`);
        });

        return res.status(200).json({
          message: 'Population data updated successfully.',
        });
      } else {
        // Append the new data to the CSV file
        fs.appendFileSync('./city_populations.csv', `${state},${city},${newPopulation}\n`);

        return res.status(201).json({
          message: 'Population data created successfully.',
        });
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      return res.status(500).json({
        error: 'Internal server error',
      });
    });
});

module.exports = router;
