const request = require("supertest");
const app = require("../app"); // export app from app.js

describe("Record API", () => {

  it("should create a record", async () => {
    const res = await request(app)
      .post("/api/records")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2UwZDRlNDYxNzhhNDg3Yjk5YzBkMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTExMTU0OSwiZXhwIjoxNzc1MTk3OTQ5fQ.q3pA72sCNDZFZ8yjQY2FHcyk6n1eUGLOWn5c6pjOfS8")
      .send({
        amount: 1000,
        type: "income",
        category: "salary"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(1000);
  });

  it("should block viewer from creating record", async () => {
    const res = await request(app)
      .post("/api/records")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2UzZjhiYzFhNmQ3ZDgwZWQ4NmI0NiIsInJvbGUiOiJ2aWV3ZXIiLCJpYXQiOjE3NzUxMjQzODksImV4cCI6MTc3NTIxMDc4OX0.h1a1H6Ks9IthZRBrausxdQQ7UiXYo6uM5pr7Ly7B6qM")
      .send({
        amount: 1000,
        type: "income",
        category: "salary"
      });

    expect(res.statusCode).toBe(403);
  });

});