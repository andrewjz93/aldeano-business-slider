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

    let companies =
      await loadCompanies();


    if (!Array.isArray(companies)) {

      throw new Error(
        "La fuente no devolvió una lista válida."
      );

    }


    if (CONFIG.shuffleItems) {

      companies =
        shuffleArray(companies);

    }


    if (companies.length === 0) {

      showError(
        track,
        "No hay publicaciones disponibles."
      );

      return;

    }


    /*
     * IMPORTANTE:
     *
     * Ya NO fabricamos copias adicionales
     * para llegar a 20 tarjetas.
     *
     * Cada tarjeta corresponde a un registro
     * real devuelto por /v1/feed.
     */

    const sliderCompanies =
      prepareSliderList(
        companies
      );


    renderCompanies(
      track,
      sliderCompanies
    );


    /*
     * Solo iniciamos la animación cuando
     * realmente hay más de una tarjeta.
     */

    if (
      CONFIG.autoplay &&
      sliderCompanies.length > 1
    ) {

      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          startSlider(
            track,
            viewport
          );

        });

      });

    }


    debugLog(
      `${companies.length} publicaciones cargadas`
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


/*
 * =====================================================
 * PREPARAR LISTA
 * =====================================================
 *
 * No repetimos contenido artificialmente.
 *
 * Si el feed devuelve:
 *
 * Tecnova post 1
 * Tecnova post 2
 * Agro Sur
 * Fercam
 *
 * esas son exactamente las tarjetas que
 * renderizamos.
 */

function prepareSliderList(companies) {

  return [...companies];

}


/*
 * =====================================================
 * MEZCLAR CONTENIDO
 * =====================================================
 */

function shuffleArray(items) {

  const copy =
    [...items];


  for (
    let index = copy.length - 1;
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


/*
 * =====================================================
 * DEBUG
 * =====================================================
 */

function debugLog(message) {

  if (CONFIG.debug) {

    console.log(
      `[Aldeano Business Slider] ${message}`
    );

  }

}