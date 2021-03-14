import { Transform } from 'stream';
import { stdin, stdout } from 'process';

const reverseInput = new Transform({
  transform: (data, _, cb) => {
    const stringData = data.toString();
    if (stringData !== null) {
      const resultString = `${stringData.split('').reverse().join('')}\n`;
      cb(null, resultString);
    } else {
      cb(null, '')
    }
  },
});

stdin.setEncoding('utf8');

stdin.pipe(reverseInput).pipe(stdout);
