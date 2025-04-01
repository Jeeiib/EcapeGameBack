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

test ("GET /clients/email/:email dois retourner un client", async () => {
  //arrange
  const response = await supertest(app).get("/clients/email/renartjeanbaptiste@gmail.com");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Object);
});

test("GET /clients/id dois retourner un client", async () => {
  //arrange
  const response = await supertest(app).get("/clients/2");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Object);
});

test("GET /clients/clientsByYear/:year dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get("/clients/clientsByYear/2025");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /clients/totalCostAbove/:price dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get("/clients/totalCostAbove/100");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /clients/clientsByRegistrationDate/:month/:year dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get(
    "/clients/clientsByRegistrationDate/01/2025"
  );
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /clients/clientsByreservationDate/:month/:year dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get(
    "/clients/clientsreservationDate/01/2025"
  );
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /clients/escapeRoom/:id dois retourner un tableau de clients", async () => {
  //arrange
  const response = await supertest(app).get("/clients/escapeRoom/1");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /maxAmountSpent dois le montant le plus elevé sous forme de tableau", async () => {
  //arrange
  const response = await supertest(app).get("/clients/maxAmountSpent");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

// test("POST /clients dois ajouter un client", async () => {
//   const statusAttendu = 201;
//   const token = await getToken();
//   const clientAjouter = {
//     prenom: "Laura",
//     nom: "Gendrault",
//     email: "l.gendrault@gmail.com",
//     phone: "0606060606",
//     password: "root",
//   };
//   const response = await supertest(app)
//     .post("/clients")
//     .set("Authorization", `${token}`)
//     .send(clientAjouter);
//   console.log(response.body);
//   expect(response.status).toBe(statusAttendu);
//   expect(response.body.prenom).toBe(clientAjouter.prenom);
//   expect(response.body.nom).toBe(clientAjouter.nom);
//   expect(response.body.email).toBe(clientAjouter.email);
//   expect(response.body.phone).toBe(clientAjouter.phone);
// });

// test("PATCH /clients/:id dois modifier un client", async () => {
//   const statusAttendu = 200;
//   const token = await getToken();
//   const clientModifier = {
//     prenom: "Laura",
//     nom: "Gendrault",
//     email: "l.gendrault@gmail.com",
//     phone: "0606060606",
//     password: "root",
//   };
//   const response = await supertest(app)
//     .patch("/clients/13")
//     .set("Authorization", `${token}`)
//     .send(clientModifier);
//   console.log(response.body);
//   expect(response.status).toBe(statusAttendu);
//   expect(response.body.prenom).toBe(clientModifier.prenom);
//   expect(response.body.nom).toBe(clientModifier.nom);
//   expect(response.body.email).toBe(clientModifier.email);
//   expect(response.body.phone).toBe(clientModifier.phone);
// });

// test("DELETE /clients/:id dois supprimer un client", async () => {
//   const statusAttendu = 200;
//   const token = await getToken();
//   const response = await supertest(app)
//     .delete("/clients/13")
//     .set("Authorization", `${token}`);
//   console.log(response.body);
//   expect(response.status).toBe(statusAttendu);
// });


