const express = require('express');
const routes = require('./src/routes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

app.use('/api', routes);

// --- Swagger Setup ---
const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'AceAnalytics ATS API', // Your API Title
      version: '1.0.0', // Your API version
      description: 'API documentation for the AceAnalytics assignment project', // Your API description
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api`, // Adjust if your base URL is different
      },
    ],
    // Add components section for security definitions
    components: {
      securitySchemes: {
        bearerAuth: { // Can be any name, used to refer to this scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, specifies format is JWT
        },
      },
    },
  },
  apis: ['./src/routes/auth.routes.js', './src/routes/application.routes.js', './src/routes/candidate.routes.js', './src/routes/job.routes.js'], // Path to the API docs (your routes file)
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Route to serve Swagger UI


app.get('/', (req, res) => {
  res.json({ message: 'Working' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
