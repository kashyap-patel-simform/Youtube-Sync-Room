export function getBrowserId(): string {
  const STORAGE_KEY = "browser_id";

  let browserId = localStorage.getItem(STORAGE_KEY);

  if (!browserId) {
    browserId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, browserId);
  }

  return browserId;
}

export function getTabId(): string {
  const STORAGE_KEY = "tab_id";

  let tabId = sessionStorage.getItem(STORAGE_KEY);

  if (!tabId) {
    tabId = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, tabId);
  }

  return tabId;
}

export function getClientId(): string {
  return `${getBrowserId()}-${getTabId()}`;
}
