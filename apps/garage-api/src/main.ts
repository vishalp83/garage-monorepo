import express from 'express';
import { setup } from "./app";

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

// const app = express();

// app.get('/', (req, res) => {
//   res.send({ message: 'Hello API' });
// });

const app = setup();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});