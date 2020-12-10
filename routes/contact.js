var express = require("express");
var router = express.Router();

const mailjet = require('node-mailjet').connect(
    "8d8957781a8ecfd93ed4315fcca05bc3",
    "9b9ba38442f174231847665ffbb37d59"
);

/* POST a new user */
router.post("/", function (req, res, next) {
    mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'dorian.fouvez@student.vinci.be',
              Name: req.body.from,
            },
            To: [
              {
                Email: 'dorian.fouvez@student.vinci.be',
                Name: 'dorian.fouvez@student.vinci.be',
              },
            ],
            Subject: req.body.subject,
            HTMLPart:
              req.body.message + '<br />May the delivery force be with you!',
          },
        ],
    })
    .then(result => {
        console.log(result.body);
        return res.json({ username: result.body });
    })
    .catch(err => {
        console.log(err.statusCode, err.message);
        return res.status(500).send(err.message);
    });
});

module.exports = router;