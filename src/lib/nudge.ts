// Aviso «de vez en cuando» de la lista de espera de Pro. Va aparte del store para no tocar los datos guardados.
const KEY = "miplanb-nudge";
const DAY = 86_400_000;

export interface NudgeState { changes: number; shown: number; last: number; joined: boolean }

export function readNudge(): NudgeState {
  try {
    return { changes: 0, shown: 0, last: 0, joined: false, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { changes: 0, shown: 0, last: 0, joined: false };
  }
}

function save(s: NudgeState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* modo privado: no pasa nada */ }
}

export function markProJoined() {
  save({ ...readNudge(), joined: true });
}

/** Funciones Pro que vamos rotando en el aviso. */
export const NUDGE_FEATURES = [
  "Compartir el kit con tu familia",
  "Avisos de caducidad por email",
  "Usarla en el móvil y en el ordenador",
  "Copia de seguridad en la nube",
  "Varias casas (casa, pueblo, coche)",
];

/** Suma un cambio y dice si toca enseñar el aviso (y con qué función). */
export function registerChange(now = Date.now()): string | null {
  const s = readNudge();
  if (s.joined || s.shown >= 4) return null;
  s.changes += 1;
  const needed = s.shown === 0 ? 10 : 15; // primero tras usarla un rato; luego más espaciado
  const rested = s.shown === 0 || now - s.last >= 3 * DAY;
  if (s.changes >= needed && rested) {
    const feature = NUDGE_FEATURES[s.shown % NUDGE_FEATURES.length];
    save({ ...s, changes: 0, shown: s.shown + 1, last: now });
    return feature;
  }
  save(s);
  return null;
}
