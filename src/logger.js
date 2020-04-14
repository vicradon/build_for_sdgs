const fs = require('fs');

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  const timeDiff = Math.trunc((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS).toString();
  if (timeDiff.length === 1) return `0${timeDiff}`;
  return timeDiff;
};

const logger = ((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const content = (`${req.method}\t\t${req.originalUrl}\t\t${res.statusCode}\t\t${durationInMilliseconds.toLocaleString()} ms\n`);

    fs.appendFile('./src/logs.txt', content, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
  });

  next();
});

module.exports = logger;
