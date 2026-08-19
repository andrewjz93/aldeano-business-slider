import { CONFIG } from "./config.js";


// ======================================================
// CARGAR HISTORIAS
// ======================================================

export async function loadCompanies() {

  const response =
    await fetch(
      CONFIG.dataSource,
      {
        cache: "no-store"
      }
    );


  if (!response.ok) {

    throw new Error(
      `No se pudieron cargar las historias. Código: ${response.status}`
    );

  }


  const data =
    await response.json();


  let stories = [];


  if (Array.isArray(data)) {

    stories = data;

  } else if (
    Array.isArray(data.stories)
  ) {

    stories =
      data.stories;

  } else if (
    Array.isArray(data.results)
  ) {

    stories =
      data.results;

  } else {

    throw new Error(
      "La API no devolvió una lista válida de historias."
    );

  }


  const historiasNormalizadas =
  stories
    .map(
      normalizeStory
    )
    .filter(
      isValidStory
    );


const historiasMezcladas =
  mezclarPorComunidad(
    historiasNormalizadas
  );


return historiasMezcladas
  .slice(
    0,
    CONFIG.maximumCompanies
  );

}


// ======================================================
// NORMALIZAR HISTORIA
// ======================================================

function normalizeStory(story) {

  const tipo =
    String(
      story.tipo ||
      story.origen ||
      "post"
    )
      .trim()
      .toLowerCase();


  const titulo =
    limpiarTexto(
      story.titulo
    );


  const descripcion =
    limpiarTexto(
      story.descripcion
    );


  const comunidad =
    limpiarTexto(
      story.comunidad
    ) ||
    "Comunidad";


  const empresa =
    limpiarTexto(
      story.empresa
    ) ||
    comunidad;


  // ==================================================
  // IMAGEN GRANDE
  // ==================================================

  const imagen =
    story.cover ||
    story.cover_publicacion ||
    story.actividad_imagen ||
    story.imagen ||
    "https://picsum.photos/500/500";


  // ==================================================
  // LOGO / CÍRCULO SUPERIOR
  // ==================================================

  const logoComunidad =
    story.logoComunidad ||
    story.logo_comunidad ||
    story.logoEmpresa ||
    story.logo_empresa ||
    story.logo ||
    "";


  const coverComunidad =
    story.coverComunidad ||
    story.cover_comunidad ||
    "";


  const logo =
    logoComunidad ||
    "";
   
  // ==================================================
  // FECHA
  // ==================================================

  const fecha =
    story.fecha ||
    story.fecha_publicacion ||
    "";


  // ==================================================
  // URL
  // ==================================================

  const url =
    story.url ||
    story.url_publicacion ||
    story.actividad_url ||
    "https://www.elaldeano.online";


  return {

    // =====================================
    // IDENTIDAD
    // =====================================

    id:
      story.id,


    // =====================================
    // COMPATIBILIDAD CON render.js
    // =====================================

    nombre:
      empresa,

    empresa,

    comunidad,


    // =====================================
    // CONTENIDO
    // =====================================

    titulo,

    descripcion,

    imagen,

    logo,

    logoComunidad,

    coverComunidad,


    // =====================================
    // CONTEXTO
    // =====================================

    categoria:
      comunidad,

    ciudad:
      story.ciudad || "",

    provincia:
      story.provincia || "",


    // =====================================
    // TIPO / ORIGEN
    // =====================================

    origen:
      tipo,

    tipo,


    // =====================================
    // ACTIVIDAD
    // =====================================

    actividad:
      descripcion ||
      titulo ||
      "Nueva historia",


    // =====================================
    // BADGE
    // =====================================

    badge:
      getStoryBadge(
        tipo
      ),

    badgeTipo:
      getStoryBadgeType(
        tipo
      ),


    // =====================================
    // FECHA
    // =====================================

    fechaPublicacion:
      fecha,

    fechaTexto:
      formatRelativeDate(
        fecha
      ),


    // =====================================
    // FLAGS
    // =====================================

    premium:
      Boolean(
        story.premium
      ),

    destacada:
      Boolean(
        story.destacada
      ),


    // =====================================
    // URL
    // =====================================

    url

  };

}


