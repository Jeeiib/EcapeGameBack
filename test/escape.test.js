require("./setup");

test("GET /escapes dois retourner un tableau des escapes", async () => {
  //arrange
  const response = await supertest(app).get("/escapes");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/available dois retourner un tableau des escapes disponibles", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/available");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/averageCapacity dois retourner un tableau de la capacité moyenne", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/averageCapacity");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Object);
});

test("GET /escapes/capacityAbove/:capacity dois retourner un tableau d'escapes", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/capacityAbove/10");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/pricesAbove/:price dois retourner un tableau d'escapes", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/pricesAbove/10");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/difficulty/:difficulty dois retourner un tableau d'escapes", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/difficulty/Facile");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/available/difficulty/:difficulty dois retourner un tableau d'escapes", async () => {
  //arrange
  const response = await supertest(app).get(
    "/escapes/available/difficulty/Facile"
  );
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/pricesBelow/:price dois retourner un tableau d'escapes", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/pricesBelow/150");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /escapes/pricesBetween/:minPrice/:maxPrice dois retourner un tableau d'escapes", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/pricesBetween/50/150");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

// test("POST /escapes dois ajouter un escape", async () => {
//   //arrange
//   const statusAttendu = 201;
//   const token = await getToken();
//   const escape = {
//     nom_escape: "Escape Test",
//     capacite: 10,
//     prix: 100,
//     lieu: "Sur Site",
//     difficulte: "Facile",
//   };
//   const response = await supertest(app)
//     .post("/escapes")
//     .set("Authorization", `${token}`)
//     .send(escape);
//     console.log(response.body);
//     expect(response.status).toBe(statusAttendu);
// });

// test ("PATCH /escapes/:id dois modifier un escape", async () => {
//   //arrange
//   const statusAttendu = 200;
//   const token = await getToken();
//   const escapeModifier = {
//     nom_escape: "Escape Test",
//     capacite: 10,
//     prix: 100,
//     lieu: "Sur Site",
//     difficulte: "Facile",
//   };
//   const response = await supertest(app)
//     .patch("/escapes/9")
//     .set("Authorization", `${token}`)
//     .send(escapeModifier);
//   //act
//   expect(response.status).toBe(statusAttendu);
// });

// test ("DELETE /escapes/:id dois supprimer un escape", async () => {
//   //arrange
//   const statusAttendu = 204;
//   const token = await getToken();
//   const response = await supertest(app)
//     .delete("/escapes/9")
//     .set("Authorization", `${token}`);
//   //act
//   expect(response.status).toBe(statusAttendu);
// });
    

test("GET /escape/:id dois retourner un escape", async () => {
  //arrange
  const response = await supertest(app).get("/escapes/1");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Object);
});
