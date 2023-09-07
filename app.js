const { log } = require('console');
const express = require('express');
const fs = require('fs');

const app = express();

//Middleware
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params.id);
  const id = req.params.id * 1;

  if (tours.length < id) {
    res.status(404).json({
      status: 'Failed',
      message: 'Invalid tour id',
    });
  }

  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  console.log(newTour);
  // res.send('Done  ');
});
app.patch('/api/v1/tours/:id', (req, res) => {
  console.log(req.params.id);
  const id = req.params.id * 1;

  if (tours.length < id) {
    res.status(404).json({
      status: 'Failed',
      message: 'Invalid tour id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedTour: 'Updated Tour',
    },
  });
});
const port = 3080;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
