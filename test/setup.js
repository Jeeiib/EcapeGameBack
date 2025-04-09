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
    // Stocker le token avec le préfixe Bearer
    token = `Bearer ${response.body.token}`;
    console.log("Authentication successful for tests");
  } catch (error) {
    console.error("Error during test authentication:", error.message);
  }
});

// Après tous les tests
afterAll((done) => {
  server.close(() => {
    console.log("Test server closed");
    done();
  });
});

// Rendre les variables globales disponibles pour tous les tests
global.getToken = () => token;
global.supertest = supertest;
global.app = app;