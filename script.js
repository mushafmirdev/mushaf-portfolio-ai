(() => {
    const root = document.documentElement;
    const themeSelect = document.getElementById('themeSelect');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        let introPlayed = false;
        try {
            introPlayed = sessionStorage.getItem('portfolio-intro-played') === 'true';
            if (!introPlayed) sessionStorage.setItem('portfolio-intro-played', 'true');
        } catch (error) {
            // Play the intro when session storage is unavailable.
        }
        if (!introPlayed) root.classList.add('intro-play');
    }

    function applyTheme(mode) {
        const validMode = ['system', 'light', 'dark'].includes(mode) ? mode : 'system';
        const isDark = validMode === 'dark' || (validMode === 'system' && systemTheme.matches);

        root.dataset.themeMode = validMode;
        root.dataset.theme = isDark ? 'dark' : 'light';
        if (themeSelect) themeSelect.value = validMode;

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.content = isDark ? '#101114' : '#ffffff';
    }

    let savedMode = 'system';
    try {
        savedMode = localStorage.getItem('portfolio-theme') || 'system';
    } catch (error) {
        // The current system theme remains available without persistent storage.
    }
    applyTheme(savedMode);

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            applyTheme(themeSelect.value);
            try {
                localStorage.setItem('portfolio-theme', themeSelect.value);
            } catch (error) {
                // The selected theme still applies for this page view.
            }
        });
    }

    const handleSystemThemeChange = () => {
        if (root.dataset.themeMode === 'system') applyTheme('system');
    };
    if (systemTheme.addEventListener) {
        systemTheme.addEventListener('change', handleSystemThemeChange);
    } else if (systemTheme.addListener) {
        systemTheme.addListener(handleSystemThemeChange);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    function closeNavigation() {
        if (!menuToggle || !navLinks) return;
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
            navLinks.classList.toggle('active', !isExpanded);
        });

        navLinks.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeNavigation();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeNavigation();
        });
    }

    document.querySelectorAll('[data-current-year]').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    const revealSections = document.querySelectorAll('main > section:not(.hero):not(.services-hero)');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08 });

        revealSections.forEach((section) => {
            section.classList.add('scroll-reveal');
            revealObserver.observe(section);
        });
    }

    const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function updateActiveLink() {
        if (!sections.length) return;
        const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
        const marker = window.scrollY + headerHeight + 1;
        let currentSection = sections[0];

        sections.forEach((section) => {
            if (section.offsetTop <= marker) currentSection = section;
        });

        sectionLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${currentSection.id}`;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    let activeLinkUpdateScheduled = false;
    window.addEventListener('scroll', () => {
        if (activeLinkUpdateScheduled) return;
        activeLinkUpdateScheduled = true;
        window.requestAnimationFrame(() => {
            activeLinkUpdateScheduled = false;
            updateActiveLink();
        });
    }, { passive: true });
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();
})();
