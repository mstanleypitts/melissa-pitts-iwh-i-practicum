require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DO NOT include your private app access token in your repo.
// Store it in a .env file and access it via process.env
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE_ID = '2-60116074';

// ROUTE 1 - Homepage: fetch all pets and render table
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}?properties=name,breed,bio`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Pets | HubSpot Custom Objects', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - GET form to add a new pet record
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 3 - POST form data to create a new pet record, then redirect home
app.post('/update-cobj', async (req, res) => {
    const newPet = {
        properties: {
            name: req.body.name,
            breed: req.body.breed,
            bio: req.body.bio
        }
    };
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, newPet, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
