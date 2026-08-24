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


// =====================================================
// INICIAR SLIDER
// =====================================================

async function initializeSlider() {

  const track =
    document.getElementById(
      "sliderTrack"
    );

  const viewport =
    document.getElementById(
      "sliderViewport"
    );


  if (
    !track ||
    !viewport
  ) {

    console.error(
      "[Aldeano Slider] Faltan elementos en index.html:",
      {
        sliderTrack:
          track,

        sliderViewport:
          viewport
      }
    );

    return;

  }


  try {

    let companies =
      await loadCompanies();


    if (
      !Array.isArray(
        companies
      )
    ) {

      throw new Error(
        "La fuente no devolvió una lista válida."
      );

    }


    // =================================================
    // MEZCLAR SI ESTÁ ACTIVADO
    // =================================================

    if (
      CONFIG.shuffleItems
    ) {

      companies =
        shuffleArray(
          companies
        );

    }


    // =================================================
    // SIN PUBLICACIONES
    // =================================================

    if (
      companies.length === 0
    ) {

      showError(
        track,
        "No hay publicaciones disponibles."
      );

      return;

    }


    // =================================================
    // LISTA ORIGINAL
    // =================================================

    const sliderCompanies =
      prepareSliderList(
        companies
      );


    const originalCount =
      sliderCompanies.length;


    // =================================================
    // DUPLICAR PARA LOOP INFINITO
    //
    // Ejemplo:
    //
    // A B C D
    // A B C D
    //
    // La animación recorre solamente la primera copia.
    // =================================================

    const infiniteCompanies = [
      ...sliderCompanies,
      ...sliderCompanies
    ];


    // =================================================
    // RENDER
    // =================================================

    renderCompanies(
      track,
      infiniteCompanies
    );


    // =================================================
    // INICIAR ANIMACIÓN
    // =================================================

    if (
      CONFIG.autoplay &&
      originalCount > 1
    ) {

      requestAnimationFrame(
        () => {

          requestAnimationFrame(
            () => {

              startSlider(
                track,
                viewport,
                originalCount
              );

            }
          );

        }
      );

    }


    // =================================================
    // DEBUG
    // =================================================

    debugLog(
      `${originalCount} publicaciones cargadas`
    );


  } catch (error) {

    console.error(
      "[Aldeano Slider] Error al iniciar:",
      error
    );


    showError(
      track,
      "No fue posible cargar las publicaciones."
    );

  }

}


// =====================================================
// PREPARAR LISTA
// =====================================================

function prepareSliderList(
  companies
) {

  return [
    ...companies
  ];

}


// =====================================================
// MEZCLAR CONTENIDO
// =====================================================

function shuffleArray(
  items
) {

  const copy =
    [...items];


  for (
    let index =
      copy.length - 1;

    index > 0;

    index--
  ) {

    const randomIndex =
      Math.floor(
        Math.random() *
        (index + 1)
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


// =====================================================
// DEBUG
// =====================================================

function debugLog(
  message
) {

  if (
    CONFIG.debug
  ) {

    console.log(
      `[Aldeano Business Slider] ${message}`
    );

  }

}