// Páginas por comunidad autónoma: riesgos más habituales, servicio 112 y enlaces oficiales.
// Enlaces a los centros 112 tomados del directorio oficial del 112 de Castilla-La Mancha
// (112.castillalamancha.es → Protección Civil → Enlaces de interés), consultado en noviembre de 2026.

export type RiskId = "inundacion" | "incendio" | "calor" | "frio" | "terremoto" | "volcan" | "temporal" | "quimico" | "sequia" | "apagon";

export const RISKS: Record<RiskId, { label: string; icon: string; guide?: string; tip: string }> = {
  inundacion: { label: "DANA, lluvias torrenciales e inundaciones", icon: "waves", guide: "que-hacer-inundacion-dana", tip: "No bajes a garajes ni sótanos y no cruces calles o vados con agua: sube a un piso alto." },
  incendio: { label: "Incendios forestales", icon: "fire", guide: "que-hacer-incendio-forestal", tip: "Si vives cerca del monte, ten la mochila a mano en verano y obedece la orden de confinarte o de evacuar." },
  calor: { label: "Olas de calor", icon: "thermometer-hot", guide: "ola-de-calor-golpe-de-calor", tip: "Bebe agua aunque no tengas sed, cierra persianas de día y vigila a mayores y bebés." },
  frio: { label: "Nevadas, hielo y olas de frío", icon: "snowflake", guide: "nevadas-ola-de-frio", tip: "Ten comida, medicinas y mantas para varios días y no uses braseros ni barbacoas dentro de casa." },
  terremoto: { label: "Terremotos", icon: "house-line", tip: "Durante el temblor: agáchate, cúbrete bajo una mesa resistente y agárrate. No uses el ascensor." },
  volcan: { label: "Erupciones volcánicas", icon: "mountains", tip: "Sigue al PEVOLCA y al 112 Canarias, ten la mochila preparada y mascarillas FFP2 por la ceniza." },
  temporal: { label: "Temporales de viento y mar", icon: "wind", tip: "Aléjate de paseos marítimos, espigones y árboles, y asegura macetas y toldos." },
  quimico: { label: "Riesgo químico e industrial", icon: "warning", tip: "Si te ordenan confinarte: cierra ventanas, apaga la ventilación y sigue la radio." },
  sequia: { label: "Sequía y cortes de agua", icon: "drop-slash", tip: "Ten una reserva de agua embotellada: 3 litros por persona y día." },
  apagon: { label: "Apagones", icon: "lightning", guide: "que-hacer-en-un-apagon", tip: "Linterna, radio a pilas, efectivo y powerbank cargado. Sin luz no hay datáfonos." },
};

export interface Region {
  slug: string;
  name: string;
  /** «en Andalucía», «en la Comunitat Valenciana»… */
  en: string;
  service: string;
  url: string;
  risks: RiskId[];
  note: string;
}

