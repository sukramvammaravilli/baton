const request = require("supertest");
const app = require("../../server");

describe("Account Management Module", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    token = login.body.token;
  });

  test("ACCOUNT_ADD_001 Add Account Success", async () => {
    const response = await request(app)
      .post("/api/dashboard/addAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountNo: "ACC99999",
        currencyCode: "INR,Indian Rupees",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Account added successfully");
  });

  test("ACCOUNT_ADD_002 Duplicate Account", async () => {
    const response = await request(app)
      .post("/api/dashboard/addAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountNo: "ACC99999",
        currencyCode: "INR,Indian Rupees",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Request, Duplicate Account");
  });

  test("ACCOUNT_ADD_003 Empty Account Number", async () => {
    const response = await request(app)
      .post("/api/dashboard/addAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountNo: "",
        currencyCode: "INR,Indian Rupees",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid request, Missing Account ");
  });

  test("ACCOUNT_ADD_004 Empty Currency", async () => {
    const response = await request(app)
      .post("/api/dashboard/addAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountNo: "ACC001",
        currencyCode: "",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Request, Missing Currency Value");
  });

  test("ACCOUNT_ADD_005 Invalid Account Format", async () => {
    const response = await request(app)
      .post("/api/dashboard/addAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountNo: "@@@###",
        currencyCode: "INR,Indian Rupees",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Invalid account format only letters , number or both allowed",
    );
  });

  test("ACCOUNT_ADD_006 Invalid Currency", async () => {
    const response = await request(app)
      .post("/api/dashboard/addAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountNo: "ACC0002",
        currencyCode: "XYZ, not defined",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Request, Invalid Currency");
  });

  test("ACCOUNT_ADD_007 Missing Token", async () => {
    const response = await request(app).post("/api/dashboard/addAccount").send({
      accountNo: "ACC99998",
      currencyCode: "INR,Indian Rupees",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");
  });

  test("ACCOUNT_REMOVE_001 Remove Account Success", async () => {
    const response = await request(app)
      .put("/api/dashboard/removeAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "testuser123",
        account: "ACC99999",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Removed account successfully");
  });

  test("ACCOUNT_REMOVE_002 Remove Non Existing Account", async () => {
    const response = await request(app)
      .put("/api/dashboard/removeAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "testuser123",
        account: "ACC77777",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Account Not Exist or Not Belongs to you",
    );
  });

  test("ACCOUNT_REMOVE_003 Remove Account Belonging To Another User", async () => {
    const response = await request(app)
      .put("/api/dashboard/removeAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "testuser123",
        account: "OTHERUSERACC",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Invalid Request, Account Not Exist or Not Belongs to you",
    );
  });

  test("ACCOUNT_REMOVE_004 Missing Token", async () => {
    const response = await request(app)
      .put("/api/dashboard/removeAccount")
      .send({
        username: "testuser123",
        account: "ACC10001",
      });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");
  });
});
