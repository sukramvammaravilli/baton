const request = require("supertest");
const app = require("../../server");

describe("Session Module", () => {

test("SESSION_001 Missing Token", async () => {


const response = await request(app)
  .get("/api/dashboard/profile");

expect(response.statusCode)
  .toBe(401);


});

test("SESSION_002 Invalid JWT", async () => {


const response = await request(app)
  .get("/api/dashboard/profile")
  .set(
    "Authorization",
    "Bearer invalidtoken"
  );

expect(response.statusCode)
  .toBe(401);


});

test("SESSION_003 Modified JWT", async () => {


const response = await request(app)
  .get("/api/dashboard/profile")
  .set(
    "Authorization",
    "Bearer abc.def.xyz"
  );

expect(response.statusCode)
  .toBe(401);


});


});
