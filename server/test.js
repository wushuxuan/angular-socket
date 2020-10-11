process.env.NODE_ENV = "test";

let assert = require("assert");
var mongoose = require("mongoose");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("./server");
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe("Server test", () => {
  before(function () {
    mongoose.createConnection("mongodb://localhost:27017/chat", {});
  });
  /*
   * Test the /getlist route
   */
  describe("/getUserList", () => {
    it("it should GET all the users", (done) => {
      chai
        .request(app)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('array');
          done();
        });
    });
  });

  describe("/getGroupsList", () => {
    it("it should GET all the groups", (done) => {
      chai
        .request(app)
        .get("/groups")
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('array');
          done();
        });
    });
  });

  /*
   * Test the /add route
   */
  describe("/add Api", () => {
    it("it should insert a group", (done) => {
      chai
        .request(app)
        .post("/group/save")
        .send({
          name: "group01",
          cover: "superAdmin-1601971238278.jpg",
          adminUser: ["5f7741859af56a322c206364", "5f77c9f5ba741a4b88f9da55"],
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should insert a group", (done) => {
      chai
        .request(app)
        .post("/group/save")
        .send({
          name: "group02",
          cover: "superAdmin-1601971238278.jpg",
          adminUser: ["5f7741859af56a322c206364", "5f77c9f5ba741a4b88f9da55"],
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  /*
   * Test the /getitem route
   */
  describe("/getUser", () => {
    it("it should GET a user by Id", (done) => {
      chai
        .request(app)
        .get("/users/:id")
        .send({ id: "5f7c1aaad164fc9c1a26b0fc" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should GET a user by Id", (done) => {
      chai
        .request(app)
        .get("/users/:id")
        .send({ id: "5f7c2575d164fc9c1a26b0fe" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  //     /*
  // * Test the /update route
  // */
  describe("/update", () => {
    it("it should UPDATE a user by Id", (done) => {
      chai
        .request(app)
        .put("/users/5f7c1aaad164fc9c1a26b0fc")
        .send({
          name: "3",
          password: "2",
          avatar: "superAdmin-1601971576011.jpg",
          sex: 1,
          email: "2@qq.com",
          role: "role_04",
          id: "5f7c1aaad164fc9c1a26b0fc",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should UPDATE a user by Id", (done) => {
      chai
        .request(app)
        .put("/users/5f7c2575d164fc9c1a26b0fe")
        .send({
          name: "4",
          password: "2",
          avatar: "superAdmin-1601971576011.jpg",
          sex: 1,
          email: "2@qq.com",
          role: "role_04",
          id: "5f7c2575d164fc9c1a26b0fe",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