export const REGIONS: Region[] = [
  { slug: "andalucia", name: "Andalucía", en: "en Andalucía", service: "Emergencias 112 Andalucía", url: "https://juntadeandalucia.es/organismos/ema/areas/proteccion-civil.html",
    risks: ["calor", "incendio", "inundacion", "terremoto", "sequia", "apagon"],
    note: "Es una de las zonas con más actividad sísmica de la península (sobre todo Granada, Almería y Málaga), con veranos muy calurosos y episodios de lluvias torrenciales en la costa mediterránea." },
  { slug: "aragon", name: "Aragón", en: "en Aragón", service: "112 Aragón", url: "https://112aragon.aragon.es/",
    risks: ["inundacion", "frio", "calor", "incendio", "apagon"],
    note: "Las crecidas del Ebro y sus afluentes, las tormentas con granizo y las nevadas en el Pirineo y en Teruel son los avisos más frecuentes." },
  { slug: "asturias", name: "Principado de Asturias", en: "en Asturias", service: "112 Asturias (SEPA)", url: "http://www.112asturias.es/",
    risks: ["temporal", "inundacion", "frio", "incendio", "apagon"],
    note: "Los temporales en la costa, las crecidas de los ríos y la nieve en los puertos de montaña marcan el invierno. Con viento sur también hay riesgo de incendios fuera del verano." },
  { slug: "baleares", name: "Illes Balears", en: "en las Illes Balears", service: "SEIB 112 Illes Balears", url: "https://www.caib.es/sites/112/es/portada-8673/",
    risks: ["inundacion", "temporal", "calor", "incendio", "apagon"],
    note: "Las lluvias torrenciales de otoño y los temporales marítimos son los riesgos más habituales. Al ser islas, conviene tener algo más de reserva de agua y comida." },
  { slug: "canarias", name: "Canarias", en: "en Canarias", service: "112 Canarias (CECOES)", url: "https://www.112canarias.com/112/",
    risks: ["volcan", "incendio", "calor", "temporal", "apagon"],
    note: "La erupción de La Palma en 2021 recordó el riesgo volcánico. También hay incendios forestales, episodios de calor con calima y temporales en la costa." },
  { slug: "cantabria", name: "Cantabria", en: "en Cantabria", service: "112 Cantabria (SEMCA)", url: "http://112.cantabria.es/",
    risks: ["inundacion", "temporal", "frio", "incendio", "apagon"],
    note: "Las inundaciones por crecidas, las galernas y los temporales en la costa y la nieve en las zonas altas son los avisos más habituales." },
  { slug: "castilla-la-mancha", name: "Castilla-La Mancha", en: "en Castilla-La Mancha", service: "112 Castilla-La Mancha", url: "https://112.castillalamancha.es/",
    risks: ["calor", "incendio", "inundacion", "frio", "apagon"],
    note: "Veranos de calor extremo, incendios forestales, tormentas que provocan riadas repentinas y grandes nevadas como Filomena en 2021." },
  { slug: "castilla-y-leon", name: "Castilla y León", en: "en Castilla y León", service: "112 Castilla y León", url: "https://112.jcyl.es/",
    risks: ["frio", "incendio", "inundacion", "calor", "apagon"],
    note: "Nevadas, heladas y olas de frío en invierno y grandes incendios forestales en verano, como el de la Sierra de la Culebra (Zamora) en 2022." },
  { slug: "cataluna", name: "Cataluña", en: "en Cataluña", service: "Protecció Civil de Catalunya · 112", url: "http://web.gencat.cat/es/temes/seguretat/",
    risks: ["incendio", "inundacion", "sequia", "frio", "quimico", "apagon"],
    note: "Incendios forestales, lluvias torrenciales en el litoral, sequías prolongadas, nieve en el Pirineo y, en zonas como el Camp de Tarragona, riesgo químico." },
  { slug: "comunitat-valenciana", name: "Comunitat Valenciana", en: "en la Comunitat Valenciana", service: "112 Comunitat Valenciana", url: "http://www.112cv.gva.es/",
    risks: ["inundacion", "incendio", "calor", "terremoto", "apagon"],
    note: "La DANA de octubre de 2024 dejó claro el peligro de las lluvias torrenciales y las riadas. También hay incendios forestales, olas de calor y actividad sísmica en el sur de Alicante." },
  { slug: "extremadura", name: "Extremadura", en: "en Extremadura", service: "112 Extremadura", url: "http://instituciones.juntaex.es/112/",
    risks: ["calor", "incendio", "inundacion", "apagon"],
    note: "Olas de calor muy intensas e incendios forestales en verano, y crecidas de ríos en invierno." },
  { slug: "galicia", name: "Galicia", en: "en Galicia", service: "112 Galicia", url: "https://www.axega112.gal/es/actualidad",
    risks: ["incendio", "temporal", "inundacion", "apagon"],
    note: "Los incendios forestales en verano y los temporales atlánticos en invierno son los riesgos más frecuentes, junto con las crecidas de los ríos." },
  { slug: "madrid", name: "Comunidad de Madrid", en: "en la Comunidad de Madrid", service: "Madrid 112", url: "https://www.comunidad.madrid/servicios/112",
    risks: ["calor", "frio", "incendio", "inundacion", "apagon"],
    note: "Olas de calor en verano, nevadas como Filomena (2021), incendios en la sierra y tormentas fuertes que inundan calles y túneles." },
  { slug: "murcia", name: "Región de Murcia", en: "en la Región de Murcia", service: "112 Región de Murcia", url: "https://www.112rmurcia.es/",
    risks: ["inundacion", "calor", "terremoto", "sequia", "apagon"],
    note: "La gota fría trae lluvias torrenciales y riadas. Es zona sísmica (terremoto de Lorca, 2011) y sufre veranos de calor extremo." },
  { slug: "navarra", name: "Comunidad Foral de Navarra", en: "en Navarra", service: "112 SOS Navarra", url: "https://www.navarra.es/home_es/Temas/Seguridad/112-SOS+NAVARRA.htm",
    risks: ["inundacion", "frio", "incendio", "calor", "apagon"],
    note: "Crecidas del Ebro, el Arga y el Aragón, nieve en el Pirineo y tormentas de verano." },
  { slug: "pais-vasco", name: "País Vasco", en: "en el País Vasco", service: "SOS Deiak 112", url: "http://www.euskadi.eus/gobierno-vasco/emergencias-112/",
    risks: ["inundacion", "temporal", "frio", "quimico", "apagon"],
    note: "Inundaciones por lluvias intensas, temporales en la costa, nieve en zonas altas y riesgo industrial en algunas áreas." },
  { slug: "la-rioja", name: "La Rioja", en: "en La Rioja", service: "SOS Rioja 112", url: "https://www.larioja.org/emergencias-112/es/noticias-sos-rioja",
    risks: ["inundacion", "frio", "incendio", "calor", "apagon"],
    note: "Crecidas del Ebro y sus afluentes, tormentas con granizo y nevadas en la sierra." },
  { slug: "ceuta", name: "Ceuta", en: "en Ceuta", service: "112 Ceuta", url: "http://www.ceuta.es/112/",
    risks: ["temporal", "calor", "terremoto", "apagon"],
    note: "Los temporales de levante y el calor son los avisos más habituales; también hay actividad sísmica moderada en la zona del Estrecho." },
  { slug: "melilla", name: "Melilla", en: "en Melilla", service: "112 Melilla", url: "https://www.melilla.es/",
    risks: ["temporal", "calor", "terremoto", "apagon"],
    note: "Calor, temporales en el mar de Alborán y terremotos moderados, que son relativamente frecuentes en esta zona." },
];

export const REGION_BY_SLUG: Record<string, Region> = Object.fromEntries(REGIONS.map((r) => [r.slug, r]));
