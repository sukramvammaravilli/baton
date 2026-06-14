const request = require("supertest");
const app = require("../../server");

describe("Transaction History Module", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    token = login.body.token;
  });

  test("TRANSACTION_001 Fetch Transactions Success", async () => {
    const response = await request(app)
      .get("/api/dashboard/transactions?accountNo=ACC99999")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("TRANSACTION_002 Invalid Account", async () => {
    const response = await request(app)
      .get("/api/dashboard/transactions?accountNo=INVALID")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Account Not Exist or Not Belongs to you",
    );
  });

  test("TRANSACTION_003 Missing Token", async () => {
    const response = await request(app).get(
      "/api/dashboard/transactions?accountNo=ACC99999",
    );
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");
  });

  test("TRANSACTION_004 DEPOSIT Transaction Visible", async () => {
    const response = await request(app)
      .get("/api/dashboard/transactions?accountNo=ACC99999")
      .set("Authorization", `Bearer ${token}`);
    const deposit = response.body.find((t) => t.type === "DEPOSIT");
    expect(deposit).toBeDefined();
  });

  test("TRANSACTION_005 TRANSFER_OUT Visible For Sender", async () => {
    const response = await request(app)
      .get("/api/dashboard/transactions?accountNo=ACC99999")
      .set("Authorization", `Bearer ${token}`);
    const transferOut = response.body.find((t) => t.type === "TRANSFER_OUT");
    expect(transferOut).toBeDefined();
  });

  test("TRANSACTION_006 TRANSFER_IN Visible For Receiver", async () => {
    const response = await request(app)
      .get("/api/dashboard/transactions?accountNo=ACC10002")
      .set("Authorization", `Bearer ${token}`);
    const transferIn = response.body.find((t) => t.type === "TRANSFER_IN");
    expect(transferIn).toBeDefined();
  });

  test("TRANSACTION_007 Status SUCCESS Visible", async () => {
    const response = await request(app)
      .get("/api/dashboard/transactions?accountNo=ACC99999")
      .set("Authorization", `Bearer ${token}`);
    const successTxn = response.body.find((t) => t.status === "SUCCESS");
    expect(successTxn).toBeDefined();
  });
});
