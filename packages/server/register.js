import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));
console.log('Registered ts-node/esm');
console.log('NODE_OPTIONS:', process.env.NODE_OPTIONS);
