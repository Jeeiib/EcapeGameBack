require("./setup");

test("GET /reservations doit retourner un tableau des réservations", async () => {
  //arrange
  const response = await supertest(app).get("/reservations");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /reservations/status/:reservation_status doit retourner un tableau des réservations avec le statut spécifié", async () => {
  //arrange
  const response = await supertest(app).get("/reservations/status/confirmed");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /reservations/averageTotalCost doit retourner le coût total moyen des réservations", async () => {
  //arrange
  const response = await supertest(app).get("/reservations/averageTotalCost");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /reservations/costAbove/:price doit retourner les réservations avec un coût total supérieur au prix spécifié", async () => {
  //arrange
  const response = await supertest(app).get("/reservations/costAbove/100");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /reservations/nameEscape/:nom doit retourner les réservations pour le jeu d'évasion spécifié", async () => {
  //arrange
  const response = await supertest(app).get(
    "/reservations/nameEscape/Le Trône de Fer "
  );
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /reservations/maxReservations doit retourner le client qui à le plus de reservations", async () => {
  //arrange
  const response = await supertest(app).get("/reservations/maxReservations");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toBeInstanceOf(Array);
});

// test("PATCH /reservations/:id doit mettre à jour une réservation", async () => {
//   //arrange
//   const token = await getToken();
//   const response = await supertest(app)
//     .patch("/reservations/10")
//     .set("Authorization", token)
//     .send({ reservation_status: "confirmed" });
//   //act
//   expect(response.status).toBe(200);
//   //assert
//   // Vérifier que response.body est un tableau et que le premier élément a la propriété attendue
//   expect(response.body).toBeInstanceOf(Array);
//   expect(response.body[0]).toHaveProperty("reservation_status", "confirmed");
// });

// test ("DELETE /reservations/:id doit supprimer une réservation", async () => {
//   //arrange
//   const token = await getToken();
//   const response = await supertest(app)
//     .delete("/reservations/10")
//     .set("Authorization", token);
//   //act
//   expect(response.status).toBe(204);
//   //assert
//   expect(response.body).toHaveProperty("message", "Réservation supprimée");
// });

// test("POST /reservations doit créer une nouvelle réservation", async () => {
//     //arrange
//     const token = await getToken();
    
//     // Récupérer les clients et escape games existants
//     const clientsResponse = await supertest(app).get("/clients");
//     const escapesResponse = await supertest(app).get("/escapes");
    
//     // Vérifier qu'il y a des clients et des escape games
//     expect(clientsResponse.body.length).toBeGreaterThan(0);
//     expect(escapesResponse.body.length).toBeGreaterThan(0);
    
//     // Utiliser les IDs du premier client et du premier escape game
//     const clientId = clientsResponse.body[0].id_client;
//     const escapeId = escapesResponse.body[0].id_escape;
    
//     const newReservation = {
//       id_client: clientId,
//       id_escape: escapeId,
//       lieu: "Sur site",
//       reservation_status: "En attente",
//       prix_total: 100,
//       date_heure: "2024-03-20 14:00:00"
//     };
    
//     // Vérifier que le token existe
//     expect(token).toBeTruthy();
//     console.log("Token utilisé:", token);
//     console.log("Réservation à créer:", newReservation);
    
//     const response = await supertest(app)
//       .post("/reservations")
//       .set("Authorization", token) // Utiliser directement le token qui contient déjà le préfixe Bearer
//       .send(newReservation);
    
//     //act
//     expect(response.status).toBe(201);
//     //assert
//     expect(response.body).toHaveProperty("id_reservation");
// });

test ("GET /reservations/:id doit retourner une réservation par son ID", async () => {
  //arrange
  const response = await supertest(app).get("/reservations/2");
  //act
  expect(response.status).toBe(200);
  //assert
  expect(response.body).toHaveProperty("id_reservation", 2);
});

