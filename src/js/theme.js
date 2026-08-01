const STORAGE_KEY = "theme-preference";

function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "auto";
  } catch {
    return "auto";
  }
}

function storeTheme(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable: the choice only lasts for this page view */
  }
}

function applyTheme(value) {
  if (value === "light" || value === "dark") {
    document.documentElement.setAttribute("data-theme", value);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function init() {
  const fieldset = document.querySelector(".theme-picker");
  if (!fieldset) return;

  const current = readStoredTheme();
  applyTheme(current);

  const radios = fieldset.querySelectorAll('input[name="theme"]');
  radios.forEach((radio) => {
    radio.checked = radio.value === current;
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      applyTheme(radio.value);
      storeTheme(radio.value);
    });
  });

  fieldset.hidden = false;
}

init();
