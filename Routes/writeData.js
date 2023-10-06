const router = require('express').Router();
const fs = require('fs');
const csv = require('csv-parser');

router.put("/api/population/state/:state/city/:city", (req, res) => {
  const regex = /(\b[a-z](?!\s))/g
  const state = req.params.state.replace(regex, function(x){return x.toUpperCase();});
  const city = req.params.city.replace(regex, function(x){return x.toUpperCase();});
  const newPopulation = req.body.population;



  let alreadyExists = false;

  const readStream = fs.createReadStream('./city_populations.csv');
  // const writeStream = fs.createWriteStream('./temp.csv');

  const updatedData = [];

  readStream
      .pipe(csv())
      .on('data', (data) => {
          if(data.city === city && data.state === state){
            data.population = newPopulation
            fs.createWriteStream('./city_populations.csv')
                .write(`${data[0]},${data[1]},${data[2]}\n`);
          }
          fs.createWriteStream('./city_populations.csv',)
          .write(`${data[0]},${data[1]},${data[2]}\n`);
          
      })
      .on('end', () => { 
        alreadyExists= true
        console.log(alreadyExists)
        // fs.writeFileSync('./city_populations.csv', '');
        // fs.createWriteStream('./city_populations.csv', { flags: 'a' })
        //     .write('City,State,Population\n');
      
        // updatedData.forEach((data) => {
        //     fs.createWriteStream('./city_populations.csv', { flags: 'a' })
        //         .write(`${data[0]},${data[1]},${data[2]}\n`);
        // });
        if (alreadyExists) {
          console.log("hi")
          return res.status(200).json({
            message: 'Population data updated successfully.',
          });
        } else {
          fs.appendFileSync('./city_populations.csv', `${city},${state},${newPopulation}\n`);

          return res.status(201).json({
            message: 'Population data created successfully.',
          });
        }})
      .on('error',()=>{

        })
      }
    )
  

module.exports = router;
