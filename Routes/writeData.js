const router = require('express').Router();
const fs = require('fs');
const csv = require('csv-parser');

router.put("/api/population/state/:state/city/:city", (req, res) => {
  const state = req.params.state;
  const city = req.params.city;
  const newPopulation = req.body.population;

  let alreadyExists = false;
  let updatedData = '';

  const readStream = fs.createReadStream('./city_populations.csv');
  const writeStream = fs.createWriteStream('./temp.csv');

  readStream
    .pipe(csv())
    .on('data', (data) => {
      if (data.state === state && data.city === city) {
        data.Population = newPopulation;
        updatedData = `${data.State},${data.City},${data.Population}\n`;
        alreadyExists = true;
      }

      // Write the original data to the temporary file
      writeStream.write(`${data.State},${data.City},${data.Population}\n`);
    })
    .on('end', () => {
      readStream.close();
      writeStream.end();

      if (alreadyExists) {
        // Overwrite the existing CSV file with the temporary file
        fs.writeFileSync('./city_populations.csv', fs.readFileSync('./temp.csv'));
        fs.unlinkSync('./temp.csv');

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
