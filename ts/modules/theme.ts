export function toggleTheme() {
    document.documentElement.classList.toggle('dark-theme');
    document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark-theme') ? "dark" : "light");
}

export function loadTheme() {
    if (localStorage.getItem('theme') == "dark") {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
    }
}
