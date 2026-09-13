// HARD: Computed property names, aliasing and Array joins
function populateCard(domElement, userParam) {
  const parts = ['inner', 'HTML'];
  const propKey = parts.join('');
  
  const payloadSegments = [
    '<div class="profile">',
    userParam,
    '</div>'
  ];
  
  // Property computed at runtime
  domElement[propKey] = payloadSegments.join('');
}

module.exports = { populateCard };
