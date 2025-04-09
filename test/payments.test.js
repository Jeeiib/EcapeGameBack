require("./setup");

test("GET /payments dois retourner un tableau des paiements", async () => {
  //arrange
  const response = await supertest(app).get("/payments");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /method/:method dois retourner un tableau des paiements par méthode de paiement", async () => {
  //arrange
  const response = await supertest(app).get("/payments/method/credit_card");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /total/:month/:year dois retourner le montant total par mois et année", async () => {
  //arrange
  const response = await supertest(app).get("/payments/total/01/2023");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toHaveProperty("Montant total");
});

test("GET /above/:amount dois retourner un tableau des paiements supérieurs à un montant", async () => {
  //arrange
  const response = await supertest(app).get("/payments/above/100");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /status/:status dois retourner un tableau des paiements par statut de reservation", async () => {
  //arrange
  const response = await supertest(app).get(
    "/payments/reservationStatus/:Confirmée"
  );
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /total/status/:status dois retourner le montant total par statut de reservation", async () => {
  //arrange
  const response = await supertest(app).get(
    "/payments/total/status/:Confirmée"
  );
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toHaveProperty("Montant total");
});

test("GET /count/:method dois retourner le nombre de paiements par méthode de paiement", async () => {
  //arrange
  const response = await supertest(app).get("/payments/count/Carte bancaire");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toHaveProperty("COUNT(*)");
});

// test("POST /payments dois créer un nouveau paiement", async () => {
//   //arrange
//   const token = await getToken();
//   const newPayment = {
//     amount: 100,
//     payment_method: "credit_card",
//   };
//   const response = await supertest(app)
//     .post("/payments")
//     .set("Authorization", `${token}`) // Ajouter le token dans l'en-tête
//     .send(newPayment);
//   //act
//   expect(response.status).toBe(201);
//   //assert
//   expect(response.body).toHaveProperty("insertId");
// });

// test ("PATCH /payments/:id dois mettre à jour un paiement", async () => {
//   //arrange
//   const token = await getToken();
//   const updatedPayment = {
//     amount: 150,
//     payment_method: "credit_card",
//   };
//   const response = await supertest(app)
//     .patch("/payments/6")
//     .set("Authorization", `${token}`) // Ajouter le token dans l'en-tête
//     .send(updatedPayment);
//   //act
//   expect(response.status).toBe(200);
//   //assert
//   expect(response.body).toHaveProperty("affectedRows");
// });

// test("DELETE /payments/:id dois supprimer un paiement", async () => {
//   //arrange
//   const token = await getToken();
//   const response = await supertest(app)
//     .delete("/payments/7")
//     .set("Authorization", `${token}`); // Ajouter le token dans l'en-tête
//   //act
//   expect(response.status).toBe(204);
// });

test("GET /payments/:id dois retourner un paiement par ID", async () => {
  //arrange
  const response = await supertest(app).get("/payments/1");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Object);
});
