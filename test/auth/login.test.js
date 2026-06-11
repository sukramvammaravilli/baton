const request = require("supertest");
const app = require("../../server");

describe("Login Module", () => {

test("AUTH_LOGIN_001 Login Success", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "sukram08",
    password: "Password@123"
  });

expect(response.statusCode)
  .toBe(200);

expect(response.body.token)
  .toBeDefined();


});

test("AUTH_LOGIN_002 Invalid Username", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "invaliduser",
    password: "Password@123"
  });

expect(response.statusCode)
  .toBe(401);

expect(response.body.error)
  .toBe("User does not exists");


});

test("AUTH_LOGIN_003 Invalid Password", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "sukram08",
    password: "WrongPassword@123"
  });

expect(response.statusCode)
  .toBe(401);

expect(response.body.error)
  .toBe("Invalid credentials");


});

test("AUTH_LOGIN_004 Empty Username", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "",
    password: "Password@123"
  });

expect(response.statusCode)
  .toBeGreaterThanOrEqual(400);


});

test("AUTH_LOGIN_005 Empty Password", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "sukram08",
    password: ""
  });

expect(response.statusCode)
  .toBeGreaterThanOrEqual(400);


});

test("AUTH_LOGIN_006 JWT Generated", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "sukram08",
    password: "Password@123"
  });

expect(response.body.token)
  .toBeDefined();

expect(typeof response.body.token)
  .toBe("string");


});

test("AUTH_LOGIN_007 Username Returned", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "sukram08",
    password: "Password@123"
  });

expect(response.body.username)
  .toBeDefined();


});

test("AUTH_LOGIN_008 SQL Injection Username", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "' OR 1=1 --",
    password: "Password@123"
  });

expect(response.statusCode)
  .toBe(401);


});

test("AUTH_LOGIN_009 SQL Injection Password", async () => {


const response = await request(app)
  .post("/api/login")
  .send({
    username: "sukram08",
    password: "' OR 1=1 --"
  });

expect(response.statusCode)
  .toBe(401);


});

});
