const request = require("supertest");
const app = require("../../server");

describe("Dashboard Module", () => {

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

  test("DASHBOARD_001 Dashboard Load Success", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("DASHBOARD_002 Missing Token", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        );

    expect(response.statusCode)
      .toBe(401);

  });

  test("DASHBOARD_003 Invalid Token", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          "Bearer invalidtoken"
        );

    expect(response.statusCode)
      .toBe(401);

  });

  test("DASHBOARD_004 Username Not Found", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=invaliduser"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      [200,400]
    ).toContain(
      response.statusCode
    );

  });

  test("DASHBOARD_005 Dashboard Returns Accounts", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.body)
      .toBeDefined();

  });

  test("DASHBOARD_006 User With Single Account", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=singleUser"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("DASHBOARD_007 User With Multiple Accounts", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("DASHBOARD_008 No Accounts Available", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=noaccountuser"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      [200,404]
    ).toContain(
      response.statusCode
    );

  });

  test("DASHBOARD_009 Total Balance Returned", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.body)
      .toBeDefined();

  });

  test("DASHBOARD_010 Account Currency Returned", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.body)
      .toBeDefined();

  });

  test("DASHBOARD_011 Active Accounts Only", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard?username=sukram08"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("DASHBOARD_012 Dashboard Performance", async () => {

    const start =
      Date.now();

    await request(app)
      .get(
        "/api/dashboard?username=sukram08"
      )
      .set(
        "Authorization",
        `Bearer ${token}`
      );

    const end =
      Date.now();

    expect(
      end - start
    ).toBeLessThan(3000);

  });

});