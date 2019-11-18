/* global it, describe */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
var token;

chai.should();

chai.use(chaiHttp);

describe('me-API', () => {
    describe('GET /', () => {
        it('200 Greeting', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('msg');
                    done();
                });
        });
    });

    describe('GET /reports/week1', () => {
        it('200 Report Week1', (done) => {
            chai.request(server)
                .get("/reports/week1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('report', 'Testrapport 1');
                    done();
                });
        });
    });

    describe('GET /reports/week2', () => {
        it('200 Report Week2', (done) => {
            chai.request(server)
                .get("/reports/week2")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('report', 'Testrapport 2');
                    done();
                });
        });
    });

    describe('GET /reports/week3', () => {
        it('200 Report Week3', (done) => {
            chai.request(server)
                .get("/reports/week3")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('report', 'Testrapport 3');
                    done();
                });
        });
    });

    describe('GET /reports/week4', () => {
        it('200 Report Week4', (done) => {
            chai.request(server)
                .get("/reports/week4")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('report', 'Testrapport 4');
                    done();
                });
        });
    });

    describe('POST /register', () => {
        it('201 Register', (done) => {
            chai.request(server)
                .post('/register')
                .send({
                    'name': 'Jonas Testsson',
                    'birth': '1:a April 2000',
                    'email': 'Jonas@Testsson.se',
                    'password': '1234'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('msg', 'User inserted');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('200 Login Wrong User', (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    'email': '123@bth.se',
                    'password': '123'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.have
                        .property('error', 'User does not exist');
                    chai.expect(JSON.parse(res.text)).to.not.have.property('token');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('200 Login Wrong Password', (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    'email': 'Jonas@Testsson.se',
                    'password': '4321'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.have.property('error', 'Invalid password');
                    chai.expect(JSON.parse(res.text)).to.not.have.property('token');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('200 Login Correct', (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    'email': 'Jonas@Testsson.se',
                    'password': '1234'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.have.property('error', false);
                    chai.expect(JSON.parse(res.text)).to.have.property('token');
                    token = JSON.parse(res.text).token;
                    done();
                });
        });
    });

    describe('POST /reports', () => {
        it('201 New Report for Week4', (done) => {
            chai.request(server)
                .post('/reports')
                .send({
                    'token': token,
                    'week': '4',
                    'report': "New Report"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('msg', 'Report inserted');
                    done();
                });
        });
    });

    describe('GET /reports/week4', () => {
        it('200 New Report Week4', (done) => {
            chai.request(server)
                .get("/reports/week4")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    chai.expect(JSON.parse(res.text)).to.not.have.property('error');
                    chai.expect(JSON.parse(res.text)).to.have.property('report', 'New Report');
                    done();
                });
        });
    });
});
