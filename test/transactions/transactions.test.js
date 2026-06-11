const request = require("supertest");
const app = require("../../server");

describe("Transaction History Module", () => {

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

  test("TRANSACTION_001 Fetch Transactions Success", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);

  });

  test("TRANSACTION_002 Filter By Account", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("TRANSACTION_003 Invalid Account", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=INVALID"
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

  test("TRANSACTION_004 No Transactions Found", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC99999"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("TRANSACTION_005 Missing Token", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        );

    expect(response.statusCode)
      .toBe(401);

  });

  test("TRANSACTION_006 Invalid Token", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          "Bearer invalidtoken"
        );

    expect(response.statusCode)
      .toBe(401);

  });

  test("TRANSACTION_007 DEPOSIT Transaction Visible", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const deposit =
      response.body.find(
        t => t.type === "DEPOSIT"
      );

    expect(deposit)
      .toBeDefined();

  });

  test("TRANSACTION_008 TRANSFER_OUT Visible For Sender", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const transferOut =
      response.body.find(
        t => t.type === "TRANSFER_OUT"
      );

    expect(transferOut)
      .toBeDefined();

  });

  test("TRANSACTION_009 TRANSFER_IN Visible For Receiver", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10002"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const transferIn =
      response.body.find(
        t => t.type === "TRANSFER_IN"
      );

    expect(transferIn)
      .toBeDefined();

  });

  test("TRANSACTION_010 Verify Descending Date Order", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const transactions =
      response.body;

    for(let i=1;i<transactions.length;i++){

      expect(
        new Date(
          transactions[i-1].created_at
        )
      ).toBeGreaterThanOrEqual(
        new Date(
          transactions[i].created_at
        )
      );

    }

  });

  test("TRANSACTION_011 Transaction Contains Required Fields", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    if(response.body.length > 0){

      expect(response.body[0])
        .toHaveProperty("transaction_id");

      expect(response.body[0])
        .toHaveProperty("type");

      expect(response.body[0])
        .toHaveProperty("amount");

      expect(response.body[0])
        .toHaveProperty("status");

    }

  });

  test("TRANSACTION_012 Status SUCCESS Visible", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const successTxn =
      response.body.find(
        t => t.status === "SUCCESS"
      );

    expect(successTxn)
      .toBeDefined();

  });

});const request = require("supertest");
const app = require("../server");

describe("Transaction History Module", () => {

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

  test("TRANSACTION_001 Fetch Transactions Success", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);

  });

  test("TRANSACTION_002 Filter By Account", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("TRANSACTION_003 Invalid Account", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=INVALID"
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

  test("TRANSACTION_004 No Transactions Found", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC99999"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(response.statusCode)
      .toBe(200);

  });

  test("TRANSACTION_005 Missing Token", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        );

    expect(response.statusCode)
      .toBe(401);

  });

  test("TRANSACTION_006 Invalid Token", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          "Bearer invalidtoken"
        );

    expect(response.statusCode)
      .toBe(401);

  });

  test("TRANSACTION_007 DEPOSIT Transaction Visible", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const deposit =
      response.body.find(
        t => t.type === "DEPOSIT"
      );

    expect(deposit)
      .toBeDefined();

  });

  test("TRANSACTION_008 TRANSFER_OUT Visible For Sender", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const transferOut =
      response.body.find(
        t => t.type === "TRANSFER_OUT"
      );

    expect(transferOut)
      .toBeDefined();

  });

  test("TRANSACTION_009 TRANSFER_IN Visible For Receiver", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10002"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const transferIn =
      response.body.find(
        t => t.type === "TRANSFER_IN"
      );

    expect(transferIn)
      .toBeDefined();

  });

  test("TRANSACTION_010 Verify Descending Date Order", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const transactions =
      response.body;

    for(let i=1;i<transactions.length;i++){

      expect(
        new Date(
          transactions[i-1].created_at
        )
      ).toBeGreaterThanOrEqual(
        new Date(
          transactions[i].created_at
        )
      );

    }

  });

  test("TRANSACTION_011 Transaction Contains Required Fields", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    if(response.body.length > 0){

      expect(response.body[0])
        .toHaveProperty("transaction_id");

      expect(response.body[0])
        .toHaveProperty("type");

      expect(response.body[0])
        .toHaveProperty("amount");

      expect(response.body[0])
        .toHaveProperty("status");

    }

  });

  test("TRANSACTION_012 Status SUCCESS Visible", async () => {

    const response =
      await request(app)
        .get(
          "/api/dashboard/transactions?username=sukram08&accountNo=ACC10001"
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    const successTxn =
      response.body.find(
        t => t.status === "SUCCESS"
      );

    expect(successTxn)
      .toBeDefined();

  });

});