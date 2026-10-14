
// =====================================================
// HOUSE JHWH-EL
// Main JavaScript
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // Select Elements
    // ==========================

    const header = document.querySelector("#header");
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar a");

    const scrollTop = document.querySelector("#scroll-top");
    const loader = document.querySelector("#loader");
    const themeToggle = document.querySelector("#theme-toggle");

    const typingText = document.querySelector("#typing-text");
    const heroImage = document.querySelector(".home-img img");

    const contactForm = document.querySelector("#contact-form");
    const formStatus = document.querySelector("#form-status");

    const currentYear = document.querySelector("#current-year");

    const body = document.body;

    // ==========================
    // Current Year
    // ==========================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ==========================
    // Page Loader
    // ==========================

    function hideLoader() {
        if (loader) {
            loader.classList.add("hide");
        }
    }

    window.addEventListener("load", hideLoader);

    // Fallback in case the page has already finished loading.
    if (document.readyState === "complete") {
        hideLoader();
    }

    // ==========================
    // Mobile Navigation
    // ==========================

    function closeMenu() {
        if (!menuIcon || !navbar) return;

        menuIcon.classList.remove("bx-x");
        menuIcon.classList.add("bx-menu");

        navbar.classList.remove("active");

        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.setAttribute("aria-label", "Open navigation menu");
    }

    function toggleMenu() {
        if (!menuIcon || !navbar) return;

        const isOpen = navbar.classList.toggle("active");

        menuIcon.classList.toggle("bx-x", isOpen);
        menuIcon.classList.toggle("bx-menu", !isOpen);

        menuIcon.setAttribute("aria-expanded", String(isOpen));
        menuIcon.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    }

    if (menuIcon && navbar) {
        menuIcon.addEventListener("click", toggleMenu);

        // Support keyboard navigation.
        menuIcon.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleMenu();
            }

            if (event.key === "Escape") {
                closeMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close the mobile menu when clicking outside it.
        document.addEventListener("click", (event) => {
            const clickedInsideHeader = header?.contains(event.target);

            if (!clickedInsideHeader) {
                closeMenu();
            }
        });

        // Close the mobile menu when returning to desktop layout.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 950) {
                closeMenu();
            }
        });
    }

    // ==========================
    // Header Shadow and Scroll UI
    // ==========================

    let scrollTicking = false;

    function updateScrollUI() {
        const scrollY = window.scrollY;

        if (header) {
            header.classList.toggle("shadow", scrollY > 40);
        }

        if (scrollTop) {
            scrollTop.classList.toggle("show", scrollY > 400);
        }

        updateActiveNavigation();

        scrollTicking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateScrollUI);
                scrollTicking = true;
            }
        },
        { passive: true }
    );

    // ==========================
    // Active Navigation
    // ==========================

    const pageSections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    function updateActiveNavigation() {
        if (!navLinks.length || !pageSections.length) return;

        const activationPoint = window.scrollY + 150;
        let activeSection = pageSections[0];

        pageSections.forEach((section) => {
            if (section.offsetTop <= activationPoint) {
                activeSection = section;
            }
        });

        navLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${activeSection.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // ==========================
    // Smooth Scrolling
    // ==========================

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            // Update the URL without triggering a sudden jump.
            if (window.location.hash !== href) {
                history.pushState(null, "", href);
            }
        });
    });

    // ==========================
    // Scroll to Top
    // ==========================

    if (scrollTop) {
        scrollTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth"
            });
        });
    }

    // ==========================
    // Hero Typing Animation
    // ==========================

    if (typingText) {
        const words = [
            "Germany",
            "Education",
            "New Opportunities",
            "Your Future"
        ];

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
            typingText.textContent = words[0];
        } else {
            let wordIndex = 0;
            let charIndex = words[0].length;
            let deleting = true;
            let typingTimer;

            function typeEffect() {
                const currentWord = words[wordIndex];

                if (deleting) {
                    charIndex--;

                    typingText.textContent = currentWord.substring(
                        0,
                        Math.max(0, charIndex)
                    );

                    if (charIndex <= 0) {
                        deleting = false;
                        wordIndex = (wordIndex + 1) % words.length;

                        typingTimer = window.setTimeout(
                            typeEffect,
                            450
                        );

                        return;
                    }
                } else {
                    const nextWord = words[wordIndex];

                    charIndex++;

                    typingText.textContent = nextWord.substring(
                        0,
                        charIndex
                    );

                    if (charIndex >= nextWord.length) {
                        deleting = true;

                        typingTimer = window.setTimeout(
                            typeEffect,
                            1600
                        );

                        return;
                    }
                }

                typingTimer = window.setTimeout(
                    typeEffect,
                    deleting ? 45 : 85
                );
            }

            typingTimer = window.setTimeout(typeEffect, 1800);

            // Stop the animation when the tab is hidden.
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    window.clearTimeout(typingTimer);
                } else {
                    window.clearTimeout(typingTimer);
                    typingTimer = window.setTimeout(typeEffect, 300);
                }
            });
        }
    }

    // ==========================
    // Scroll Reveal Animation
    // ==========================

    const revealElements = document.querySelectorAll(
        ".service-card, .partner-card, .travel-step, " +
        ".course-feature, .scholarship-item, .contact-detail"
    );

    const reducedMotionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotionPreference) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            element.classList.add("hidden");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });
    }

    // ==========================
    // Optional Hero Image Movement
    // ==========================

    if (heroImage && !reducedMotionPreference) {
        let imageTicking = false;

        window.addEventListener(
            "scroll",
            () => {
                if (imageTicking) return;

                imageTicking = true;

                window.requestAnimationFrame(() => {
                    // Keep the movement subtle on larger screens.
                    if (window.innerWidth > 950) {
                        const offset = Math.min(window.scrollY * 0.025, 18);

                        heroImage.style.transform =
                            `translateY(${offset}px)`;
                    } else {
                        heroImage.style.transform = "";
                    }

                    imageTicking = false;
                });
            },
            { passive: true }
        );
    }

    // ==========================
    // Theme Toggle
    // ==========================

    function updateThemeIcon() {
        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");

        if (!icon) return;

        const darkModeEnabled = body.classList.contains("dark-mode");

        icon.classList.toggle("bx-sun", darkModeEnabled);
        icon.classList.toggle("bx-moon", !darkModeEnabled);

        themeToggle.setAttribute(
            "aria-label",
            darkModeEnabled
                ? "Switch to light theme"
                : "Switch to dark theme"
        );

        themeToggle.setAttribute(
            "title",
            darkModeEnabled
                ? "Switch to light theme"
                : "Switch to dark theme"
        );
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem("houseJhwhElTheme", theme);
        } catch (error) {
            // The theme still works if browser storage is unavailable.
        }
    }

    function loadTheme() {
        try {
            return localStorage.getItem("houseJhwhElTheme");
        } catch (error) {
            return null;
        }
    }

    const savedTheme = loadTheme();

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");

            const selectedTheme = body.classList.contains("dark-mode")
                ? "dark"
                : "light";

            saveTheme(selectedTheme);
            updateThemeIcon();
        });
    }

    // ==========================
    // Contact Form Validation
    // ==========================

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nameField = contactForm.querySelector("#name");
            const emailField = contactForm.querySelector("#email");
            const serviceField = contactForm.querySelector("#service");
            const messageField = contactForm.querySelector("#message");

            if (
                !nameField ||
                !emailField ||
                !serviceField ||
                !messageField
            ) {
                return;
            }

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const service = serviceField.value;
            const message = messageField.value.trim();

            if (!name) {
                if (formStatus) {
                    formStatus.textContent = "Please enter your full name.";
                }

                nameField.focus();
                return;
            }

            if (!emailField.validity.valid || !email) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please enter a valid email address.";
                }

                emailField.focus();
                return;
            }

            if (!service) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please select the type of enquiry.";
                }

                serviceField.focus();
                return;
            }

            if (message.length < 10) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please enter a message of at least 10 characters.";
                }

                messageField.focus();
                return;
            }

            // The form has no backend connection yet.
            // Do not claim that an enquiry was actually delivered.
            if (formStatus) {
                formStatus.textContent =
                    "Your details passed validation, but this form is not " +
                    "connected to the organisation's email service yet. " +
                    "Your enquiry has not been sent.";
            }
        });
    }

    // ==========================
    // Initial UI State
    // ==========================

    updateScrollUI();
});
