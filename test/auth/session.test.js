const request = require("supertest");
const app = require("../../server");

describe("Session Module", () => {
  test("SESSION_001 Missing Token", async () => {
    const response = await request(app).get("/api/dashboard/profile");
    expect(response.statusCode).toBe(401);
  });

  test("SESSION_002 Invalid JWT", async () => {
    const response = await request(app)
      .get("/api/dashboard/profile")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.statusCode).toBe(401);
  });

  test("SESSION_003 Modified JWT", async () => {
    const response = await request(app)
      .get("/api/dashboard/profile")
      .set("Authorization", "Bearer abc.def.xyz");
    expect(response.statusCode).toBe(401);
  });

  test("SESSION_004 Session Created", async () => {
    const response = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    expect(response.statusCode).toBe(200);
  });

  test("SESSION_005 Session Not Found", async () => {
    const fakeToken = "eyJ.fake.token";
    const response = await request(app)
      .get("/api/dashboard/profile")
      .set("Authorization", `Bearer ${fakeToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Session Not found ");
  });

  test("SESSION_006 Session Status EXPIRED", async () => {
    let response = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });

    token = response.body.token;
    response = await request(app)
      .get("/api/logout")
      .set("Authorization", `Bearer ${token}`);

    response = await request(app)
      .get("/api/dashboard/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("User Logged out already ");
  });
});
