// EASY: Intermediate variables & template literals in XSS sinks
function renderUserProfile(container, req) {
  const name = req.query.name;
  const cardSnippet = `
    <div class="user-card">
      <h3>${name}</h3>
      <p>Active Account</p>
    </div>
  `;
  container.innerHTML = DOMPurify.sanitize(cardSnippet);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderBanner(req, res) {
  // Encode untrusted query input before embedding it in the HTML response
  const alertText = escapeHtml(req.query.announcement);
  const bannerHtml = "<div class='alert-banner'>" + alertText + "</div>";
  res.send(bannerHtml);
}

module.exports = { renderUserProfile, renderBanner };
