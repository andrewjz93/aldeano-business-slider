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
  return {
    id: company.id,

    nombre:
      company.nombre || "Empresa",

    categoria:
      company.categoria || "Empresa",

    ciudad:
      company.ciudad || "Argentina",

    imagen:
      company.imagen ||
      "https://picsum.photos/500/500",

    logo:
      company.logo ||
      company.imagen ||
      "https://picsum.photos/100/100",

    actividad:
      company.premium
        ? "Empresa Premium"
        : company.destacada
          ? "Empresa destacada"
          : "Empresa en El Aldeano",

    badge:
      company.premium
        ? "PREMIUM"
        : company.destacada
          ? "DESTACADA"
          : "EMPRESA",

    badgeTipo:
      company.premium
        ? "destacada"
        : company.destacada
          ? "destacada"
          : "activa",

    premium:
      Boolean(company.premium),

    url:
      company.sitio_web ||
      "https://www.elaldeano.online"
  };
}

function isValidCompany(company) {
  return Boolean(
    company &&
    company.id !== undefined &&
    company.nombre &&
    company.imagen
  );
}