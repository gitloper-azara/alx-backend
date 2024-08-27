import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient();

const getAsync = promisify(client.get).bind(client);

const express = require('express');

const app = express();
const port = 1245;

const listProducts = [
  {
    itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4,
  },
  {
    itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10,
  },
  {
    itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2,
  },
  {
    itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5,
  },
];

function getItemById(itemId) {
  return listProducts.find((product) => product.itemId === itemId);
}

app.get('/list_products', (request, response) => {
  const array = [];

  for (let i = 1; i <= listProducts.length; i += 1) {
    const product = getItemById(i);
    if (product) {
      array.push(product);
    }
  }
  response.json(array);
});


function reserveStockById(itemId, stock) {
  const item = getItemById(itemId);
  client.set(`item.${item.itemId}`, stock);
};

async function getCurrentReservedStockById(itemId) {
  try {
    const value = await getAsync(`item.${itemId}`);
    return value;
  } catch (err) {
    console.error(err);
  }
};

app.get('/list_products/:itemId(\\d+)', async (request, response) => {
  const { itemId } = request.params;
  const item = getItemById(parseInt(itemId));
  if (!item) {
    return response.json({ "status": "Product not found" });
  }
  const reservedStock = await getCurrentReservedStockById(parseInt(itemId));
  const res = {
    itemId: item.itemId,
    itemName: item.itemName,
    price: item.price,
    initialAvailableQuantity: item.initialAvailableQuantity,
    currentQuantity: reservedStock || item.initialAvailableQuantity
  };
  response.json(res);
});

app.listen(port);
