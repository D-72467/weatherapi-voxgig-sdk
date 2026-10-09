import { readFileSync, writeFileSync } from 'node:fs';

const path = 'openapi.json';
const spec = JSON.parse(readFileSync(path, 'utf8'));
const pseudo = '/current.json#bulk';
const target = '/current.json';
if (!spec.paths?.[pseudo]) {
  console.log('No bulk fragment path present; leaving OpenAPI unchanged.');
} else {
  const src = spec.paths[pseudo];
  const dst = spec.paths[target] ?? {};
  for (const method of ['get','put','post','delete','patch','options','head','trace']) {
    if (src[method]) {
      if (dst[method]) throw new Error('Method collision for ' + method + ' ' + target);
      dst[method] = src[method];
    }
  }
  // Carry shared non-method fields only when they do not collide.
  for (const [key, value] of Object.entries(src)) {
    if (!['get','put','post','delete','patch','options','head','trace'].includes(key) && dst[key] === undefined) {
      dst[key] = value;
    }
  }
  spec.paths[target] = dst;
  delete spec.paths[pseudo];
  writeFileSync(path, JSON.stringify(spec, null, 2) + '\n');
  console.log('Normalised invalid OpenAPI fragment route /current.json#bulk to POST /current.json');
}
