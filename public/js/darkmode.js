document.addEventListener('DOMContentLoaded', (event) => {
    var themeSelect = document.getElementById('themeSelect');

    // Check if 'theme' was saved in localStorage
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('system');
    }

    // Listen for theme selection
    themeSelect.addEventListener('change', function () {
        setTheme(this.value);
    });

    function setTheme(theme) {
        switch (theme) {
            case 'light':
                document.body.classList.remove('dark-mode');
                themeSelect.value = 'light';
                break;
            case 'dark':
                document.body.classList.add('dark-mode');
                themeSelect.value = 'dark';
                break;
            case 'system':
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
                themeSelect.value = 'system';
                break;
        }

        // Save theme in localStorage
        localStorage.setItem('theme', theme);
    }
}); 