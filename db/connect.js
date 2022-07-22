const { MongoClient, Logger, ObjectId } = require('mongodb');
const url = require('url');

const isProduction = process.env.NODE_ENV === 'production';
const proxyUrl = process.env.QUOTAGUARDSTATIC_URL_SOCKS5;
const proxyValues = proxyUrl?.split(new RegExp('[/(:\\/@)/]+'));

let _db;

const connectDB = (callback) => {
  const client = new MongoClient(process.env.MONGO_URI
    .replace('<MONGO_USER>', process.env.MONGO_USER)
    .replace('<MONGO_PASSWORD>', process.env.MONGO_PASSWORD),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...isProduction && proxyUrl && {
        proxyUsername: proxyValues[1],
        proxyPassword: proxyValues[2],
        proxyHost: proxyValues[3],
        proxyPort: proxyValues[4]
      }
    });

  Logger.setLevel('debug');
  Logger.filter('class', ['Db']);

  client
    .connect()
    .then((connection) => {
      console.log('Connected!');
      _db = connection.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.connectDB = connectDB;
exports.getDb = getDb;
exports.ObjectId = ObjectId;
