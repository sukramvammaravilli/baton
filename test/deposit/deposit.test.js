const request = require("supertest");
const app = require("../../server");

describe("Deposit Module", () => {

let token;

beforeAll(async () => {


const login =
  await request(app)
    .post("/api/login")
    .send({
      username:"sukram08",
      password:"Password@123"
    });

token = login.body.token;


});

test("DEPOSIT_001 Deposit Success", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("DEPOSIT_002 Deposit INR", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:1000,
      currency:"INR,Indian Rupee"
    });

expect(response.statusCode)
  .toBe(200);


});

test("DEPOSIT_003 Deposit USD", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("DEPOSIT_004 Deposit AED", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:100,
      currency:"AED,UAE Dirham"
    });

expect(response.statusCode)
  .toBe(200);


});

test("DEPOSIT_005 Deposit Decimal Amount", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:100.75,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("DEPOSIT_006 Deposit Large Amount", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:1000000,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("DEPOSIT_007 Invalid Account", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"INVALID",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("DEPOSIT_008 Empty Account", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBeGreaterThanOrEqual(400);


});

test("DEPOSIT_009 Zero Amount", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:0,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("DEPOSIT_010 Negative Amount", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:-100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("DEPOSIT_011 Invalid Currency", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:100,
      currency:"XYZ,Test Currency"
    });

expect(response.statusCode)
  .toBe(400);


});

test("DEPOSIT_012 Missing Token", async () => {


const response =
  await request(app)
    .post("/api/dashboard/deposit")
    .send({
      username:"sukram08",
      accountNo:"ACC10001",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(401);


});


});