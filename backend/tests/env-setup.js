/** Carregado com `node --import ./tests/env-setup.js` antes dos testes. */
process.env.JWT_SECRET = "test-jwt-secret-key-for-integration-tests-32";
process.env.DATABASE_PATH = ":memory:";
process.env.CORS_ORIGIN = "*";
