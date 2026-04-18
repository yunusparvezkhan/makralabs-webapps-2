export type DashboardActivityType =
  | "auth"
  | "health"
  | "balance"
  | "consume"
  | "api_key_create"
  | "api_key_delete"
  | "api_key_probe"
  | "error";

export type DashboardActivityItem = {
  id: string;
  ts: number;
  type: DashboardActivityType;
  message: string;
  meta?: Record<string, unknown>;
};

const STORAGE_KEY = "makra_web_dashboard_activity_v1";
const CHANGE_EVENT = "makra_web_dashboard_activity_change";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readAll(): DashboardActivityItem[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as DashboardActivityItem[];
  } catch {
    return [];
  }
}

function writeAll(items: DashboardActivityItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function dashboardActivitySubscribe(callback: () => void) {
  if (!canUseStorage()) {
    return () => {};
  }

  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function dashboardActivityGetSnapshot() {
  return readAll();
}

export function dashboardActivityAdd(item: Omit<DashboardActivityItem, "id" | "ts">) {
  const all = readAll();
  const next: DashboardActivityItem = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    ...item
  };

  const capped = [next, ...all].slice(0, 200);
  writeAll(capped);

  return next;
}

export function dashboardActivityClear() {
  writeAll([]);
}
