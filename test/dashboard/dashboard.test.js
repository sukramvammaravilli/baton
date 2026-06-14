const request = require("supertest");
const app = require("../../server");

describe("Dashboard Module", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    token = login.body.token;
  });

  test("DASHBOARD_001 Dashboard Load Success", async () => {
    const response = await request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("DASHBOARD_002 Missing Token", async () => {
    const response = await request(app).get("/api/dashboard");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");
  });
});
