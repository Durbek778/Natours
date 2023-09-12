const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//! MIDDLEWARE
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from middleware 🦀');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(morgan('dev'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//! ROUTE HANDLERS

// Get all tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

// Get a tour
const getTour = (req, res) => {
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
};

// Create a new tour
const createTour = (req, res) => {
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
};

// Update the tour
const updateTour = (req, res) => {
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
};

// Delete the tour
const deleteTour = (req, res) => {
  console.log(req.params.id);

  if (tours.length < req.params.id * 1) {
    res.status(404).json({
      status: 'Failed',
      message: 'Invalid tour id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//! ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours:id').get(getTour).patch(updateTour).delete(deleteTour);

const port = 3080;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
