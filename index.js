const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const swaggerUi = require('swagger-ui-express');

const app = express();  
const PORT = process.env.PORT || 3000;


//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Escape Game API');
}
);

//Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);