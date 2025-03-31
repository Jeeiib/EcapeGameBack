const connection = require("../config/bdd");

function AllGames() {
  return connection
    .promise()
    .query("SELECT * FROM escape_game")
    .then((results) => {
      return results[0];
    });
}

function OneGame(id) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE id_escape = ?", [id])
    .then((results) => {
      return results[0][0];
    });
}

function AvailableGames() {
  return connection
    .promise()
    .query("SELECT * from escape_game WHERE status = 1")
    .then((results) => {
      return results[0];
    });
}

function averageCapacity() {
  return connection
    .promise()
    .query("SELECT AVG(capacity) as 'Capacityé moyenne' FROM escape_game")
    .then((results) => {
      return results[0][0];
    });
}

function CapacityAbove(capacity) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE capacity >= ?", [capacity])
    .then((results) => {
      return results[0];
    });
}

function PricesAbove(price) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE price >= ?", [price])
    .then((results) => {
      return results[0];
    });
}

function GamesByDifficulty(difficulty) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE difficulte LIKE ?", [difficulty])
    .then((results) => {
      return results[0];
    });
}

function AvailableGamesByDifficulty(difficulty) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE status = 1 AND difficulte LIKE ?", [
      difficulty,
    ])
    .then((results) => {
      return results[0];
    });
}

function PricesBelow(price) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE price <= ?", [price])
    .then((results) => {
      return results[0];
    });
}

function PricesBetween(min, max) {
  return connection
    .promise()
    .query("SELECT * FROM escape_game WHERE price BETWEEN ? AND ?", [min, max])
    .then((results) => {
      return results[0];
    });
}

async function AddGame(game) {
  const results = await connection
    .promise()
    .query("INSERT INTO escape_game SET ?", [game]);
  return await OneGame(results[0].insertId);
}

async function UpdateGame(id, game) {
  await connection
    .promise()
    .query("UPDATE escape_game SET ? WHERE id_escape = ?", [game, id]);
  return await OneGame(id);
}

async function DeleteGame(id) {
  const response = await connection
    .promise()
    .query("DELETE FROM escape_game WHERE id_escape = ?", [id]);
  return response[0].affectedRows;
}

module.exports = {
  AllGames,
  OneGame,
  AvailableGames,
  PricesAbove,
  GamesByDifficulty,
  AvailableGamesByDifficulty,
  PricesBelow,
  PricesBetween,
  AddGame,
  UpdateGame,
  DeleteGame,
  CapacityAbove,
  averageCapacity,
};
