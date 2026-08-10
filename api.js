import { CONFIG } from "./config.js";

export async function loadCompanies() {
  const response = await fetch(CONFIG.dataSource, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `No se pudieron cargar las empresas. Código: ${response.status}`
    );
  }

  const data = await response.json();

  let companies = [];

  if (Array.isArray(data)) {
    companies = data;
  } else if (Array.isArray(data.results)) {
    companies = data.results;
  } else {
    throw new Error(
      "La API no devolvió una lista válida de empresas."
    );
  }

  return companies
    .map(normalizeCompany)
    .filter(isValidCompany)
    .slice(0, CONFIG.maximumCompanies);
}

function normalizeCompany(company) {
  const hasActivity =
    Boolean(company.origen) ||
    Boolean(company.titulo);

  return {
    id: company.id,

    nombre:
      company.nombre || "Empresa",

    categoria:
      company.categoria || "Empresa",

    ciudad:
      company.ciudad || "Argentina",

    provincia:
      company.provincia || "",

    imagen:
      company.actividad_imagen ||
      company.imagen ||
      "https://picsum.photos/500/500",

    logo:
      company.logo ||
      company.imagen ||
      company.actividad_imagen ||
      "https://picsum.photos/100/100",

    // =========================
    // ACTIVIDAD RECIENTE
    // =========================

    origen:
      company.origen || "",

    titulo:
      company.titulo || "",

    actividadUrl:
      company.actividad_url || "",

    actividadImagen:
      company.actividad_imagen || "",

    fechaPublicacion:
      company.fecha_publicacion || "",

    actividad:
      hasActivity
        ? company.titulo
        : company.premium
          ? "Empresa Premium"
          : company.destacada
            ? "Empresa destacada"
            : "Empresa en El Aldeano",

    // =========================
    // BADGE
    // =========================

    badge:
      getBadge(company),

    badgeTipo:
      getBadgeType(company),

    premium:
      Boolean(company.premium),

    destacada:
      Boolean(company.destacada),

    // =========================
    // ENLACE DE LA TARJETA
    // =========================

    url:
      company.sitio_web ||
      "https://www.elaldeano.online"
  };
}

function getBadge(company) {
  const origen =
    String(company.origen || "").toLowerCase();

  if (origen === "youtube") {
    return "VIDEO";
  }

  if (
    origen === "wix_group" ||
    origen === "wixgroups"
  ) {
    return "NUEVO POST";
  }

  if (origen === "rss") {
    return "NOVEDAD";
  }

  if (company.premium) {
    return "PREMIUM";
  }

  if (company.destacada) {
    return "DESTACADA";
  }

  return "EMPRESA";
}

function getBadgeType(company) {
  const origen =
    String(company.origen || "").toLowerCase();

  if (origen === "youtube") {
    return "video";
  }

  if (
    origen === "wix_group" ||
    origen === "wixgroups"
  ) {
    return "destacada";
  }

  if (origen === "rss") {
    return "nueva";
  }

  if (company.premium) {
    return "destacada";
  }

  if (company.destacada) {
    return "destacada";
  }

  return "activa";
}

function isValidCompany(company) {
  return Boolean(
    company &&
    company.id !== undefined &&
    company.nombre &&
    company.imagen
  );
}