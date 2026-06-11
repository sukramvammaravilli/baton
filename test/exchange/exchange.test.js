const request = require("supertest");
const app = require("../../server");

describe("Exchange Module", () => {

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

  test("EXCHANGE_001 USD To INR", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:100
        });

    expect(response.statusCode)
      .toBe(200);

    expect(response.body.convertedAmount)
      .toBeDefined();

  });

  test("EXCHANGE_002 INR To USD", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"INR,Indian Rupee",
          to:"USD,US Dollar",
          amount:1000
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_003 AED To INR", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"AED,UAE Dirham",
          to:"INR,Indian Rupee",
          amount:100
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_004 INR To AED", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"INR,Indian Rupee",
          to:"AED,UAE Dirham",
          amount:1000
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_005 USD To AED", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"AED,UAE Dirham",
          amount:100
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_006 Same Currency Conversion", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"USD,US Dollar",
          amount:100
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_007 Invalid Source Currency", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"XYZ,Unknown",
          to:"USD,US Dollar",
          amount:100
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(400);

  });

  test("EXCHANGE_008 Invalid Destination Currency", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"XYZ,Unknown",
          amount:100
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(400);

  });

  test("EXCHANGE_009 Zero Amount", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:0
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(400);

  });

  test("EXCHANGE_010 Negative Amount", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:-100
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(400);

  });

  test("EXCHANGE_011 Decimal Amount", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:100.75
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_012 Large Amount", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:1000000
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("EXCHANGE_013 Missing Token", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:100
        });

    expect(response.statusCode)
      .toBe(401);

  });

  test("EXCHANGE_014 Invalid Token", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .set(
          "Authorization",
          "Bearer invalidtoken"
        )
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:100
        });

    expect(response.statusCode)
      .toBe(401);

  });

  test("EXCHANGE_015 Converted Amount Returned", async () => {

    const response =
      await request(app)
        .post("/api/dashboard/exchange")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          from:"USD,US Dollar",
          to:"INR,Indian Rupee",
          amount:100
        });

    expect(response.body)
      .toHaveProperty(
        "convertedAmount"
      );

  });

});