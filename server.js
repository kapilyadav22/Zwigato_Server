const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const https = require('https');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/restaurants', async (req, res) => {
    const { lat, lng, page_type } = req.query;
    const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=${page_type}`;

    await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('An error occurred');
        });
});

app.get('/api/menu', async (req, res) => {
    const { page_type, complete_menu, lat, lng, submitAction, restaurantId } = req.query;

    const url = `https://www.swiggy.com/dapi/menu/pl?page-type=${page_type}&complete-menu=${complete_menu}&lat=${lat}&lng=${lng}&submitAction=${submitAction}&restaurantId=${restaurantId}`;

    await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('An error occurred');
        });
});

app.get('/', (req, res) => {
    res.json({ "test": "Welcome to Zwigato!" });
});

const key = fs.readFileSync(process.env.SSL_KEY_PATH);
const cert = fs.readFileSync(process.env.SSL_CERT_PATH);

try {
    const options = {
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert)
    };
    
    https.createServer(options, app).listen(port, () => {
        console.log(`HTTPS Server running on port ${port}`);
    });
} catch (error) {
    console.error('SSL certificates not found. Running HTTP server only.');
    app.listen(port, () => {
        console.log(`HTTP Server listening on port ${port}`);
    });
}