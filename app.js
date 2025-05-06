const express = require('express');
const routes = require('./src/routes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

app.use('/api', routes);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AceAnalytics ATS API',
      version: '1.0.0',
      description: 'API documentation for the AceAnalytics assignment project',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
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
