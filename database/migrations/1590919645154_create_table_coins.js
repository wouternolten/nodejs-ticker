module.exports = {
  up:
    `CREATE TABLE tic_coins (
    id INT NOT NULL AUTO_INCREMENT,
    symbol VARCHAR(255) NOT NULL,
    amount DECIMAL(14,5) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT UK_SYMBOL UNIQUE (symbol),
    PRIMARY KEY (id)
    );`,
  down: "DROP TABLE IF EXISTS tic_coins",
};
