// MEDIUM: Inter-procedural flow with helper wrapper function
function setSafeContent(element, content) {
  // Sink is isolated in a utility function
  element.innerHTML = content;
}

function displayFeedback(req) {
  const target = document.querySelector('#feedback-container');
  const userFeedback = "<div class='comment'>" + req.body.message + "</div>";
  setSafeContent(target, userFeedback);
}

module.exports = { setSafeContent, displayFeedback };
