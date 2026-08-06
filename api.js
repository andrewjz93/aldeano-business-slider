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

  if (!Array.isArray(data)) {
    throw new Error(
      "El origen de datos no devolvió una lista válida."
    );
  }

  return data
    .filter(isValidCompany)
    .slice(0, CONFIG.maximumCompanies);
}

function isValidCompany(company) {
  return Boolean(
    company &&
    company.id !== undefined &&
    company.nombre &&
    company.imagen
  );
}