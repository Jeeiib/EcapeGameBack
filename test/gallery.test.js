require("./setup");

test("GET /gallery/photos doit retourner un tableau de photos", async () => {
  const response = await supertest(app).get("/gallery/photos");
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});

test("GET /gallery/photos/game/:gameId doit retourner un tableau de photos pour un jeu spécifique", async () => {
  const response = await supertest(app).get("/gallery/photos/game/1");
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});

// Les tests d'upload et de like nécessitent une authentification
// et sont plus complexes à mettre en place