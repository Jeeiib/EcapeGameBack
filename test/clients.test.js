require("./setup");

// test des routes clients

test("GET /clients dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get("/clients");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test ("GET /clients/id dois retourner un client", async () => {
  //arrange
  const response = await supertest(app).get("/clients/2");
  //act
  expect(response.status).toBe(200);
  //assert
 expect(response.body).toBeInstanceOf(Object);
});

test ("GET /clients/clientsByYear/:year dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get("/clients/clientsByYear/2025");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test ("GET /clients/totalCostAbove/:price dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get("/clients/totalCostAbove/100");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});