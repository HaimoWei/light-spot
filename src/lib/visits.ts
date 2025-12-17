import path from "path";
import { promises as fs } from "fs";

export type CounterState = {
  total: number;
  initial: number;
  createdAt: string;
  updatedAt: string;
};

export type VisitState = CounterState;
export type FishCoinsState = CounterState;

const DEFAULT_VISITS_INITIAL = 0;
const DEFAULT_FISH_COINS_INITIAL = 0;

function toNonNegativeInt(value: unknown, fallback: number) {
  const parsed = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

function resolveDataDir() {
  return process.env.VISITS_DATA_DIR ?? path.join(process.cwd(), ".next", "data");
}

type Mutex = { chain: Promise<void> };

function getMutex(): Mutex {
  const key = "__lightspot_counters_mutex__";
  const globalAny = globalThis as any;
  if (!globalAny[key]) globalAny[key] = { chain: Promise.resolve() } satisfies Mutex;
  return globalAny[key] as Mutex;
}

async function runExclusive<T>(task: () => Promise<T>): Promise<T> {
  const mutex = getMutex();
  const result = mutex.chain.then(task, task);
  mutex.chain = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

async function ensureDataDir() {
  await fs.mkdir(resolveDataDir(), { recursive: true });
}

type CounterConfig = {
  filename: string;
  initialEnvVar: "VISITS_INITIAL" | "FISH_COINS_INITIAL";
  defaultInitial: number;
};

function resolveInitial(config: CounterConfig) {
  return toNonNegativeInt(process.env[config.initialEnvVar], config.defaultInitial);
}

function resolveStatePath(filename: string) {
  return path.join(resolveDataDir(), filename);
}

function normalizeState(config: CounterConfig, raw: any): CounterState {
  const initial = resolveInitial(config);
  const now = new Date().toISOString();

  const total = toNonNegativeInt(raw?.total, initial);
  const storedInitial = toNonNegativeInt(raw?.initial, initial);
  const createdAt = typeof raw?.createdAt === "string" ? raw.createdAt : now;
  const updatedAt = typeof raw?.updatedAt === "string" ? raw.updatedAt : now;

  return { total, initial: storedInitial, createdAt, updatedAt };
}

async function writeState(filePath: string, state: CounterState) {
  const tmpPath = `${filePath}.tmp`;
  const payload = JSON.stringify(state, null, 2);
  await fs.writeFile(tmpPath, payload, "utf8");
  await fs.rename(tmpPath, filePath);
}

async function getCounterState(config: CounterConfig): Promise<CounterState> {
  return runExclusive(async () => {
    await ensureDataDir();
    const filePath = resolveStatePath(config.filename);
    const initial = resolveInitial(config);

    try {
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(raw);
      const state = normalizeState(config, parsed);
      if (state.initial !== initial) state.initial = initial;

      const shouldWrite =
        state.total !== parsed?.total ||
        state.initial !== parsed?.initial ||
        state.createdAt !== parsed?.createdAt ||
        state.updatedAt !== parsed?.updatedAt;

      if (shouldWrite) await writeState(filePath, state);
      return state;
    } catch {
      const now = new Date().toISOString();
      const fresh: CounterState = { total: initial, initial, createdAt: now, updatedAt: now };
      await writeState(filePath, fresh);
      return fresh;
    }
  });
}

async function incrementCounter(config: CounterConfig, delta = 1): Promise<number> {
  return runExclusive(async () => {
    await ensureDataDir();
    const filePath = resolveStatePath(config.filename);
    const now = new Date().toISOString();
    const initial = resolveInitial(config);

    let state: CounterState;
    try {
      const raw = await fs.readFile(filePath, "utf8");
      state = normalizeState(config, JSON.parse(raw));
    } catch {
      state = { total: initial, initial, createdAt: now, updatedAt: now };
    }

    state.total = toNonNegativeInt(state.total, initial) + Math.max(1, Math.floor(delta));
    state.initial = initial;
    state.updatedAt = now;

    await writeState(filePath, state);
    return state.total;
  });
}

const visitsConfig: CounterConfig = {
  filename: "visits.json",
  initialEnvVar: "VISITS_INITIAL",
  defaultInitial: DEFAULT_VISITS_INITIAL
};

const fishCoinsConfig: CounterConfig = {
  filename: "fish-coins.json",
  initialEnvVar: "FISH_COINS_INITIAL",
  defaultInitial: DEFAULT_FISH_COINS_INITIAL
};

export async function getVisitState(): Promise<VisitState> {
  return getCounterState(visitsConfig);
}

export async function incrementVisitCount(): Promise<number> {
  return incrementCounter(visitsConfig, 1);
}

export async function getFishCoinsState(): Promise<FishCoinsState> {
  return getCounterState(fishCoinsConfig);
}

export async function incrementFishCoins(): Promise<number> {
  return incrementCounter(fishCoinsConfig, 1);
}
