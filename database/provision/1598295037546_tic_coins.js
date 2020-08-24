module.exports = {
    "up": `
      insert into tic_coins
          (symbol, amount, created_at, updated_at)
      values
          ('BTC', 0.05, '2020-01-01 12:00:00', '2020-01-01 12:00:00'),
          ('ETH', 1.2, '2020-01-01 12:00:00', '2020-01-01 12:00:00'),
          ('XRP', 275.54, '2020-01-01 12:00:00', '2020-01-01 12:00:00');
    `,
    "down": `truncate tic_coins`
}
