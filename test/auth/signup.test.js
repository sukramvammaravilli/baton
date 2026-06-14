const request = require("supertest");
const app = require("../../server");

describe("Registration Module", () => {
  const validPayload = {
    username: "testuser123",
    password: "Password@123",
    email: "testuser@gmail.com",
    mobile: "+919999999999",
    identityNumber: "ABCDE12345G",
    fullname: "Test User",
  };

  test("AUTH_REG_001 Invalid Email Format", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        email: "invalidemail",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_002 Mobile Without Country Code", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        mobile: "9999999999",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_003 Mobile With Country Code", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "countryuser",
        email: "country@gmail.com",
        mobile: "+14155552671",
        identityNumber: "ABCDE1234F",
      });
    expect([200, 201]).toContain(response.statusCode);
  });

  test("AUTH_REG_004 Password Less Than 8 Characters", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "country1",
        email: "country1@gmail.com",
        password: "Ab@12",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_005 Password Without Uppercase", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "country1",
        email: "country1@gmail.com",
        password: "password@123",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_006 Password Without Lowercase", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "country1",
        email: "country1@gmail.com",
        password: "PASSWORD@123",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_007 Password Without Number", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "country1",
        email: "country1@gmail.com",
        password: "Password@",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_008 Password Without Special Character", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "country1",
        email: "country1@gmail.com",
        password: "Password123",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_009 Username Minimum Length", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "ab",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_010 Username Maximum Length", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "abcdefghijklmnopqrstuvwxyz",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_011 Empty Identity Number", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        identityNumber: "",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_012 Duplicate Identity Number", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "duplicateid",
        email: "duplicateid@gmail.com",
        identityNumber: "ABCDE1234F",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_013 SQL Injection Username", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "' OR 1=1 --",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_014 SQL Injection Email", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        email: "' OR 1=1 --",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_015 Register Success", async () => {
    const response = await request(app)
      .post("/api/register")
      .send(validPayload);
    expect([200, 201]).toContain(response.statusCode);
  });

  test("AUTH_REG_016 Duplicate Username", async () => {
    const response = await request(app)
      .post("/api/register")
      .send(validPayload);
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_017 Duplicate Email", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "newuser1",
        email: "testuser@gmail.com",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_018 Duplicate Mobile", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "newuser2",
        email: "newuser2@gmail.com",
        mobile: "+919999999999",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_019 Empty Username", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        username: "",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_020 Empty Password", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        password: "",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_021 Empty Fullname", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        fullname: "",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_022 Empty Email", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        email: "",
      });
    expect(response.statusCode).toBe(400);
  });

  test("AUTH_REG_023 Empty Mobile", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        ...validPayload,
        mobile: "",
      });
    expect(response.statusCode).toBe(400);
  });
});
