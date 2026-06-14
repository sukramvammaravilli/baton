const request = require("supertest");
const app = require("../../server");

describe("Profile Module", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app).post("/api/login").send({
      username: "testuser123",
      password: "Password@123",
    });
    token = login.body.token;
  });

  test("PROFILE_GET_001 Get Profile Success", async () => {
    const response = await request(app)
      .get("/api/dashboard/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("PROFILE_GET_002 Missing Token", async () => {
    const response = await request(app).get("/api/dashboard/profile");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid request, Missing Token ");
  });

  test("PROFILE_UPDATE_001 Invalid Email", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "invalidemail",
        mobile: "+919999999991",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_002 Invalid Mobile", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "updated@gmail.com",
        mobile: "9999999999",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_003 Invalid Fullname", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "12345",
        email: "updated@gmail.com",
        mobile: "+919999999991",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_004 Invalid Identity Number", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "updated@gmail.com",
        mobile: "+919999999991",
        identityNumber: "@@@###",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_005 Duplicate Email", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "existing@gmail.com",
        mobile: "+919999999991",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_006 Duplicate Mobile", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "updated@gmail.com",
        mobile: "+919999999999",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_007 Missing Token", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .send({
        fullname: "Updated User",
        email: "updated@gmail.com",
        mobile: "+919999999991",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(401);
  });

  test("PROFILE_UPDATE_008 Empty Fullname", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "",
        email: "test@gmail.com",
        mobile: "+919999999991",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_009 Empty email", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "",
        mobile: "+919999999991",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_010 Empty mobile", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "updated@gmail.com",
        mobile: "",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_011 Empty identityNumber", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updated User",
        email: "updated@gmail.com",
        mobile: "+919999999991",
        identityNumber: "",
      });
    expect(response.statusCode).toBe(400);
  });

  test("PROFILE_UPDATE_012 Update Profile Success", async () => {
    const response = await request(app)
      .put("/api/dashboard/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullname: "Updateds User",
        email: "updateds@gmail.com",
        mobile: "+919999999997",
        identityNumber: "ABCDE1234M",
      });
    expect(response.statusCode).toBe(200);
  });
});
