// ======================================================
// RENDER DE HISTORIAS
// ======================================================

export function renderCompanies(
  track,
  companies
) {

  track.innerHTML =
    companies
      .map(createCompanyCard)
      .join("");

}


// ======================================================
// CREAR TARJETA
// ======================================================

export function createCompanyCard(
  company
) {

  const url =
    company.url ||
    "https://www.elaldeano.online";


  const titulo =
    company.titulo ||
    "Nueva publicación";


  const comunidad =
    company.comunidad ||
    company.nombre ||
    "Comunidad";


  const empresa =
    company.empresa ||
    company.nombre ||
    "";


  const autor =
    company.autor ||
    "";


  const imagen =
    company.imagen ||
    "";


  const logo =
    company.logoComunidad ||
    company.logo ||
    "";


  const fecha =
    company.fechaTexto ||
    "";


  const badge =
    obtenerBadge(
      company
    );


  return `

    <a
      class="story-card"
      href="${escapeAttribute(url)}"
      target="_top"
      rel="noopener noreferrer"
      aria-label="Ver publicación: ${escapeAttribute(titulo)}"
    >


      <!-- ==============================
           IMAGEN
      =============================== -->

      <div class="story-cover">


        ${
          imagen

            ? `
              <img
                class="story-image"
                src="${escapeAttribute(imagen)}"
                alt="${escapeAttribute(titulo)}"
                loading="lazy"
              >
            `

            : `
              <div class="story-image-placeholder">
              </div>
            `
        }


        <div class="story-overlay"></div>


        <!-- ============================
             BADGE
        ============================= -->

        <span class="story-badge">
          ${escapeHtml(badge)}
        </span>


        <!-- ============================
             PERFIL COMUNIDAD
        ============================= -->

        ${
          logo

            ? `
              <img
                class="story-logo"
                src="${escapeAttribute(logo)}"
                alt="Perfil de ${escapeAttribute(comunidad)}"
                loading="lazy"
              >
            `

            : `
              <div
                class="story-logo story-logo-fallback"
              >
                ${escapeHtml(
                  obtenerInicial(
                    comunidad
                  )
                )}
              </div>
            `
        }


      </div>


      <!-- ==============================
           CONTENIDO
      =============================== -->

      <div class="story-body">


        <!-- COMUNIDAD -->

        <div class="story-community">
          ${escapeHtml(comunidad)}
        </div>


        <!-- EMPRESA -->

        ${
          empresa &&
          empresa !== comunidad

            ? `
              <div class="story-company">
                por ${escapeHtml(empresa)}
              </div>
            `

            : ""
        }


        <!-- TÍTULO -->

        <h3 class="story-title">
          ${escapeHtml(titulo)}
        </h3>


        <!-- AUTOR -->

        ${
          autor

            ? `
              <div class="story-author">
                ${escapeHtml(autor)}
              </div>
            `

            : ""
        }


        <!-- FECHA -->

        ${
          fecha

            ? `
              <div class="story-date">
                <span aria-hidden="true">
                  🕒
                </span>

                ${escapeHtml(fecha)}
              </div>
            `

            : ""
        }


      </div>

    </a>

  `;

}


// ======================================================
// ERROR
// ======================================================

export function showError(
  track,
  message
) {

  track.innerHTML = `

    <div class="error-message">

      ${escapeHtml(message)}

    </div>

  `;

}


// ======================================================
// BADGE
// ======================================================

function obtenerBadge(
  company
) {

  const tipo =
    String(
      company.tipo ||
      company.origen ||
      ""
    )
      .trim()
      .toLowerCase();


  switch (tipo) {

    case "youtube":
    case "video":

      return "VIDEO";


    case "promo":
    case "promocion":

      return "PROMO";


    case "rss":
    case "noticia":

      return "NOVEDAD";


    case "evento":

      return "EVENTO";


    case "wix_group":
    case "wixgroups":
    case "post":

      return "NUEVO POST";


    default:

      return "HISTORIA";

  }

}


// ======================================================
// INICIAL DE COMUNIDAD
// ======================================================

function obtenerInicial(
  value
) {

  const texto =
    String(
      value || ""
    )
      .trim();


  if (!texto) {

    return "A";

  }


  return texto
    .charAt(0)
    .toUpperCase();

}


// ======================================================
// SEGURIDAD HTML
// ======================================================

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}