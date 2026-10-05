import { CONFIG } from "./config.js";
import { loadCompanies } from "./api.js";
import { renderCompanies, showError } from "./render.js";
import { startSlider, stopSlider, isSliderInteracting } from "./animation.js";

document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider() {
  const track = document.getElementById("sliderTrack");
  const viewport = document.getElementById("sliderViewport");
  if (!track || !viewport) return;

  const interval = Math.max(Number(CONFIG.refreshIntervalMs) || 60000, 10000);
  let timer;
  let loading = false;
  let signature = null;

  async function refresh() {
    clearTimeout(timer);
    if (loading || document.hidden) return;
    loading = true;
    try {
      const companies = await loadCompanies();
      const nextSignature = JSON.stringify(companies);
      // No reiniciar el movimiento cuando los datos no cambiaron ni
      // reemplazar una tarjeta mientras el usuario la está usando.
      const interacting = isSliderInteracting();
      if (nextSignature !== signature && (signature === null || !interacting)) {
        stopSlider();
        if (!companies.length) {
          showError(track, "No hay publicaciones disponibles.");
        } else {
          const items = CONFIG.shuffleItems ? shuffleArray(companies) : companies;
          renderCompanies(track, items.length > 1 ? [...items, ...items] : items);
          if (items.length > 1) {
            startSlider(track, viewport, items.length);
          }
        }
        signature = nextSignature;
      }
    } catch (error) {
      console.error("[Aldeano Slider] No se pudo actualizar:", error);
      // Una interrupción de red no debe borrar las historias ya cargadas.
      if (signature === null) {
        showError(track, "No fue posible cargar las publicaciones. Reintentando…");
      }
    } finally {
      loading = false;
      if (!document.hidden) timer = setTimeout(refresh, interval);
    }
  }

  document.addEventListener("visibilitychange", () => {
    clearTimeout(timer);
    if (!document.hidden) void refresh();
  });
  window.addEventListener("online", () => void refresh());
  void refresh();
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}
