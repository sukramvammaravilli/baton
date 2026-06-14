const request = require("supertest");
const app = require("../../server");

describe("Transfer Module", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    token = login.body.token;
  });

  test("TRANSFER_001 Transfer Success or Same Currency Transfer", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "ACC20001",
        amount: 100,
        currency: "USD,US Dollar",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Transfer Success");
  });

  test("TRANSFER_002 Cross Currency Transfer", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "ACC10002",
        amount: 100,
        currency: "USD,US Dollar",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Transfer allowed only between accounts with same currency",
    );
  });

  test("TRANSFER_003 Invalid Sender Account", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "INVALID",
        toAccount: "ACC10002",
        amount: 100,
        currency: "USD,US Dollar",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Invalid transfer accounts selected either of them are inactive",
    );
  });

  test("TRANSFER_004 Invalid Receiver Account", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "INVALID",
        amount: 100,
        currency: "USD,US Dollar",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Invalid transfer accounts selected either of them are inactive",
    );
  });

  test("TRANSFER_005 Same Account Transfer", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "ACC99999",
        amount: 100,
        currency: "USD,US Dollar",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Request, Self Transfer");
  });

  test("TRANSFER_006 Zero Amount", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "ACC10002",
        amount: 0,
        currency: "USD,US Dollar",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid request, Invalid transfer amount entered ",
    );
  });

  test("TRANSFER_007 Negative Amount", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "ACC10002",
        amount: -100,
        currency: "USD,US Dollar",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid request, Invalid transfer amount entered ",
    );
  });

  test("TRANSFER_008 Insufficient Balance", async () => {
    const response = await request(app)
      .post("/api/dashboard/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromAccount: "ACC99999",
        toAccount: "ACC10002",
        amount: 999999999,
        currency: "USD,US Dollar",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Request, Insufficient Balance");
  });

  test("TRANSFER_009 Missing Token", async () => {
    const response = await request(app).post("/api/dashboard/transfer").send({
      fromAccount: "ACC99999",
      toAccount: "ACC10002",
      amount: 100,
      currency: "USD,US Dollar",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");
  });
});
