const request = require("supertest");
const app = require("../../server");

describe("Reverse Transaction Module", () => {
  let token;
  beforeAll(async () => {
    const login =
      await request(app)
        .post("/api/login")
        .send({
          username:"testuser123",
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
          transactionId:"298e3689-6044-484e-bd36-39391baf81f4"
        });

    expect(response.statusCode)
      .toBe(200);
      expect(response.body).toBe("Transaction reversed");

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
          transactionId:"INVALID_TXN"
        });

    expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Invalid Request, Invalid transaction id");

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
          transactionId:""
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid request, Missing Parameter transaction_id");
  });

  test("REVERSE_004 Missing Token", async () => {

    const response =
      await request(app)
        .post(
          "/api/dashboard/reverseTransaction"
        )
        .send({
          transactionId:"TXN123456"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");

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
          transactionId:"298e3689-6044-484e-bd36-39391baf81f4"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Request, Transaction already reversed")

  });

  
  

});