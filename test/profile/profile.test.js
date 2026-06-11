const request = require("supertest");
const app = require("../../server");

describe("Profile Module", () => {

let token;

beforeAll(async () => {


const login =
  await request(app)
    .post("/api/login")
    .send({
      username: "sukram08",
      password: "Password@123"
    });

token = login.body.token;


});

test("PROFILE_GET_001 Get Profile Success", async () => {


const response =
  await request(app)
    .get(
      "/api/dashboard/profile?username=sukram08"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    );

expect(response.statusCode)
  .toBe(200);


});

test("PROFILE_GET_002 Missing Token", async () => {


const response =
  await request(app)
    .get(
      "/api/dashboard/profile?username=sukram08"
    );

expect(response.statusCode)
  .toBe(401);


});

test("PROFILE_GET_003 Invalid Token", async () => {


const response =
  await request(app)
    .get(
      "/api/dashboard/profile?username=sukram08"
    )
    .set(
      "Authorization",
      "Bearer invalidtoken"
    );

expect(response.statusCode)
  .toBe(401);


});

test("PROFILE_UPDATE_001 Update Profile Success", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"updated@gmail.com",
      currencyCode:"USD",
      mobile:"+919999999991",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(200);


});

test("PROFILE_UPDATE_002 Invalid Email", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"invalidemail",
      currencyCode:"USD",
      mobile:"+919999999991",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(400);


});

test("PROFILE_UPDATE_003 Invalid Mobile", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"updated@gmail.com",
      currencyCode:"USD",
      mobile:"9999999999",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(400);


});

test("PROFILE_UPDATE_004 Invalid Fullname", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"12345",
      email:"updated@gmail.com",
      currencyCode:"USD",
      mobile:"+919999999991",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(400);


});

test("PROFILE_UPDATE_005 Invalid Identity Number", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"updated@gmail.com",
      currencyCode:"USD",
      mobile:"+919999999991",
      identityNumber:"@@@###"
    });

expect(response.statusCode)
  .toBe(400);


});

test("PROFILE_UPDATE_006 Duplicate Email", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"existing@gmail.com",
      currencyCode:"USD",
      mobile:"+919999999991",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(400);


});

test("PROFILE_UPDATE_007 Duplicate Mobile", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"updated@gmail.com",
      currencyCode:"USD",
      mobile:"+919999999999",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(400);


});

test("PROFILE_UPDATE_008 Missing Token", async () => {


const response =
  await request(app)
    .put(
      "/api/dashboard/updateProfile"
    )
    .send({
      username:"sukram08",
      fullname:"Updated User",
      email:"updated@gmail.com",
      currencyCode:"USD",
      mobile:"+919999999991",
      identityNumber:"ABCDE1234F"
    });

expect(response.statusCode)
  .toBe(401);


});

test("PROFILE_UPDATE_009 Update Email", async () => {

const response =
await request(app)
.put("/api/dashboard/updateProfile")
.set(
"Authorization",
`Bearer ${token}`
)
.send({
username:"sukram08",
fullname:"Test User",
email:"newemail@gmail.com",
currencyCode:"INR",
mobile:"+919999999991",
identityNumber:"ABCDE1234F"
});

expect(response.statusCode)
.toBe(200);

});

test("PROFILE_UPDATE_010 Update Mobile", async () => {

const response =
await request(app)
.put("/api/dashboard/updateProfile")
.set(
"Authorization",
`Bearer ${token}`
)
.send({
username:"sukram08",
fullname:"Test User",
email:"test@gmail.com",
currencyCode:"INR",
mobile:"+919888888888",
identityNumber:"ABCDE1234F"
});

expect(response.statusCode)
.toBe(200);

});


test("PROFILE_UPDATE_011 Update Identity Number", async () => {

const response =
await request(app)
.put("/api/dashboard/updateProfile")
.set(
"Authorization",
`Bearer ${token}`
)
.send({
username:"sukram08",
fullname:"Test User",
email:"test@gmail.com",
currencyCode:"INR",
mobile:"+919999999991",
identityNumber:"XYZ123456"
});

expect(response.statusCode)
.toBe(200);

});

test("PROFILE_UPDATE_012 Empty Fullname", async () => {

const response =
await request(app)
.put("/api/dashboard/updateProfile")
.set(
"Authorization",
`Bearer ${token}`
)
.send({
username:"sukram08",
fullname:"",
email:"test@gmail.com",
currencyCode:"INR",
mobile:"+919999999991",
identityNumber:"ABCDE1234F"
});

expect(response.statusCode)
.toBe(400);

});


});
