// This file is simplified to only support light mode
// Dark mode and system preference detection have been removed

const applyLightTheme = () => {
    if (typeof document === 'undefined') {
        return;
    }

    // Ensure dark class is removed and light mode is applied
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme() {
    applyLightTheme();
}
