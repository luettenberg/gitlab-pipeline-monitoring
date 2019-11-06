//server.js
const app = require('./app');
const logger = require('./logging');

app.set('port', process.env.PORT || 3000);

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(app.get('port'), (err) => {
    if (err) {
      throw err;
    }
    logger.info('Server running on port ',app.get('port'));
  });