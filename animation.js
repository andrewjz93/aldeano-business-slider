import { CONFIG } from "./config.js";


let sliderAnimation = null;

let interactionsConfigured = false;

let currentTrack = null;

let currentViewport = null;

let currentOriginalCount = 0;

let resizeTimer = null;
let navigationTimer = null;
let loopDuration = 0;
let stepDuration = 0;
let animationGeneration = 0;

function setNavigationEnabled(enabled) {
  for (const id of ["sliderPrev", "sliderNext"]) {
    const button = document.getElementById(id);
    if (button) button.disabled = !enabled;
  }
}

export function moveSlider(direction) {
  if (!sliderAnimation || !loopDuration || !stepDuration) return;
  pauseSlider();
  const next = Number(sliderAnimation.currentTime || 0) + direction * stepDuration;
  // El módulo positivo permite retroceder desde la primera tarjeta a la última.
  sliderAnimation.currentTime = ((next % loopDuration) + loopDuration) % loopDuration;
  clearTimeout(navigationTimer);
  navigationTimer = setTimeout(() => {
    navigationTimer = null;
    resumeSlider();
  }, 2500);
}


// =====================================================
// INICIAR SLIDER
// =====================================================

export function startSlider(
  track,
  viewport,
  originalCount
) {

  stopSlider();
  const generation = animationGeneration;


  if (
    !track ||
    !viewport
  ) {

    console.error(
      "[Aldeano Slider] No se encontró el track o el viewport."
    );

    return;

  }


  currentTrack =
    track;

  currentViewport =
    viewport;

  currentOriginalCount =
    Number(originalCount) || 0;


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          if (generation !== animationGeneration) return;
          createAnimation(
            track,
            viewport,
            currentOriginalCount
          );

        }
      );

    }
  );

}


// =====================================================
// DETENER SLIDER
// =====================================================

export function stopSlider() {
  animationGeneration++;
  clearTimeout(navigationTimer);
  navigationTimer = null;
  loopDuration = 0;
  stepDuration = 0;
  currentOriginalCount = 0;
  setNavigationEnabled(false);

  if (
    sliderAnimation
  ) {

    sliderAnimation.cancel();

    sliderAnimation = null;

  }

}


// =====================================================
// PAUSAR SLIDER
// =====================================================

export function pauseSlider() {

  if (
    sliderAnimation
  ) {

    sliderAnimation.pause();

  }

}


// =====================================================
// REANUDAR SLIDER
// =====================================================

export function resumeSlider() {
  if (document.hidden || navigationTimer !== null ||
      (CONFIG.pauseOnHover && currentViewport?.matches(":hover")) ||
      (CONFIG.pauseOnFocus && currentViewport?.contains(document.activeElement))) return;

  if (
    sliderAnimation &&
    CONFIG.autoplay
  ) {

    sliderAnimation.play();

  }

}


// =====================================================
// CREAR ANIMACIÓN INFINITA
// =====================================================

