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
  {
    slug: "que-hacer-inundacion-dana",
    icon: "waves",
    title: "Qué hacer en una DANA o inundación: antes, durante y después",
    metaTitle: "Qué hacer en una DANA o inundación: guía práctica",
    description:
      "Cómo prepararte para una DANA o lluvias torrenciales, qué hacer si el agua entra en casa o te sorprende en el coche, cuándo evacuar y qué hacer al volver.",
    intro:
      "Las lluvias torrenciales pueden convertir en minutos una calle, un garaje o un barranco en una trampa. Casi todas las víctimas de una inundación están en coches, sótanos o plantas bajas. Saber qué hacer, y qué no hacer, salva vidas.",
    sections: [
      {
        h: "Antes: cuando hay aviso naranja o rojo",
        items: [
          "Sigue los avisos de la AEMET y de Protección Civil de tu comunidad. Si recibes un ES-Alert en el móvil, haz caso a lo que diga.",
          "Prepara la mochila de emergencia: documentación, medicinas, linterna, radio a pilas, powerbank, agua y algo de comida.",
          "Sube a pisos altos los objetos de valor, los papeles importantes y los productos químicos.",
          "Si tienes el coche en un garaje subterráneo o en una zona baja, muévelo antes de que empiece a llover fuerte, nunca durante.",
          "Despeja sumideros, canalones y bajantes.",
          "Acordad en familia un punto de encuentro en un lugar alto y un contacto fuera de la zona.",
          "Mira si en tu zona hay barrancos, ramblas o cauces secos: con lluvias fuertes pueden llenarse en minutos.",
        ],
      },
      {
        h: "Durante: lo que salva vidas",
        items: [
          "No bajes a garajes, sótanos ni plantas bajas a rescatar el coche ni nada.",
          "Sube a pisos altos. Si vives en un bajo, pide refugio a un vecino de arriba antes de que el agua suba.",
          "No cruces nunca calles, vados ni puentes con agua corriendo, ni a pie ni en coche. 30 cm de agua en movimiento pueden arrastrar un coche.",
          "Si el agua entra en casa, corta la luz y el gas si puedes hacerlo sin tocar el agua.",
          "Si te sorprende en el coche y el agua sube, sal y busca un punto alto. El coche se puede reemplazar.",
          "Llama al 112 si estás en peligro. No uses la línea para preguntar por el tiempo.",
        ],
      },
      {
        h: "Si te ordenan evacuar",
        items: [
          "Hazlo enseguida y por las rutas que indiquen las autoridades.",
          "Coge solo la mochila de emergencia. Cierra la casa y corta luz, gas y agua.",
          "Lleva a tus mascotas contigo si puedes. Si no puedes, nunca las dejes atadas ni encerradas.",
          "Avisa a tu contacto de fuera de la zona de dónde vas.",
        ],
      },
      {
        h: "Después: al volver a casa",
        items: [
          "No vuelvas hasta que lo autoricen. Puede haber daños en la estructura.",
          "No conectes la luz hasta que un técnico revise la instalación si el agua llegó a los enchufes.",
          "No bebas agua del grifo hasta que confirmen que es potable. Usa la embotellada de tu kit.",
          "Tira los alimentos que hayan tocado el agua de la inundación, aunque estén envasados (salvo latas en perfecto estado y bien lavadas).",
          "Usa guantes y botas al limpiar: el barro puede llevar aguas residuales.",
          "Haz fotos de los daños antes de limpiar, para el seguro.",
        ],
      },
    ],
    cta: { href: "/app/plan", label: "Crear vuestro plan familiar con punto de encuentro" },
    faq: [
      {
        q: "¿Qué es una DANA?",
        a: "Es una Depresión Aislada en Niveles Altos: una bolsa de aire frío en altura que, sobre todo en otoño y en el Mediterráneo, puede provocar lluvias muy intensas en poco tiempo.",
      },
      {
        q: "¿Es seguro quedarse en el coche durante una inundación?",
        a: "No. El coche flota y puede ser arrastrado con poca agua. Si el agua sube alrededor, sal y busca un lugar alto.",
      },
      {
        q: "¿Qué debo llevar si tengo que evacuar?",
        a: "Documentación, medicinas, móvil y powerbank, linterna, radio a pilas, agua, algo de comida, dinero en efectivo y ropa de abrigo. Mejor tenerlo preparado en una mochila.",
      },
    ],
    sources: [
      { label: "Protección Civil (Xunta de Galicia): medidas de autoprotección ante inundaciones", url: "https://ficheiros-web.xunta.gal/emerxencias/recomendacions/recomendacions-poboacion-inundacions.pdf" },
      { label: "Dirección General de Protección Civil y Emergencias", url: "https://www.proteccioncivil.es" },
      { label: "AEMET: avisos meteorológicos", url: "https://www.aemet.es" },
    ],
  },
  {
    slug: "que-hacer-incendio-forestal",
    icon: "fire",
    title: "Qué hacer si un incendio forestal se acerca a tu casa",
    metaTitle: "Incendio forestal cerca de casa: confinarse o evacuar",
    description:
      "Cómo preparar tu casa si vives cerca del monte, qué hacer si te ordenan confinarte o evacuar por un incendio forestal y qué llevar en la mochila.",
    intro:
      "Si vives en una urbanización o un pueblo rodeado de monte, un incendio puede obligarte a confinarte en casa o a salir en poco tiempo. Las autoridades deciden una cosa u otra según cómo avanza el fuego: lo más importante es estar preparado y hacer caso a sus indicaciones.",
    sections: [
      {
        h: "Antes del verano: prepara tu casa",
        items: [
          "Limpia de matorral, hojas y ramas secas el entorno de la vivienda, los tejados y los canalones.",
          "Guarda la leña y los materiales que ardan lejos de la casa (a más de 10 metros).",
          "Evita setos muy inflamables, como cipreses, pegados a la casa.",
          "Ten una manguera que llegue a todo el perímetro.",
          "Pregunta en tu ayuntamiento si tu urbanización tiene plan de autoprotección y cuál es el punto de encuentro.",
          "Prepara la mochila de emergencia y déjala a mano durante el verano.",
        ],
      },
      {
        h: "Si ves fuego o humo",
        items: [
          "Llama al 112 y di dónde estás y qué ves.",
          "No te acerques a mirar ni intentes apagar un fuego que no sea muy pequeño.",
          "Aléjate en sentido contrario al viento y nunca por barrancos ni zonas altas del monte.",
        ],
      },
      {
        h: "Si te ordenan confinarte en casa",
        items: [
          "Quédate dentro. Es más seguro que salir a la carretera con el fuego cerca.",
          "Cierra puertas, ventanas y persianas, y tapa las rendijas con toallas mojadas.",
          "Llena bañeras y cubos de agua y moja el perímetro y el tejado si puedes hacerlo sin riesgo.",
          "Deja encendidas las luces exteriores para que te localicen.",
          "Viste ropa de algodón que cubra todo el cuerpo y calzado cerrado.",
          "Ten el coche aparcado mirando hacia la salida, con las ventanillas cerradas y las llaves a mano.",
          "Sigue la radio y los mensajes oficiales.",
        ],
      },
      {
        h: "Si te ordenan evacuar",
        items: [
          "Hazlo sin dudar y solo por las rutas que indiquen las autoridades. Nunca atajes por tu cuenta.",
          "Coge la mochila: documentación, medicinas, dinero en efectivo, móvil y cargador.",
          "Corta la luz y el gas, y cierra puertas y ventanas.",
          "Deja abierta la puerta de la parcela o del jardín para que entren los equipos de emergencia.",
          "Lleva a tus animales. Si no puedes, no los dejes atados ni encerrados.",
          "No vuelvas hasta que las autoridades lo permitan.",
        ],
      },
      {
        h: "El humo también afecta aunque estés lejos",
        p: "Con humo en el ambiente, quédate en interiores con ventanas cerradas y protege especialmente a mayores, niños, embarazadas y personas con problemas respiratorios. Una mascarilla FFP2 ayuda si tienes que salir.",
      },
    ],
    cta: { href: "/app/kit", label: "Preparar mi mochila de emergencia" },
    faq: [
      {
        q: "¿Es mejor quedarse en casa o huir de un incendio forestal?",
        a: "Depende de cómo avance el fuego, y eso lo deciden las autoridades. Salir por tu cuenta con el fuego cerca puede ser más peligroso que quedarte en una casa bien preparada. Haz caso a la orden que den: confinamiento o evacuación.",
      },
      {
        q: "¿Qué hago con mi coche si me confinan?",
        a: "Déjalo aparcado mirando hacia la salida, con ventanillas cerradas y las llaves a mano, por si después ordenan evacuar.",
      },
      {
        q: "¿Sirve una mascarilla con el humo?",
        a: "Una FFP2 bien ajustada filtra buena parte de las partículas del humo. Aun así, lo mejor es quedarse en interiores con las ventanas cerradas.",
      },
    ],
    sources: [
      { label: "Protección Civil Málaga: medidas ante incendios forestales", url: "https://proteccioncivil.malaga.eu/export/sites/proteccioncivil/.galleries/Medidas-Autproteccion/TRIPTICO-INCENDIOS-FORESTALES.pdf" },
      { label: "Dirección General de Protección Civil y Emergencias", url: "https://www.proteccioncivil.es" },
    ],
  },
  {
    slug: "ola-de-calor-golpe-de-calor",
    icon: "thermometer-hot",
    title: "Ola de calor: cómo proteger a tu familia y reconocer un golpe de calor",
    metaTitle: "Ola de calor: consejos y síntomas del golpe de calor",
    description:
      "Qué hacer en una ola de calor para mantener la casa fresca, cuánta agua beber, quién tiene más riesgo y cómo reconocer y actuar ante un golpe de calor.",
    intro:
      "El calor extremo es uno de los riesgos que más afectan a la salud en España, sobre todo a mayores, bebés y personas con enfermedades crónicas. Y si coincide con un apagón, la casa se calienta todavía más. Unas pocas medidas marcan la diferencia.",
    sections: [
      {
        h: "En casa: mantenerla fresca",
        items: [
          "Cierra persianas y ventanas en las horas de sol y ventila de noche y a primera hora.",
          "Busca la habitación más fresca de la casa y pasad allí las horas de más calor.",
          "Ten agua fresca siempre a mano y algún ventilador a pilas o USB por si se va la luz.",
          "Evita cocinar con horno en las horas centrales.",
        ],
      },
      {
        h: "Cuidarte: lo que recomienda Sanidad",
        items: [
          "Bebe agua con frecuencia aunque no tengas sed.",
          "Evita el alcohol, las bebidas con mucha cafeína y las muy azucaradas.",
          "Come ligero: fruta, verdura, ensaladas.",
          "No hagas ejercicio ni esfuerzos al aire libre en las horas centrales del día.",
          "Ropa ligera y de colores claros; gorra y gafas de sol si sales.",
          "Nunca dejes a nadie, ni a niños ni a mascotas, dentro de un coche cerrado.",
          "Llama o visita a los mayores que vivan solos.",
        ],
      },
      {
        h: "Golpe de calor: cómo reconocerlo",
        p: "Es una urgencia. Señales de alarma: piel muy caliente y enrojecida, temperatura de 40 °C o más, pulso y respiración rápidos, confusión, mareo, alucinaciones o convulsiones. Si las ves, llama al 112 y, mientras llega la ayuda, lleva a la persona a un sitio fresco, quítale ropa y enfríala con paños mojados. Si está consciente, dale agua a sorbos.",
      },
      {
        h: "Quién tiene más riesgo",
        items: [
          "Mayores de 65 años, sobre todo si viven solos.",
          "Bebés y niños pequeños.",
          "Embarazadas.",
          "Personas con enfermedades crónicas o que toman ciertos medicamentos: pregunta a tu médico o farmacéutico.",
          "Quien trabaja o hace deporte al aire libre.",
        ],
      },
    ],
    tool: "water",
    cta: { href: "/guias/cuanta-agua-almacenar", label: "Calcular cuánta agua necesita tu familia" },
    faq: [
      {
        q: "¿Cuánta agua hay que beber en una ola de calor?",
        a: "No hay una cifra única: lo importante es beber a menudo aunque no tengas sed. Las personas mayores pueden no notar la sed, así que conviene ofrecerles agua con frecuencia.",
      },
      {
        q: "¿Qué diferencia hay entre agotamiento por calor y golpe de calor?",
        a: "El agotamiento da cansancio, sudor abundante, mareo y dolor de cabeza; mejora con descanso, sombra y agua. El golpe de calor es más grave: la temperatura sube a 40 °C o más y aparece confusión. Es una urgencia: llama al 112.",
      },
      {
        q: "¿Qué hago si se va la luz durante una ola de calor?",
        a: "Mantén la casa cerrada en las horas de sol, quedaos en la habitación más fresca, usa ventiladores a pilas y paños mojados, y bebe agua de tu reserva.",
      },
    ],
    sources: [
      { label: "Ministerio de Sanidad: recomendaciones frente a las temperaturas extremas", url: "https://www.sanidad.gob.es/ca/gabinete/notasPrensa.do?id=5430" },
      { label: "AEMET: avisos por temperaturas máximas", url: "https://www.aemet.es" },
    ],
  },
  {
    slug: "nevadas-ola-de-frio",
    icon: "snowflake",
    title: "Nevadas y ola de frío: cómo preparar tu casa y tu coche",
    metaTitle: "Nevadas y ola de frío: qué tener en casa y en el coche",
    description:
      "Qué tener en casa si una nevada te deja aislado varios días, cómo calentarte sin riesgo de intoxicación y qué llevar en el coche si te quedas atrapado.",
    intro:
      "Una gran nevada puede dejar calles y carreteras cortadas varios días y, a veces, sin luz. Tener reserva en casa y saber qué hacer en el coche evita la mayoría de los problemas.",
    sections: [
      {
        h: "En casa: para aguantar varios días aislados",
        items: [
          "Reserva de comida y agua para al menos 3 días.",
          "Medicamentos habituales suficientes, sobre todo si hay enfermos crónicos o mayores.",
          "Mantas, ropa de abrigo y calzado adecuado.",
          "Linternas, radio a pilas y pilas de repuesto.",
          "Revisa antes del invierno tejados, canalones, bajantes y el cierre de puertas y ventanas.",
          "Protege las tuberías expuestas para que no se congelen.",
          "No tires a la calle la nieve de terrazas y balcones.",
        ],
      },
      {
        h: "Calefacción sin riesgos",
        items: [
          "Nunca uses barbacoas, braseros de carbón ni hornillos de gas para calentar la casa: el monóxido de carbono no huele y puede matar.",
          "Si usas estufas de gas o de leña, ventila un poco cada cierto tiempo y no las dejes encendidas mientras duermes.",
          "Revisa calderas y chimeneas antes del invierno.",
        ],
      },
      {
        h: "En el coche: mejor no salir",
        items: [
          "Con aviso de nevada, evita viajar si no es imprescindible y consulta el estado de las carreteras en la DGT.",
          "Si tienes que salir, no vayas solo y lleva el depósito lleno, cadenas, móvil y cargador, ropa de abrigo, manta, linterna, agua y comida energética.",
          "Si el temporal te atrapa lejos de un pueblo, quédate dentro del coche y llama al 112.",
          "Si enciendes el motor para la calefacción, hazlo a ratos, abre un poco la ventanilla y mantén el tubo de escape libre de nieve para evitar intoxicaciones.",
        ],
      },
      {
        h: "Al salir a la calle",
        items: [
          "Sal lo menos posible, sobre todo los mayores.",
          "Vístete por capas y protege cabeza, manos y cara.",
          "Camina despacio, con pasos cortos y calzado que agarre: las caídas por hielo son muy frecuentes.",
          "Los temblores fuertes son una señal para buscar refugio ya.",
        ],
      },
    ],
    cta: { href: "/guias/kit-emergencia-coche", label: "Ver qué llevar en el kit del coche" },
    faq: [
      {
        q: "¿Qué hago si me quedo atrapado en el coche por la nieve?",
        a: "Quédate dentro, llama al 112 y di dónde estás. Abrígate, enciende el motor solo a ratos con una ventanilla algo abierta y vigila que el tubo de escape no se tape con nieve.",
      },
      {
        q: "¿Es peligroso calentarse con una barbacoa o un brasero dentro de casa?",
        a: "Sí, mucho. Producen monóxido de carbono, un gas que no se ve ni huele y puede causar la muerte. No los uses nunca en espacios cerrados.",
      },
      {
        q: "¿Cuánta comida tener en casa por si nieva?",
        a: "Lo recomendable es tener para al menos 3 días (72 horas) para toda la familia, incluidas las mascotas, más los medicamentos habituales.",
      },
    ],
    sources: [
      { label: "Protección Civil Castilla-La Mancha: bajas temperaturas", url: "https://112.castillalamancha.es/proteccion-civil/consejos/bajas-temperaturas" },
      { label: "DGT: estado de las carreteras", url: "https://www.dgt.es" },
      { label: "AEMET: avisos por nieve y frío", url: "https://www.aemet.es" },
    ],
  },
  {
    slug: "alerta-es-alert-movil",
    icon: "siren",
    title: "ES-Alert: qué es el aviso que suena en el móvil y qué hacer al recibirlo",
    metaTitle: "ES-Alert: qué es la alerta de Protección Civil en el móvil",
    description:
      "Qué es ES-Alert, por qué suena tu móvil aunque esté en silencio, qué móviles lo reciben y qué hacer cuando te llega un aviso de Protección Civil.",
    intro:
      "Si tu móvil ha sonado de golpe con un pitido muy fuerte y un mensaje de Protección Civil, era un ES-Alert: el sistema que usan las autoridades para avisar a todos los móviles de una zona cuando hay una emergencia grave.",
    sections: [
      {
        h: "Qué es y cómo funciona",
        items: [
          "Funciona en toda España desde 2023. También se le llama «112 inverso».",
          "El mensaje sale de las antenas a todos los móviles que están en la zona afectada. No usa tu número ni tus datos personales.",
          "Suena aunque el móvil esté en silencio o en «No molestar».",
          "Lo envían los servicios de emergencias de cada comunidad autónoma.",
        ],
      },
      {
        h: "Qué hacer cuando llega",
        items: [
          "Mira si el texto dice «PRUEBA». Si es una prueba, no tienes que hacer nada ni llamar al 112.",
          "Si no es una prueba, léelo entero y sigue las instrucciones: confinarte, alejarte de una zona, no coger el coche…",
          "Infórmate por canales oficiales: radio, televisión y redes de Protección Civil y del 112 de tu comunidad.",
          "No llames al 112 para preguntar por el aviso. Llama solo si tienes una emergencia.",
          "Avisa a familiares y vecinos que no tengan móvil o tengan uno antiguo.",
        ],
      },
      {
        h: "¿Mi móvil lo recibe?",
        items: [
          "Android 11 o superior y iPhone con iOS 15.6 o superior lo reciben correctamente.",
          "Los Android 8 o anteriores no lo reciben.",
          "No hace falta activar nada: las alertas de máximo nivel llegan siempre y no se pueden desactivar.",
          "Un móvil apagado o sin cobertura no recibe nada. Por eso conviene tener también una radio a pilas.",
        ],
      },
    ],
    cta: { href: "/app/apagon", label: "Abrir el modo apagón (pasos y 112 a un toque)" },
    faq: [
      {
        q: "¿Puedo desactivar las alertas ES-Alert?",
        a: "Las de máxima gravedad, no: llegan siempre. En los ajustes solo aparece la opción de «Pre-alertas», que es un nivel inferior.",
      },
      {
        q: "¿Por qué me ha llegado un aviso si el peligro está lejos?",
        a: "El mensaje se envía a todas las antenas de una zona, y una antena puede cubrir varios kilómetros. Léelo igualmente y comprueba si afecta a tu municipio.",
      },
      {
        q: "¿ES-Alert sustituye a las sirenas?",
        a: "No. Es un sistema más que complementa a las sirenas y la megafonía. Por eso conviene tener también una radio a pilas.",
      },
    ],
    sources: [
      { label: "Dirección General de Protección Civil y Emergencias", url: "https://www.proteccioncivil.es" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

// Guías antiguas con su propia página (se listan también en el índice)
export const LEGACY_GUIDES = [
  { slug: "kit-emergencia-72-horas", icon: "backpack", title: "Kit de emergencia 72 horas: la lista completa", description: "Lo imprescindible para que tu hogar aguante 3 días." },
  { slug: "cuanta-agua-almacenar", icon: "drop", title: "¿Cuánta agua almacenar para una emergencia?", description: "Calculadora de litros y botellas para tu familia." },
];