// ======================================================
// BADGE
// ======================================================

function getStoryBadge(tipo) {

  switch (tipo) {

    case "video":
    case "youtube":
      return "VIDEO";

    case "noticia":
    case "rss":
      return "NOTICIA";

    case "evento":
      return "EVENTO";

    case "promocion":
    case "promo":
      return "PROMO";

    case "post":
    case "wix_group":
    case "wixgroups":
      return "NUEVO POST";

    default:
      return "HISTORIA";

  }

}


// ======================================================
// TIPO DE BADGE
// ======================================================

function getStoryBadgeType(tipo) {

  switch (tipo) {

    case "video":
    case "youtube":
      return "video";

    case "noticia":
    case "rss":
      return "nueva";

    case "evento":
      return "nueva";

    case "promocion":
    case "promo":
      return "promo";

    case "post":
    case "wix_group":
    case "wixgroups":
      return "destacada";

    default:
      return "activa";

  }

}


// ======================================================
// FECHA RELATIVA
// ======================================================

function formatRelativeDate(value) {

  if (!value) {
    return "";
  }


  const fecha =
    new Date(value);


  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {

    return "";

  }


  const ahora =
    new Date();


  const diferenciaMs =
    ahora.getTime() -
    fecha.getTime();


  const minutos =
    Math.floor(
      diferenciaMs /
      60000
    );


  if (minutos < 1) {

    return "Ahora";

  }


  if (minutos < 60) {

    return `Hace ${minutos} min`;

  }


  const horas =
    Math.floor(
      minutos / 60
    );


  if (horas < 24) {

    return (
      horas === 1
        ? "Hace 1 hora"
        : `Hace ${horas} horas`
    );

  }


  const dias =
    Math.floor(
      horas / 24
    );


  if (dias < 7) {

    return (
      dias === 1
        ? "Hace 1 día"
        : `Hace ${dias} días`
    );

  }


  return fecha.toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


// ======================================================
// LIMPIAR TEXTO
// ======================================================

function limpiarTexto(value) {

  return String(
    value || ""
  )
    .replace(
      /https?:\/\/\S+/gi,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();

}


// ======================================================
// VALIDAR HISTORIA
// ======================================================

function isValidStory(story) {

  return Boolean(
    story &&
    story.id !== undefined &&
    (
      story.titulo ||
      story.descripcion
    ) &&
    story.imagen &&
    story.logo &&
    story.url
  );

}

// ======================================================
// MEZCLAR HISTORIAS ENTRE COMUNIDADES
// ======================================================

function mezclarPorComunidad(
  historias
) {

  const grupos =
    new Map();


  // Agrupar manteniendo el orden
  // original por fecha dentro de cada comunidad.

  for (const historia of historias) {

    const clave =
      historia.comunidad ||
      historia.empresa ||
      "Comunidad";


    if (
      !grupos.has(clave)
    ) {

      grupos.set(
        clave,
        []
      );

    }


    grupos
      .get(clave)
      .push(historia);

  }


  const comunidades =
    Array.from(
      grupos.values()
    );


  const resultado = [];


  let quedanHistorias =
    true;


  // Tomar una historia de cada
  // comunidad por turno.

  while (quedanHistorias) {

    quedanHistorias =
      false;


    for (
      const comunidad of comunidades
    ) {

      if (
        comunidad.length
      ) {

        resultado.push(
          comunidad.shift()
        );


        quedanHistorias =
          true;

      }

    }

  }


  return resultado;

}

function formatearHora(fecha) {

  if (!fecha) {
    return "";
  }

  const date =
    new Date(fecha);

  return date.toLocaleTimeString(
    "es-AR",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }
  );

}