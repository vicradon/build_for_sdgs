const fs = require('fs');

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const logger = ((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const content = (`${req.method}\t\t${req.originalUrl}\t\t${res.statusCode}\t\t${durationInMilliseconds.toLocaleString()} ms\n`);

    fs.appendFile('./src/logs.txt', content, (err) => {
      if (err) {
        console.error(err);
        return
      }
    });
  });

  next();
});

module.exports = logger;
