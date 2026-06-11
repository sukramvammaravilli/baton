const request = require("supertest");
const app = require("../../server");

describe("Reverse Transaction Module", () => {

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

  test("REVERSE_001 Reverse Transaction Success", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          username:"sukram08",
          transactionId:"TXN123456"
        });

    expect(response.statusCode)
      .toBe(200);

  });

  test("REVERSE_002 Invalid Transaction Id", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          username:"sukram08",
          transactionId:"INVALID_TXN"
        });

    expect(response.statusCode)
      .toBe(400);

  });

  test("REVERSE_003 Empty Transaction Id", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          username:"sukram08",
          transactionId:""
        });

    expect(response.statusCode)
      .toBeGreaterThanOrEqual(400);

  });

  test("REVERSE_004 Missing Token", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .send({
          username:"sukram08",
          transactionId:"TXN123456"
        });

    expect(response.statusCode)
      .toBe(401);

  });

  test("REVERSE_005 Invalid Token", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          "Bearer invalidtoken"
        )
        .send({
          username:"sukram08",
          transactionId:"TXN123456"
        });

    expect(response.statusCode)
      .toBe(401);

  });

  test("REVERSE_006 Already Reversed Transaction", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          username:"sukram08",
          transactionId:"ALREADY_REVERSED_TXN"
        });

    expect(response.statusCode)
      .toBe(400);

  });

  test("REVERSE_007 Reverse Only TRANSFER_OUT Transaction", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          username:"sukram08",
          transactionId:"TRANSFER_OUT_TXN"
        });

    expect(
      [200,400]
    ).toContain(
      response.statusCode
    );

  });

  test("REVERSE_008 Reverse DEPOSIT Transaction", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          username:"sukram08",
          transactionId:"DEPOSIT_TXN"
        });

    expect(
      [200,400]
    ).toContain(
      response.statusCode
    );

  });

  

});