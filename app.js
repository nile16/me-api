const express = require('express');
const WebSocket = require("ws");
const http = require("http");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var db = require('./db/database.js');
var jsonParser = bodyParser.json();
const mongo = require("mongodb").MongoClient;
//export JWT_SECRET='jfsdkjdgt7775jmcg678ncv67yvrn6v76yvm9x9xgckewlkwrgj845knjwgkljwe'

const secret = process.env.JWT_SECRET;
const saltRounds = 10;
const port = 1337;


async function addMessageToDb(msg) {
    const client  = await mongo.connect("mongodb://localhost:27017/chat",
        {useUnifiedTopology: true, useNewUrlParser: true });
    const db = await client.db();
    const col = await db.collection("messages");

    await col.insertOne(msg);
    await client.close();
}


async function getOldMessagesFromDb() {
    const client  = await mongo.connect("mongodb://localhost:27017/chat",
        {useUnifiedTopology: true, useNewUrlParser: true });
    const db = await client.db();
    const col = await db.collection("messages");
    let d = new Date();

    let timeLimit = d.getTime() - 86400000; // 24 hours ago

    await col.deleteMany( { time: { $lt: timeLimit } } );

    let res = await col.find().toArray();

    await client.close();

    return res;
}


app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}


wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};


wss.on("connection", async (ws/*ws, req*/) => {
    ws.send(JSON.stringify(await getOldMessagesFromDb()));

    ws.on("message", (msgJson) => {
        let d = new Date();
        let msg = JSON.parse(msgJson);

        msg.time = d.getTime();

        addMessageToDb(msg);

        wss.broadcast(JSON.stringify([msg]));
    });

    ws.on("error", (error) => {
        console.log(`Server error: ${error}`);
    });
});


app.get("/", (req, res) => {
    const data = {
        msg: "Detta API är en skapelse av Nils Leandersson"
    };

    res.json(data);
});


app.get("/reports/week:week", (req, res) => {
    db.all("SELECT * FROM reports WHERE week=?",
        req.params.week, (err, rows) => {
            if (err) {
                res.json(
                    {
                        error: "SQL failure",
                        details: err
                    }
                );
            } else if (rows[0]) {
                res.json({
                    report: rows[0].report
                });
            } else {
                res.json({
                    error: "Week does not exist"
                });
            }
        });
});


app.post("/register", jsonParser, (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        db.run("INSERT INTO users (name, birth, email, password) VALUES (?, ?, ?, ?)",
            req.body.name, req.body.birth, req.body.email, hash, (err) => {
                if (err) {
                    if (err.errno==19) {
                        res.json(
                            {
                                error: "Email exist",
                            }
                        );
                    } else {
                        res.json(
                            {
                                error: "SQL failure",
                                details: err
                            }
                        );
                    }
                } else {
                    res.status(201).json(
                        {
                            msg: "User inserted"
                        }
                    );
                }
            }
        );
    });
});


app.post("/login", jsonParser, (req, res) => {
    db.all("SELECT * FROM users WHERE email=?",
        req.body.email, (err, rows) => {
            if (err) {
                res.json(
                    {
                        error: "SQL failure",
                        details: err
                    }
                );
            } else if (rows[0]) {
                bcrypt.compare(req.body.password, rows[0].password, function(err, valid) {
                    if (valid) {
                        const token = jwt.sign({ email: req.body.email }, secret);

                        res.json({
                            error: false,
                            token: token
                        });
                    } else {
                        res.json({
                            error: "Invalid password"
                        });
                    }
                });
            } else {
                res.json({
                    error: "User does not exist"
                });
            }
        }
    );
});


app.post("/reports", jsonParser, (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, function(err) {
        if (err) {
            res.json(
                {
                    error: "JWT failure",
                    details: err
                }
            );
        } else {
            db.run("REPLACE INTO reports (week, report) VALUES (?, ?)",
                req.body.week, req.body.report, (err) => {
                    if (err) {
                        res.json(
                            {
                                error: "SQL failure",
                                details: err
                            }
                        );
                    } else {
                        res.status(201).json(
                            {
                                msg: "Report inserted"
                            }
                        );
                    }
                }
            );
        }
    });
});


app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});


// Start up server
module.exports = server.listen(port);
