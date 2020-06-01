module.exports = {
  up:
    "CREATE TABLE tic_coins (symbol VARCHAR(255) NOT NULL PRIMARY KEY, amount DECIMAL NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL)",
  down: "DROP TABLE IF EXISTS tic_coins",
};
