export const CORE_NAMESPACE = "core";
export const PAN_SETTING = "chatBubblesPan";
export const PAN_SETTING_ID = `${CORE_NAMESPACE}.${PAN_SETTING}`;

const guardedSettings = new WeakSet();

export function isChatPanSetting(namespace, key) {
  return namespace === CORE_NAMESPACE && key === PAN_SETTING;
}

export function disableBubblePan(options) {
  if (!options || typeof options !== "object") return false;
  try {
    options.pan = false;
    return options.pan === false;
  } catch {
    return false;
  }
}

export function createSettingsGetGuard(originalGet) {
  if (typeof originalGet !== "function") {
    throw new TypeError("A settings getter is required");
  }
  return function guardedSettingsGet(namespace, key, ...args) {
    if (isChatPanSetting(namespace, key)) return false;
    return Reflect.apply(originalGet, this, [namespace, key, ...args]);
  };
}

export function installSettingsGuard(settings) {
  if (!settings || typeof settings.get !== "function") return false;
  if (guardedSettings.has(settings)) return true;
  try {
    const originalGet = settings.get;
    settings.get = createSettingsGetGuard(originalGet);
    const installed = settings.get(CORE_NAMESPACE, PAN_SETTING) === false;
    if (installed) guardedSettings.add(settings);
    return installed;
  } catch {
    return false;
  }
}

export function hideCorePanSetting(settings) {
  const definition = settings?.settings?.get?.(PAN_SETTING_ID);
  if (!definition) return false;
  try {
    definition.config = false;
    return definition.config === false;
  } catch {
    return false;
  }
}

export function removePanSettingControl(element) {
  const root = element?.querySelector ? element : element?.[0];
  const input = root?.querySelector?.(`[name="${PAN_SETTING_ID}"]`);
  const row = input?.closest?.(".form-group, .form-group-stacked, fieldset");
  if (!row) return false;
  row.remove();
  return true;
}
