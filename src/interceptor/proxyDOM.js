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
  proxy.textContent = DOMPurify.sanitize(decodedHtml);

module.exports = { createDOMProxy, applyUnsafeUpdate };
