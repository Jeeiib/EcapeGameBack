const supertest = require("supertest");
const app = require("../index");

let token;
let server;

// Avant de commencer les tests
beforeAll(async () => {
  // Démarrer le serveur sur un port de test (différent du port par défaut)
  const testPort = 3001;
  server = app.listen(testPort, () => {
    console.log(`Test server running on port ${testPort}`);
  });

  try {
    // Se connecter pour obtenir un token
    const response = await supertest(app)
      .post("/auth/login")
      .send({ email: "renartjeanbaptiste@gmail.com", password: "root" });
    token = response.body.token;
    console.log("Authentication successful for tests");
  } catch (error) {
    console.error("Error during test authentication:", error.message);
  }
});

// Après tous les tests
afterAll(async () => {
  // Fermer le serveur de test
  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        console.log("Test server closed");
        resolve();
      });
    });
  }

  // Fermer toutes les connexions à la base de données (si nécessaire)
  // Si vous avez une connexion à la base de données, fermez-la ici
  // Par exemple: await connection.end();
});

// Rendre les variables globales disponibles pour tous les tests
global.getToken = () => token;
global.supertest = supertest;
global.app = app;