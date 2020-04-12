const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true
  })
);
app.use(express.static('src/public'));
app.options('*', cors());

app.get('/', (req, res) => res.send('Working!!!'));

app.listen(process.env.PORT || 7000, () => {
  // eslint-disable-next-line no-console
  console.log('server running on port 7000', 'http://localhost:7000', '');
});
