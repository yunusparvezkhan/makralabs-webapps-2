const DASHBOARD_TOKEN_KEY = "makra_web_dashboard_access_token";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getDashboardStoredAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(DASHBOARD_TOKEN_KEY);
}

export function setDashboardStoredAccessToken(token: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(DASHBOARD_TOKEN_KEY, token);
}

export function clearDashboardStoredAccessToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(DASHBOARD_TOKEN_KEY);
}
