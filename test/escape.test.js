require("./setup");

// test des routes escape games

test("GET /escapes dois retourner un tableau d'escape games", async () => {
  //arrange
  const response = await supertest(app).get("/escapes");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});
