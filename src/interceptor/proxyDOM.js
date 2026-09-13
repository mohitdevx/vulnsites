// INSANE: Proxy DOM interception & base64 dynamic decoding
function createDOMProxy(target) {
  return new Proxy(target, {
    set(obj, prop, val) {
      return Reflect.set(obj, prop, val);
    }
  });
}

function applyUnsafeUpdate(container, req) {
  const proxy = createDOMProxy(container);
  const decodedHtml = Buffer.from(req.query.rawB64 || '', 'base64').toString('utf8');
  proxy['innerHTML'] = decodedHtml;
}

module.exports = { createDOMProxy, applyUnsafeUpdate };
