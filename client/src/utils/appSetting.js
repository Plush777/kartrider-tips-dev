export default function appSetting(serverStates) {
  const themeCookie = serverStates.theme;
  const fontSizeCookie = serverStates.fontSize;

  if (themeCookie == undefined) {
    localStorage.setItem('theme', 'light');
    document.body.dataset.theme = 'light';
    document.cookie = `theme=light; path=/;`; // SSR
    document.documentElement.style.colorScheme = 'light';
  } else {
    localStorage.setItem('theme', themeCookie.value);
    document.body.dataset.theme = themeCookie.value;
    document.cookie = `theme=${themeCookie.value}; path=/;`;
    document.documentElement.style.colorScheme = themeCookie.value;
  }

  if (fontSizeCookie == undefined) {
    localStorage.setItem('fontSize', 'default');
    document.documentElement.classList.add('default');
    document.cookie = `fontSize=default; path=/;`; // SSR
  } else {
    localStorage.setItem('fontSize', fontSizeCookie.value);
    document.documentElement.classList.add(fontSizeCookie.value);
    document.cookie = `fontSize=${fontSizeCookie.value}; path=/;`; // SSR
  }
}
