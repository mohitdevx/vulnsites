// EXTREMELY HARD: Curried higher-order functions with deferred execution
const createRenderer = (targetElement) => (propertyName) => (contentPayload) => {
  targetElement[propertyName] = contentPayload;
};

function renderDeferredUserCard(container, req) {
  const inject = createRenderer(container)('innerHTML');
  const cardMarkup = `<div><span>Author: ${req.query.author}</span></div>`;
  inject(cardMarkup);
}

module.exports = { createRenderer, renderDeferredUserCard };
