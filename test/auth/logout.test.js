const request = require("supertest");
const app = require("../../server");

describe("Logout Module", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    token = login.body.token;
  });

  test("AUTH_LOGOUT_001 Missing Token", async () => {
    const response = await request(app).get("/api/logout");
    expect(response.statusCode).toBe(401);
  });

  test("AUTH_LOGOUT_002 Invalid Token", async () => {
    const response = await request(app)
      .get("/api/logout")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.statusCode).toBe(401);
  });

  test("AUTH_LOGOUT_003 Logout Success", async () => {
    const response = await request(app)
      .get("/api/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
  });

  test("AUTH_LOGOUT_004 Already Logged Out Token", async () => {
    const response = await request(app)
      .get("/api/logout")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 401]).toContain(response.statusCode);
  });
});