function createAnimation(
  track,
  viewport,
  originalCount
) {

  const cards =
    Array.from(
      track.children
    );


  // ==================================================
  // VALIDAR CANTIDAD
  // ==================================================

  if (
    originalCount <= 0 ||
    cards.length <
      originalCount * 2
  ) {

    console.error(
      "[Aldeano Slider] No hay suficientes tarjetas para crear el loop infinito.",
      {
        originalCount,
        renderedCards:
          cards.length
      }
    );

    return;

  }


  // ==================================================
  // PRIMERA TARJETA ORIGINAL
  // Y PRIMERA TARJETA DUPLICADA
  // ==================================================

  const firstCard =
    cards[0];

  const firstDuplicate =
    cards[
      originalCount
    ];


  if (
    !firstCard ||
    !firstDuplicate
  ) {

    console.error(
      "[Aldeano Slider] No se pudo localizar la segunda copia del carrusel."
    );

    return;

  }


  // ==================================================
  // DISTANCIA EXACTA DEL LOOP
  //
  // No usamos scrollWidth / 2.
  //
  // Medimos exactamente dónde comienza
  // la segunda copia.
  // ==================================================

  const loopDistance =
    firstDuplicate.offsetLeft -
    firstCard.offsetLeft;


  if (
    !Number.isFinite(
      loopDistance
    ) ||
    loopDistance <= 0
  ) {

    console.error(
      "[Aldeano Slider] Distancia de loop inválida:",
      {
        loopDistance,
        firstOriginal:
          firstCard.offsetLeft,
        firstDuplicate:
          firstDuplicate.offsetLeft
      }
    );

    return;

  }


  // ==================================================
  // VELOCIDAD
  //
  // CONFIG.speed = píxeles por segundo
  // ==================================================

  const speed =
    Math.max(
      Number(
        CONFIG.speed
      ) || 24,
      1
    );


  // ==================================================
  // DURACIÓN
  // ==================================================

  const duration =
    (
      loopDistance /
      speed
    ) * 1000;


  // ==================================================
  // ANIMACIÓN
  // ==================================================

  loopDuration = duration;
  const cardDistance = cards[1].offsetLeft - firstCard.offsetLeft;
  stepDuration = (cardDistance / speed) * 1000;
  sliderAnimation =
    track.animate(
      [
        {
          transform:
            "translate3d(0, 0, 0)"
        },

        {
          transform:
            `translate3d(-${loopDistance}px, 0, 0)`
        }
      ],
      {
        duration,

        iterations:
          Infinity,

        easing:
          "linear"
      }
    );


  // ==================================================
  // AUTOPLAY
  // ==================================================

  if (
    !CONFIG.autoplay || document.hidden ||
    (CONFIG.pauseOnHover && viewport.matches(":hover")) ||
    (CONFIG.pauseOnFocus && viewport.contains(document.activeElement))
  ) {

    sliderAnimation.pause();

  }


  // ==================================================
  // INTERACCIONES
  // ==================================================

  configureInteractions(
    viewport
  );
  setNavigationEnabled(true);


  // ==================================================
  // DEBUG
  // ==================================================

  if (
    CONFIG.debug
  ) {

    console.log(
      "[Aldeano Slider] Loop infinito iniciado",
      {
        originalCount,
        renderedCards:
          cards.length,
        loopDistance,
        speed,
        duration
      }
    );

  }

}


// =====================================================
// INTERACCIONES
// =====================================================

function configureInteractions(
  viewport
) {

  if (
    interactionsConfigured
  ) {

    return;

  }


  interactionsConfigured =
    true;
  document.getElementById("sliderPrev")?.addEventListener("click", () => moveSlider(-1));
  document.getElementById("sliderNext")?.addEventListener("click", () => moveSlider(1));


  // ==================================================
  // PAUSA CON MOUSE
  // ==================================================

  if (
    CONFIG.pauseOnHover
  ) {

    viewport.addEventListener(
      "mouseenter",
      pauseSlider
    );


    viewport.addEventListener(
      "mouseleave",
      resumeSlider
    );

  }


  // ==================================================
  // PAUSA CON FOCUS
  // ==================================================

  if (
    CONFIG.pauseOnFocus
  ) {

    viewport.addEventListener(
      "focusin",
      pauseSlider
    );


    viewport.addEventListener(
      "focusout",
      () => queueMicrotask(resumeSlider)
    );

  }


  // ==================================================
  // TOUCH
  // ==================================================

  viewport.addEventListener(
    "touchstart",
    pauseSlider,
    {
      passive: true
    }
  );


  viewport.addEventListener(
    "touchend",
    resumeSlider,
    {
      passive: true
    }
  );


  viewport.addEventListener(
    "touchcancel",
    resumeSlider,
    {
      passive: true
    }
  );


  // ==================================================
  // PESTAÑA OCULTA
  // ==================================================

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        pauseSlider();

      } else {

        resumeSlider();

      }

    }
  );


  // ==================================================
  // REDIMENSIONAR VENTANA
  //
  // Recalculamos las posiciones si cambia
  // el tamaño de pantalla.
  // ==================================================

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            if (
              currentTrack &&
              currentViewport &&
              currentOriginalCount > 0
            ) {

              startSlider(
                currentTrack,
                currentViewport,
                currentOriginalCount
              );

            }

          },
          200
        );

    }
  );

}