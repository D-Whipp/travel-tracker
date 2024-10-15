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
    console.log('DB ROWS', res.rows);

    res.rows.forEach(function (code) {
      console.log('forEach: ', code.country_code);
      data.push(code.country_code);
    });

    dbRowLength = res.rows.length;
    countryCode = res.rows.country_code;
    // data = res.rows.length;
    console.log('COUNTRY CODE: ', data);
    console.log('Variables: ' + dbRowLength + ' : ' + data);
    // console.log('DATA: ', data);
  }
});

let dbRowLength;
let countryCode = [];
let data = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  //Write your code here.
  console.log('ROOT IS LISTENING.');
  res.render('index.ejs', {
    total: dbRowLength,
    countries: data,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
