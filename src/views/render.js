// EASY: Intermediate variables & template literals in XSS sinks
function renderUserProfile(container, req) {
  const name = req.query.name;
  const cardSnippet = `
    <div class="user-card">
      <h3>${name}</h3>
      <p>Active Account</p>
    </div>
  `;
  container.innerHTML = cardSnippet;
}

function renderBanner(req, res) {
  const alertText = req.query.announcement;
  const bannerHtml = "<div class='alert-banner'>" + alertText + "</div>";
  res.send(bannerHtml);
}

module.exports = { renderUserProfile, renderBanner };
