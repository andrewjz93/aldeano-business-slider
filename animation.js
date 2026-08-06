import { CONFIG } from "./config.js";

let sliderAnimation = null;
let interactionsConfigured = false;

export function startSlider(track, viewport) {
  stopSlider();

  if (!track || !viewport) {
    console.error(
      "[Aldeano Slider] No se encontró el track o el viewport."
    );
    return;
  }

  /*
   * Esperamos dos fotogramas para asegurarnos de que
   * el navegador haya calculado el ancho del contenido.
   */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      createAnimation(track, viewport);
    });
  });
}

export function stopSlider() {
  if (sliderAnimation) {
    sliderAnimation.cancel();
    sliderAnimation = null;
  }
}

export function pauseSlider() {
  if (sliderAnimation) {
    sliderAnimation.pause();
  }
}

export function resumeSlider() {
  if (sliderAnimation) {
    sliderAnimation.play();
  }
}

function createAnimation(track, viewport) {
  const totalWidth = track.scrollWidth;

  /*
   * slider.js crea dos copias idénticas de la lista.
   * Por eso la distancia del ciclo es la mitad del track.
   */
  const loopDistance = totalWidth / 2;

  if (!Number.isFinite(loopDistance) || loopDistance <= 0) {
    console.error(
      "[Aldeano Slider] El ancho del carrusel no es válido:",
      {
        totalWidth,
        loopDistance
      }
    );
    return;
  }

  const speed = Math.max(Number(CONFIG.speed) || 24, 1);

  /*
   * Duración necesaria para recorrer la distancia
   * manteniendo la velocidad expresada en píxeles/segundo.
   */
  const duration = (loopDistance / speed) * 1000;

  sliderAnimation = track.animate(
    [
      {
        transform: "translate3d(0, 0, 0)"
      },
      {
        transform:
          `translate3d(-${loopDistance}px, 0, 0)`
      }
    ],
    {
      duration,
      iterations: Infinity,
      easing: "linear"
    }
  );

  if (!CONFIG.autoplay) {
    sliderAnimation.pause();
  }

  configureInteractions(viewport);

  if (CONFIG.debug) {
    console.log(
      "[Aldeano Slider] Animación iniciada",
      {
        totalWidth,
        loopDistance,
        speed,
        duration
      }
    );
  }
}

function configureInteractions(viewport) {
  if (interactionsConfigured) {
    return;
  }

  interactionsConfigured = true;

  if (CONFIG.pauseOnHover) {
    viewport.addEventListener(
      "mouseenter",
      pauseSlider
    );

    viewport.addEventListener(
      "mouseleave",
      resumeSlider
    );
  }

  if (CONFIG.pauseOnFocus) {
    viewport.addEventListener(
      "focusin",
      pauseSlider
    );

    viewport.addEventListener(
      "focusout",
      resumeSlider
    );
  }

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        pauseSlider();
      } else {
        resumeSlider();
      }
    }
  );
}