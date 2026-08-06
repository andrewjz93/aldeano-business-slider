export function renderCompanies(track, companies) {
  track.innerHTML = companies
    .map(createCompanyCard)
    .join("");
}

export function createCompanyCard(company) {
  const premiumStar = company.premium
    ? `
      <span
        class="premium-star"
        title="Empresa Premium"
        aria-label="Empresa Premium"
      >
        ⭐
      </span>
    `
    : "";

  const badgeType = sanitizeClassName(
    company.badgeTipo || "empresa"
  );

  const activityIcon = getActivityIcon(
    company.badgeTipo
  );

  return `
    <a
      class="company-card"
      href="${escapeAttribute(company.url || "#")}"
      target="_top"
      rel="noopener noreferrer"
      aria-label="Ver empresa ${escapeAttribute(company.nombre)}"
    >
      <div class="card-image-wrapper">
        <img
          class="card-image"
          src="${escapeAttribute(company.imagen)}"
          alt="${escapeAttribute(company.nombre)}"
          loading="lazy"
        >

        <div class="card-overlay"></div>

        ${premiumStar}

        <span
          class="company-badge badge-${badgeType}"
        >
          ${escapeHtml(company.badge || "EMPRESA")}
        </span>

        <img
          class="company-logo"
          src="${escapeAttribute(company.logo || company.imagen)}"
          alt="Logo de ${escapeAttribute(company.nombre)}"
          loading="lazy"
        >
      </div>

      <div class="card-content">
        <h3 class="company-name">
          ${escapeHtml(company.nombre)}
        </h3>

        <p class="company-category">
          ${escapeHtml(company.categoria || "Empresa")}
        </p>

        <p class="company-location">
          <span aria-hidden="true">📍</span>

          <span>
            ${escapeHtml(company.ciudad || "Argentina")}
          </span>
        </p>

        <p class="company-activity">
          <span aria-hidden="true">
            ${activityIcon}
          </span>

          <span>
            ${escapeHtml(
              company.actividad || "Empresa destacada"
            )}
          </span>
        </p>
      </div>
    </a>
  `;
}

export function showError(track, message) {
  track.innerHTML = `
    <div class="error-message">
      ${escapeHtml(message)}
    </div>
  `;
}

function getActivityIcon(type) {
  const icons = {
    activa: "🟢",
    video: "🎥",
    promo: "🎁",
    destacada: "⭐",
    nueva: "🆕"
  };

  return icons[type] || "🏢";
}

function sanitizeClassName(value) {
  return String(value || "empresa")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}