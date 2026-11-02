// Contenido de las guías SEO. Cada guía: problema concreto + lista práctica + herramienta + fuentes.
// Datos sensibles (tiempos de nevera, normativa) siempre con su fuente oficial enlazada.

export interface GuideSection {
  h: string;
  p?: string;
  items?: string[];
}

export interface Guide {
  slug: string;
  icon: string;
  title: string; // H1
  metaTitle: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  tool?: "food" | "water";
  cta: { href: string; label: string };
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "que-hacer-en-un-apagon",
    icon: "lightning",
    title: "Qué hacer en un apagón: antes, durante y después",
    metaTitle: "Qué hacer en un apagón: guía paso a paso",
    description:
      "Qué hacer si se va la luz en casa o en toda la zona: cómo protegerte, cuánto aguanta la comida de la nevera y del congelador, qué tener preparado y qué hacer cuando vuelve la electricidad.",
    intro:
      "Un apagón largo deja sin luz, sin datáfonos, a veces sin cobertura y, en muchos edificios, sin agua. La diferencia entre pasarlo mal y pasarlo tranquilo está en lo que hagas antes y en las primeras horas.",
    sections: [
      {
        h: "Antes: lo que conviene tener en casa",
        items: [
          "Radio a pilas o de dinamo: es la forma más fiable de recibir avisos si cae la red móvil.",
          "Linternas o frontales para cada persona, con pilas de repuesto. Mejor que velas.",
          "Agua embotellada: unos 3 litros por persona y día.",
          "Comida que no necesite cocinarse ni frío: latas, barritas, frutos secos.",
          "Dinero en efectivo en billetes pequeños.",
          "Powerbank cargado y los móviles al 100\u00a0% si hay aviso de tormenta.",
        ],
      },
      {
        h: "Durante: los primeros minutos",
        items: [
          "Comprueba si el corte es solo tuyo: mira el cuadro eléctrico y pregunta a los vecinos.",
          "Enciende la radio y sigue las indicaciones oficiales.",
          "Desenchufa electrodomésticos sensibles: al volver la luz puede haber picos. Deja una lámpara encendida para saber cuándo vuelve.",
          "No abras la nevera ni el congelador si no es imprescindible.",
          "Ahorra batería: modo ahorro, brillo al mínimo, llamadas solo si hace falta.",
          "Si aún sale agua del grifo, llena botellas y recipientes.",
          "Llama al 112 solo para emergencias reales para no saturar la línea.",
        ],
      },
      {
        h: "La comida de la nevera y del congelador",
        p: "Según la Agencia Española de Seguridad Alimentaria (AESAN), con la puerta cerrada la nevera mantiene el frío unas 4 horas: un corte más corto no obliga, en principio, a tirar nada. El congelador puede mantener la congelación al menos 24–48 horas si no se abre. Si la nevera ha estado más de 4 horas sin frío, desecha carne, pescado, huevos, lácteos y sobras.",
      },
      {
        h: "Seguridad: lo que nunca hay que hacer",
        items: [
          "No uses generadores, barbacoas ni hornillos de gas dentro de casa: el monóxido de carbono puede matar sin avisar.",
          "No toques cables caídos en la calle.",
          "Evita el coche: los semáforos pueden estar apagados.",
          "Mira por los vecinos mayores o que dependan de aparatos médicos.",
        ],
      },
      {
        h: "Cuando vuelve la luz",
        items: [
          "Vuelve a enchufar los aparatos poco a poco, no todos a la vez.",
          "Revisa la comida antes de consumirla. Ante la duda, tírala.",
          "Repón lo que hayas gastado de tu kit: pilas, agua y comida.",
        ],
      },
    ],
    cta: { href: "/app/apagon", label: "Abrir el modo apagón (funciona sin conexión)" },
    faq: [
      {
        q: "¿Cuánto aguanta la comida de la nevera sin luz?",
        a: "Unas 4 horas con la puerta cerrada, según la AESAN. El congelador, al menos 24–48 horas si no se abre.",
      },
      {
        q: "¿Puedo encender un hornillo de gas en casa durante un apagón?",
        a: "No es recomendable: generadores, barbacoas y hornillos de combustión dentro de casa pueden causar intoxicación por monóxido de carbono.",
      },
      {
        q: "¿Qué es lo primero que tengo que tener para un apagón?",
        a: "Una radio a pilas, linternas, agua embotellada, comida que no necesite cocinarse y algo de efectivo.",
      },
    ],
    sources: [
      { label: "AESAN vía Selectra: cortes de luz, nevera y congelador", url: "https://selectra.es/energia/noticias/corte-luz-2026-nevera-congelador-comida" },
      { label: "CDC: qué hacer para protegerse durante un apagón", url: "https://cdc.gov/natural-disasters/es/response/que-hacer-para-protegerse-durante-un-apagon.html" },
    ],
  },
  {
    slug: "kit-emergencia-coche",
    icon: "car-simple",
    title: "Kit de emergencia para el coche: lo obligatorio y lo recomendable",
    metaTitle: "Kit de emergencia para el coche (2026): qué llevar",
    description:
      "Qué llevar en el coche en 2026: la baliza V16 obligatoria, el chaleco y lo que recomienda la DGT para quedarte atrapado por nieve o en un atasco largo.",
    intro:
      "Un atasco de horas por nieve o un accidente en una carretera secundaria pueden dejarte varado sin servicios. El coche es tu refugio, pero solo si llevas lo básico.",
    sections: [
      {
        h: "Lo obligatorio en 2026",
        items: [
          "Baliza V16 conectada y homologada: desde el 1 de enero de 2026 es el único sistema válido para señalizar un vehículo inmovilizado y sustituye a los triángulos.",
          "Chaleco reflectante, mejor dentro del habitáculo para ponértelo antes de salir.",
          "Rueda de repuesto o kit antipinchazos con las herramientas para usarlo.",
          "Documentación del vehículo y del conductor.",
        ],
      },
      {
        h: "Lo recomendable (sobre todo en invierno)",
        items: [
          "Manta o manta térmica: la DGT la recomienda desde hace años.",
          "Agua (1,5–2 litros) y comida que aguante: barritas, frutos secos.",
          "Linterna con pilas y un cargador de móvil para el coche.",
          "Ropa de abrigo, guantes y calzado cómodo.",
          "Cadenas o calcetines de nieve si vas a zonas de montaña.",
          "Rascador de hielo y anticongelante.",
          "Pequeño botiquín.",
        ],
      },
      {
        h: "Si te quedas atrapado por la nieve",
        items: [
          "Quédate dentro del coche, que es tu mejor refugio.",
          "Si usas la calefacción con el motor en marcha, asegúrate de que el tubo de escape no está tapado por la nieve y ventila de vez en cuando.",
          "Abrígate con la manta para no depender solo del motor.",
          "Lleva el depósito con margen antes de salir si hay aviso de temporal.",
        ],
      },
    ],
    cta: { href: "/app/kit", label: "Crear la mochila del coche en la app" },
    faq: [
      {
        q: "¿Sigue valiendo el triángulo de emergencia en 2026?",
        a: "No. Desde el 1 de enero de 2026 la baliza V16 conectada y homologada es el único sistema válido para señalizar un vehículo inmovilizado en España.",
      },
      {
        q: "¿Qué debo llevar en el coche en invierno?",
        a: "Manta, agua, algo de comida, linterna, ropa de abrigo, cargador de móvil y, en zonas de nieve, cadenas o calcetines.",
      },
    ],
    sources: [
      { label: "Ministerio del Interior: la DGT recuerda la obligación de la baliza V16", url: "https://www.interior.gob.es/opencms/es/detalle/articulo/DGT-recuerda-la-obligacion-de-disponer-de-la-baliza-V-16-para-senalizar-averias-y-accidentes-en-carretera/" },
      { label: "Mapfre: qué debe tener el kit de emergencia del coche", url: "https://www.motor.mapfre.es/accesorios/noticias-accesorios/kit-emergencia-coche/" },
    ],
  },
  {
    slug: "kit-emergencia-bebes",
    icon: "baby",
    title: "Kit de emergencia con bebés: qué añadir para 72 horas",
    metaTitle: "Kit de emergencia con bebés: lista completa",
    description:
      "Qué añadir al kit de emergencia si tienes un bebé: alimentación (lactancia o fórmula), agua, pañales, higiene y documentos. Lista práctica y revisable cada mes.",
    intro:
      "Con un bebé, el kit de 72 horas necesita una parte propia. Los bebés crecen rápido, así que esta parte se revisa cada mes, no cada seis.",
    sections: [
      {
        h: "Alimentación",
        p: "Amamantar es la forma más segura de alimentar a un bebé en una emergencia: no necesita agua ni utensilios. Si usas fórmula, lo más seguro es la fórmula líquida lista para tomar en envases de un solo uso.",
        items: [
          "Fórmula lista para tomar para varios días (revisa la cantidad cada mes).",
          "Si usas fórmula en polvo: agua embotellada para prepararla, biberones y tetinas, y una taza medidora.",
          "Jabón y agua embotellada para limpiar biberones.",
          "No diluyas la fórmula para que dure más ni uses leche de vaca o vegetal en menores de un año.",
          "Para bebés que ya comen: potitos o purés en envase que no necesite frío.",
        ],
      },
      {
        h: "Higiene y cuidado",
        items: [
          "Pañales para al menos 3 días (cuenta los que usa ahora).",
          "Toallitas, crema para el culito y bolsas para residuos.",
          "Ropa de cambio y una manta.",
          "Termómetro y la medicación que use, con su dosis apuntada.",
          "Portabebés: libera las manos si hay que salir de casa.",
        ],
      },
      {
        h: "Papeles",
        items: [
          "Copia de la tarjeta sanitaria y del libro de vacunas.",
          "Teléfono del pediatra en el plan familiar.",
        ],
      },
    ],
    cta: { href: "/app/kit", label: "Ajustar el kit con niños en la app" },
    faq: [
      {
        q: "¿Qué fórmula es mejor tener en el kit de emergencia?",
        a: "La fórmula líquida lista para tomar en envases de un solo uso, porque no necesita agua ni preparación. La fórmula en polvo no es estéril y requiere agua segura.",
      },
      {
        q: "¿Cada cuánto revisar el kit del bebé?",
        a: "Cada mes: cambian la talla de pañal y la cantidad que come.",
      },
    ],
    sources: [
      { label: "CDC: lista de preparación para alimentar a bebés en emergencias (PDF)", url: "https://cdc.gov/infant-feeding-emergencies-toolkit/media/pdfs/emergency-preparedness-checklist-es-508.pdf" },
      { label: "IHAN: lactancia en emergencias (PDF)", url: "https://ihan.es/wp-content/uploads/2024/11/Lactancia-en-emergencias.pdf" },
    ],
  },
  {
    slug: "kit-emergencia-mascotas",
    icon: "paw-print",
    title: "Kit de emergencia para mascotas: perros y gatos",
    metaTitle: "Kit de emergencia para mascotas: qué preparar",
    description:
      "Qué preparar para tu perro o gato ante una emergencia o evacuación: comida, agua, transportín, medicación, documentos y un plan para que nadie se quede atrás.",
    intro: "Tu mascota también necesita su kit. Y un plan: muchos sitios de acogida en una emergencia no admiten animales, así que conviene saber de antemano a dónde iríais.",
    sections: [
      {
        h: "Lo básico",
        items: [
          "Comida para varios días (mejor una o dos semanas) en recipiente cerrado.",
          "Agua extra para el animal, además de la vuestra, y un cuenco.",
          "Correa, arnés y transportín.",
          "Medicación que tome y un pequeño botiquín.",
          "Bolsas y arena o empapadores.",
        ],
      },
      {
        h: "Documentos y datos",
        items: [
          "Cartilla de vacunación y número de microchip.",
          "Teléfono del veterinario.",
          "Una foto reciente contigo, por si os separáis.",
        ],
      },
      {
        h: "El plan",
        items: [
          "Decide con quién se quedaría si tú no puedes (familiar, vecino) y dile dónde está su kit.",
          "Si hay aviso de tormenta, mete a la mascota en casa a tiempo.",
          "Revisa el kit cuando revises el tuyo: comida y medicación caducan.",
        ],
      },
    ],
    cta: { href: "/app/kit", label: "Añadir tu mascota al cálculo de agua" },
    faq: [
      {
        q: "¿Cuánta comida guardar para mi mascota en caso de emergencia?",
        a: "Para varios días como mínimo; las guías de preparación recomiendan una o dos semanas.",
      },
      {
        q: "¿Qué documentos de mi mascota llevar?",
        a: "Cartilla de vacunas, número de microchip, teléfono del veterinario y una foto reciente.",
      },
    ],
    sources: [
      { label: "Ready.gov (FEMA): preparar a sus mascotas para emergencias (PDF)", url: "https://www.ready.gov/sites/default/files/2020-08/2014_PrinterFriendly_PetOwners_ES.pdf" },
      { label: "Purina: kit de emergencia para mascotas", url: "https://www.purina.com/es/articulos/perro/salud/cuidado-de-rutina/kit-de-emergencia-y-preparacion-ante-desastres-para-mascotas" },
    ],
  },
  {
    slug: "botiquin-basico-casa",
    icon: "first-aid-kit",
    title: "Botiquín básico en casa: qué debe tener y cómo revisarlo",
    metaTitle: "Botiquín básico en casa: lista completa",
    description:
      "Qué debe tener un botiquín de primeros auxilios en casa, dónde guardarlo, por qué separar los medicamentos y cada cuánto revisarlo.",
    intro:
      "Un botiquín sirve para atender heridas y accidentes leves mientras llega ayuda. Cruz Roja recomienda que no se convierta en un almacén de medicamentos: el material de curas por un lado, las medicinas por otro.",
    sections: [
      {
        h: "Material de protección",
        items: ["Guantes desechables (varios pares, sin látex).", "Mascarillas.", "Toallitas o gel desinfectante para las manos."],
      },
      {
        h: "Material de curas",
        items: [
          "Gasas estériles y vendas de varios tamaños.",
          "Esparadrapo y tiritas.",
          "Antiséptico para heridas.",
          "Suero fisiológico en monodosis.",
          "Tijeras de punta redondeada y pinzas.",
          "Pañuelo triangular (sirve como cabestrillo).",
          "Manta térmica.",
          "Termómetro.",
        ],
      },
      {
        h: "Medicamentos (aparte)",
        p: "Guárdalos en su caja con el prospecto. Lo básico suele ser un analgésico y antitérmico y la medicación personal de cada uno. Consulta a tu farmacéutico o médico qué tener según tu familia.",
      },
      {
        h: "Dónde guardarlo y cada cuánto revisarlo",
        items: [
          "Lugar fresco, seco, conocido por todos y fuera del alcance de los niños.",
          "Revísalo cada 6 meses: retira lo caducado y repón lo gastado.",
          "Ten otro en el coche.",
          "Junto al botiquín, una hoja con teléfonos de emergencia, alergias y medicación de cada persona.",
        ],
      },
    ],
    cta: { href: "/app/despensa", label: "Controlar la caducidad de las medicinas" },
    faq: [
      {
        q: "¿El botiquín debe tener medicamentos?",
        a: "Cruz Roja recomienda separarlos: el botiquín para el material de curas y los medicamentos aparte, en su caja y con el prospecto.",
      },
      {
        q: "¿Cada cuánto revisar el botiquín?",
        a: "Al menos cada 6 meses, para retirar lo caducado y reponer lo gastado.",
      },
    ],
    sources: [
      { label: "Consumer (Eroski): elementos esenciales del botiquín, según Cruz Roja y Osakidetza", url: "https://www.consumer.es/?p=13572" },
      { label: "Mayo Clinic: botiquines de primeros auxilios", url: "https://www.mayoclinic.org/es/first-aid/first-aid-kits/basics/art-20056673" },
    ],
  },
  {
    slug: "cuanta-comida-almacenar",
    icon: "bowl-food",
    title: "¿Cuánta comida almacenar para una emergencia?",
    metaTitle: "¿Cuánta comida almacenar para una emergencia? Calculadora",
    description:
      "Calcula cuánta comida necesita tu familia para 3 días o una semana de emergencia: calorías por persona, qué alimentos elegir y cómo rotarlos para que no caduquen.",
    intro:
      "Para una emergencia no hace falta una despensa de búnker. Hace falta comida que no necesite frío ni cocina y que cubra las calorías de cada persona unos días.",
    tool: "food",
    sections: [
      {
        h: "Cuántas calorías por persona",
        p: "Como referencia orientativa, unas 2.000 kcal al día por adulto y menos para los niños. Con 72 horas como mínimo, eso son unas 6.000 kcal por adulto. La calculadora de arriba lo hace por ti.",
      },
      {
        h: "Qué alimentos elegir",
        items: [
          "Que se coman sin cocinar: latas de atún, sardinas, legumbres cocidas, fruta en almíbar.",
          "Densos en calorías: frutos secos, crema de cacahuete, barritas, chocolate.",
          "De larga duración: raciones de emergencia y comida liofilizada (años).",
          "Que os gusten: es comida para un momento de estrés, mejor que sea conocida.",
          "No olvides el abrelatas si no son de apertura fácil.",
        ],
      },
      {
        h: "Cómo rotarla para que no caduque",
        items: [
          "Guarda la fecha de caducidad de cada lote.",
          "Consume lo que caduca antes y repón al hacer la compra.",
          "Revisa todo cada 6 meses.",
        ],
      },
    ],
    cta: { href: "/app/despensa", label: "Llevar la despensa con avisos de caducidad" },
    faq: [
      {
        q: "¿Cuánta comida necesita una persona para 3 días?",
        a: "Como referencia, unas 6.000 kcal por adulto (unas 2.000 al día), en alimentos que no necesiten frío ni cocinarse.",
      },
      {
        q: "¿Qué comida dura más para una emergencia?",
        a: "Las raciones de emergencia y la comida liofilizada pueden durar varios años, y las conservas también suelen aguantar años. Mira siempre la fecha de cada producto.",
      },
    ],
    sources: [
      { label: "Selectra: kit de emergencia 2026 para 72 horas", url: "https://selectra.es/alarmas/noticias/kit-emergencia-2026-casa-72-horas" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

// Guías antiguas con su propia página (se listan también en el índice)
export const LEGACY_GUIDES = [
  { slug: "kit-emergencia-72-horas", icon: "backpack", title: "Kit de emergencia 72 horas: la lista completa", description: "Lo imprescindible para que tu hogar aguante 3 días." },
  { slug: "cuanta-agua-almacenar", icon: "drop", title: "¿Cuánta agua almacenar para una emergencia?", description: "Calculadora de litros y botellas para tu familia." },
];
