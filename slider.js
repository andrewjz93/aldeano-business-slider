import { CONFIG } from "./config.js";

import {
  loadCompanies
} from "./api.js";

import {
  renderCompanies,
  showError
} from "./render.js";

import {
  startSlider
} from "./animation.js";


document.addEventListener(
  "DOMContentLoaded",
  initializeSlider
);


async function initializeSlider() {
  const track =
    document.getElementById("sliderTrack");

  const viewport =
    document.getElementById("sliderViewport");

  if (!track || !viewport) {
    console.error(
      "[Aldeano Slider] Faltan elementos en index.html:",
      {
        sliderTrack: track,
        sliderViewport: viewport
      }
    );

    return;
  }

  try {
    let companies = await loadCompanies();

    if (!Array.isArray(companies)) {
      throw new Error(
        "La fuente no devolvió una lista válida."
      );
    }

    if (CONFIG.shuffleItems) {
      companies = shuffleArray(companies);
    }

    if (companies.length === 0) {
      showError(
        track,
        "No hay empresas disponibles."
      );

      return;
    }

    const sliderCompanies =
      prepareInfiniteList(companies);

    renderCompanies(
      track,
      sliderCompanies
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startSlider(track, viewport);
      });
    });

    debugLog(
      `${companies.length} empresas cargadas`
    );

  } catch (error) {
    console.error(
      "[Aldeano Slider] Error al iniciar:",
      error
    );

    showError(
      track,
      "No fue posible cargar las empresas."
    );
  }
}


function prepareInfiniteList(companies) {
  if (!CONFIG.duplicateItems) {
    return companies;
  }

  const minimumItems = 20;
  let expandedCompanies = [...companies];

  while (
    expandedCompanies.length < minimumItems
  ) {
    expandedCompanies = [
      ...expandedCompanies,
      ...companies
    ];
  }

  return [
    ...expandedCompanies,
    ...expandedCompanies
  ];
}


function shuffleArray(items) {
  const copy = [...items];

  for (
    let index = copy.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );

    [
      copy[index],
      copy[randomIndex]
    ] = [
      copy[randomIndex],
      copy[index]
    ];
  }

  return copy;
}


function debugLog(message) {
  if (CONFIG.debug) {
    console.log(
      `[Aldeano Business Slider] ${message}`
    );
  }
}