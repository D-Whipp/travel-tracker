import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
});
db.connect();

db.query('SELECT * FROM visited_countries', (err, res) => {
  if (err) {
    console.log('Error executing query', err.stack);
  } else {
    res.rows.forEach(function (code) {
      data.push(code.country_code);
    });

    dbRowLength = res.rows.length;
    countryCode = res.rows.country_code;
  }
});

let dbRowLength;
let countryCode = [];
let data = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.get('/', async (req, res) => {
//Write your code here.
// const response = db.query(
//   'SELECT * FROM visited_countries',
//   (err, res) => {
//     if (err) {
//       console.log('Error executing query', err.stack);
//     } else {
//       res.rows.forEach(function (row) {
//         data.push(row.country_code);
//       });

//       dbRowLength = res.rows.length;
//       // countryCode = res.rows; // returns undefined

//       console.log('ROW LENGTH: ', dbRowLength);
//       // console.log('COUNTRY CODE: ', countryCode);
//       console.log('Data: ', data);
//     }
//   }
// );

//   res.render('index.ejs', {
//     total: dbRowLength,
//     countries: data,
//   });
// });

// GET home page
app.get('/', async (req, res) => {
  const result = await db.query(
    'SELECT country_code FROM visited_countries'
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render('index.ejs', {
    countries: countries,
    total: countries.length,
  });
  db.end();
});

app.post('/add', async (req, res) => {
  try {
    const userInput = req.body.country.toLowerCase();
    const dbCheck = await db.query('SELECT * FROM countries');

    dbCheck.rows.forEach(function (row) {
      if (
        userInput === row.country_name.toLowerCase() ||
        userInput === row.country_code.toLowerCase()
      ) {
        console.log('PRE DATA:', data);
        if (data.includes(row.country_code)) {
          console.log('Present');
          // return;
        } else {
          console.log('NOT present');
          db.query(
            'INSERT INTO visited_countries (country_code) VALUES($1)',
            [row.country_code]
          );
          data.push(row.country_code);
          dbRowLength = dbRowLength + 1;
        }
        console.log('POST DATA: ', data);
      }
      // res.render('index.ejs', {
      //   total: dbRowLength,
      //   countries: data,
      // });

      // res.redirect(`http://localhost:${port}`);
    });

    res.redirect(req.get('referer'));
    console.log('ROW LENGTH: ', dbRowLength);
    console.log('DATA: ', data);
    // db.end();
    // res.render('index.ejs', {
    //   total: dbRowLength,
    //   countries: data,
    // });
  } catch (error) {
    res.status(500).json({ message: 'Error with request' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
