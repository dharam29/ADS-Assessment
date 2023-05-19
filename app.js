import express from 'express';
import connection from './db.js';
import readCSVData from './read-csv.js';
import readJSONData from './read-json.js';

const app = express();

app.use(express.json());

app.get('/populate', async(req, res) => {
    // Insert data into MySQL table
    const insertData = (data) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO test_table SET ?';
        connection.query(sql, data, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
        });
    });
    };

    // Insert JSON and CSV data in parallel
    Promise.all([readJSONData(), readCSVData()])
    .then(([jsonData, csvData]) => {
        const allData = jsonData.concat(csvData);

        // Perform parallel insertions
        const insertPromises = allData.map(data => insertData(data));
        return Promise.all(insertPromises);
    })
    .then(results => {
        console.log('Data inserted successfully');
    // Handle results as needed
    })
    .catch(err => {
        console.error('Error inserting data:', err);
    });
});

app.post('/search', async(req, res) => {
    // console.log(req.body);
    const { name, email, body, limit, sort } = req.body;

    let query = 'SELECT * FROM test_table';

    const conditions = [];
    const values = [];

    if (name) {
        conditions.push('name LIKE ?');
        values.push(`%${name}%`);
    }
    if (email) {
        conditions.push('email LIKE ?');
        values.push(`%${email}%`);
    }
    if (body) {
        conditions.push('body LIKE ?');
        values.push(`%${body}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort) {
        const sortField = sort.charAt(0) === '-' ? sort.substr(1) : sort;
        const sortOrder = sort.charAt(0) === '-' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    if (limit) {
        query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    connection.query(query, values, (err, results) => {
        if (err) {
        console.error('Error searching data:', err);
        res.status(500).json({ error: 'An error occurred while searching data' });
        } else {
        res.json(results);
        }
    });
});

const port = 9000;

app.listen(port, () => {
    console.log('listening on port ', port);
});