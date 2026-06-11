const request = require("supertest");
const app = require("../../server");

describe("Account Management Module", () => {

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

test("ACCOUNT_ADD_001 Add Account Success", async () => {


const response =
  await request(app)
    .post("/api/dashboard/addAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC99999"
    });

expect(response.statusCode)
  .toBe(200);


});

test("ACCOUNT_ADD_002 Duplicate Account", async () => {


const response =
  await request(app)
    .post("/api/dashboard/addAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"ACC10001"
    });

expect(response.statusCode)
  .toBe(400);


});

test("ACCOUNT_ADD_003 Empty Account Number", async () => {


const response =
  await request(app)
    .post("/api/dashboard/addAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:""
    });

expect(response.statusCode)
  .toBeGreaterThanOrEqual(400);


});

test("ACCOUNT_ADD_004 Invalid Account Format", async () => {


const response =
  await request(app)
    .post("/api/dashboard/addAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      accountNo:"@@@###"
    });

expect(response.statusCode)
  .toBe(400);


});

test("ACCOUNT_ADD_005 Missing Token", async () => {


const response =
  await request(app)
    .post("/api/dashboard/addAccount")
    .send({
      username:"sukram08",
      accountNo:"ACC99998"
    });

expect(response.statusCode)
  .toBe(401);


});

test("ACCOUNT_REMOVE_001 Remove Account Success", async () => {


const response =
  await request(app)
    .put("/api/dashboard/removeAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      account:"ACC99999"
    });

expect(response.statusCode)
  .toBe(200);


});

test("ACCOUNT_REMOVE_002 Remove Account With Balance", async () => {


const response =
  await request(app)
    .put("/api/dashboard/removeAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      account:"ACC10001"
    });

expect(response.statusCode)
  .toBe(400);


});

test("ACCOUNT_REMOVE_003 Remove Non Existing Account", async () => {


const response =
  await request(app)
    .put("/api/dashboard/removeAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      account:"ACC77777"
    });

expect(response.statusCode)
  .toBe(400);


});

test("ACCOUNT_REMOVE_004 Remove Account Belonging To Another User", async () => {


const response =
  await request(app)
    .put("/api/dashboard/removeAccount")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      account:"OTHERUSERACC"
    });

expect(response.statusCode)
  .toBe(400);


});

test("ACCOUNT_REMOVE_005 Missing Token", async () => {


const response =
  await request(app)
    .put("/api/dashboard/removeAccount")
    .send({
      username:"sukram08",
      account:"ACC10001"
    });

expect(response.statusCode)
  .toBe(401);


});

});
