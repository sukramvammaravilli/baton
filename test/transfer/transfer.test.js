const request = require("supertest");
const app = require("../../server");

describe("Transfer Module", () => {

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

test("TRANSFER_001 Transfer Success", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("TRANSFER_002 Same Currency Transfer", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:50,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("TRANSFER_003 Cross Currency Transfer", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC20001",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(200);


});

test("TRANSFER_004 INR To USD", async () => {});

test("TRANSFER_005 USD To INR", async () => {});

test("TRANSFER_006 AED To INR", async () => {});

test("TRANSFER_007 INR To AED", async () => {});

test("TRANSFER_008 Invalid Sender Account", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"INVALID",
      toAccount:"ACC10002",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_009 Invalid Receiver Account", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"INVALID",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_010 Same Account Transfer", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10001",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_011 Zero Amount", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:0,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_012 Negative Amount", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:-100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_013 Insufficient Balance", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:999999999,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_014 Invalid Currency", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .set("Authorization",`Bearer ${token}`)
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:100,
      currency:"XYZ,Test"
    });

expect(response.statusCode)
  .toBe(400);


});

test("TRANSFER_015 Missing Token", async () => {


const response =
  await request(app)
    .post("/api/dashboard/transfer")
    .send({
      username:"sukram08",
      fromAccount:"ACC10001",
      toAccount:"ACC10002",
      amount:100,
      currency:"USD,US Dollar"
    });

expect(response.statusCode)
  .toBe(401);


});

});
