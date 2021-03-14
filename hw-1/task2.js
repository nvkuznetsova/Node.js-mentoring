import {
  existsSync,
  appendFile,
  createReadStream,
  createWriteStream,
} from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson';

const checkIfOutputExists = () => {
  if (!existsSync('output.txt')) {
    appendFile('output.txt', '', (err) => {
      if (err) {
        console.log('Failed to create file', err);
      } else {
        console.log('Output file created');
      }
    });
  } else {
    console.log('Output file exists');
  }
};

checkIfOutputExists();

pipeline(
  csv({ objectMode: true }).fromStream(createReadStream('hw-1/hw1.csv')),
  createWriteStream('output.txt'),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);
