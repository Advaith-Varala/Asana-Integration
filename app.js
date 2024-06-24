require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.json());


app.post('/webhook', (req, res) => {

    const signature = req.headers['x-hub-signature-256'];

    const payload = JSON.stringify(req.body);

    if (verifySignature(payload, signature)) {

        if (req.body.action === 'opened') {
            const issue = req.body.issue;
            if (issue) {
                createAsanaTask(issue);
            }
        }
        res.status(200).send('OK');
    } else {
        res.status(401).send('Signature verification failed');
    }
});

function verifySignature(payload, signature) {

    const hmac = crypto.createHmac('sha256', process.env.GITHUB_SECRET);

    const digest = `sha256=${hmac.update(payload).digest('hex')}`;

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function createAsanaTask(issue) {
    
    const headers = {
        'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const data = {
        name: issue.title,
        notes: issue.body,
        projects: [process.env.ASANA_PROJECT_ID],
        external: {
            data: issue.html_url
        },
        assignee: issue.user.login
    };

    axios.post('https://app.asana.com/api/1.0/tasks', data, { headers })
        .then(response => {
            console.log('Asana task created successfully');
        })
        .catch(error => {
            console.error('Failed to create Asana task:', error.response.data,"Data: ", data);
        });
}



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});