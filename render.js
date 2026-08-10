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

  const activityType =
    company.origen ||
    company.badgeTipo ||
    "empresa";

  const badgeType = sanitizeClassName(
    normalizeBadgeType(activityType)
  );

  const activityIcon = getActivityIcon(
    activityType
  );

  const activityText = getActivityText(
    company
  );

  const badgeText = getBadgeText(
    company
  );

  const cardUrl =
    company.url ||
    company.sitio_web ||
    "#";

  return `
    <a
      class="company-card"
      href="${escapeAttribute(cardUrl)}"
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
          ${escapeHtml(badgeText)}
        </span>

        <img
          class="company-logo"
          src="${escapeAttribute(
            company.logo || company.imagen
          )}"
          alt="Logo de ${escapeAttribute(company.nombre)}"
          loading="lazy"
        >
      </div>

      <div class="card-content">
        <h3 class="company-name">
          ${escapeHtml(company.nombre)}
        </h3>

        <p class="company-category">
          ${escapeHtml(
            company.categoria || "Empresa"
          )}
        </p>

        <p class="company-location">
          <span aria-hidden="true">📍</span>

          <span>
            ${escapeHtml(
              company.ciudad || "Argentina"
            )}
          </span>
        </p>

        <p class="company-activity">
          <span aria-hidden="true">
            ${activityIcon}
          </span>

          <span>
            ${escapeHtml(activityText)}
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

function getActivityText(company) {
  if (company.titulo) {
    return company.titulo;
  }

  if (company.actividad) {
    return company.actividad;
  }

  if (company.premium) {
    return "Empresa Premium";
  }

  if (company.destacada) {
    return "Empresa destacada";
  }

  return "Empresa en El Aldeano";
}

function getBadgeText(company) {
  const origin = String(
    company.origen || ""
  ).toLowerCase();

  if (origin === "youtube") {
    return "VIDEO";
  }

  if (
    origin === "wix_group" ||
    origin === "wixgroups"
  ) {
    return "NUEVO POST";
  }

  if (origin === "rss") {
    return "NOVEDAD";
  }

  if (company.premium) {
    return "PREMIUM";
  }

  if (company.destacada) {
    return "DESTACADA";
  }

  return company.badge || "EMPRESA";
}

function getActivityIcon(type) {
  const normalized =
    String(type || "").toLowerCase();

  const icons = {
    youtube: "🎥",
    video: "🎥",

    wix_group: "📰",
    wixgroups: "📰",

    rss: "📰",

    activa: "🟢",
    promo: "🎁",
    promocion: "🎁",
    destacada: "⭐",
    nueva: "🆕",
    empresa: "🏢"
  };

  return icons[normalized] || "🏢";
}

function normalizeBadgeType(type) {
  const normalized =
    String(type || "").toLowerCase();

  const mapping = {
    youtube: "video",
    video: "video",

    wix_group: "destacada",
    wixgroups: "destacada",

    rss: "nueva",

    promocion: "promo",
    promo: "promo",

    activa: "activa",
    destacada: "destacada",
    nueva: "nueva"
  };

  return mapping[normalized] || "activa";
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