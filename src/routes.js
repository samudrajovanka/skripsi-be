const userRoute = require('./api/routes/userRoute');
const mahasiswaRoute = require('./api/routes/mahasiswaRoute');
const authRoute = require('./api/routes/authRoute');
const beasiswaRoute = require('./api/routes/beasiswaRoute');
const kriteriaRoute = require('./api/routes/kriteriaRoute');

const createAPIUrl = (url) => `/api${url}`;

const routes = [
  {
    url: createAPIUrl('/users'),
    api: userRoute,
  },
  {
    url: createAPIUrl('/mahasiswa'),
    api: mahasiswaRoute,
  },
  {
    url: createAPIUrl('/auth'),
    api: authRoute,
  },
  {
    url: createAPIUrl('/beasiswa'),
    api: beasiswaRoute,
  },
  {
    url: createAPIUrl('/kriteria'),
    api: kriteriaRoute,
  },
];

module.exports = routes;
