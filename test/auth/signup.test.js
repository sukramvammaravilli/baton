const request = require("supertest");
const app = require("../../server");

describe("Registration Module", () => {
const validPayload = {
username: "testuser123",
password: "Password@123",
email: "testuser@gmail.com",
currencyCode: "INR",
mobile: "+919999999999",
identityNumber: "ABCDE1234F",
fullname: "Test User"
};

test("AUTH_REG_001 Register Success", async () => {
const response = await request(app)
.post("/api/register")
.send(validPayload);

expect([200,201]).toContain(response.statusCode);
});

test("AUTH_REG_002 Duplicate Username", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "existingUser"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_003 Duplicate Email", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "newuser1",
email: "[existing@gmail.com](mailto:existing@gmail.com)"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_004 Duplicate Mobile", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "newuser2",
email: "[newuser2@gmail.com](mailto:newuser2@gmail.com)",
mobile: "+919888888888"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_005 Empty Username", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_006 Empty Password", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
password: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_007 Empty Fullname", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
fullname: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_008 Empty Email", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
email: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_009 Empty Mobile", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
mobile: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_010 Empty Currency", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
currencyCode: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_011 Invalid Email Format", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
email: "invalidemail"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_012 Invalid Mobile Format", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
mobile: "9999999999"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_013 Mobile Without Country Code", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
mobile: "9999999999"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_014 Mobile With Country Code", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "countryuser",
email: "[country@gmail.com](mailto:country@gmail.com)",
mobile: "+14155552671"
});

expect([200,201]).toContain(response.statusCode);
});

test("AUTH_REG_015 Password Less Than 8 Characters", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
password: "Ab@12"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_016 Password Without Uppercase", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
password: "password@123"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_017 Password Without Lowercase", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
password: "PASSWORD@123"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_018 Password Without Number", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
password: "Password@"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_019 Password Without Special Character", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
password: "Password123"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_020 Username Minimum Length", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "ab"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_021 Username Maximum Length", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "abcdefghijklmnopqrstuvwxyz"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_022 Empty Identity Number", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
identityNumber: ""
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_023 Duplicate Identity Number", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "duplicateid",
email: "[duplicateid@gmail.com](mailto:duplicateid@gmail.com)",
identityNumber: "EXISTING123"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_024 SQL Injection Username", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
username: "' OR 1=1 --"
});

expect(response.statusCode).toBe(400);
});

test("AUTH_REG_025 SQL Injection Email", async () => {
const response = await request(app)
.post("/api/register")
.send({
...validPayload,
email: "' OR 1=1 --"
});

expect(response.statusCode).toBe(400);
});

});


// empty values to be checked i forgot to add the validation