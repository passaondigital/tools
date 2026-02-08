// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    }
});

// ===== Tab Functionality =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        // Remove active from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active to clicked button and matching content
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.card, .pflege-item, .fakt-card').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Contact Form =====
const kontaktForm = document.getElementById('kontaktForm');

kontaktForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(kontaktForm);
    const name = formData.get('name');

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 16px 60px rgba(0,0,0,0.2);
        z-index: 10000;
        text-align: center;
        max-width: 400px;
        animation: fadeIn 0.3s ease;
    `;
    successMsg.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">&#9989;</div>
        <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 0.5rem; color: #3e2518;">
            Vielen Dank, ${name}!
        </h3>
        <p style="color: #7a6555; margin-bottom: 1.5rem;">
            Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.
        </p>
        <button onclick="this.parentElement.remove(); document.querySelector('.overlay-bg').remove();"
            style="padding: 0.7rem 2rem; background: #5c3d2e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">
            Schließen
        </button>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'overlay-bg';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    overlay.addEventListener('click', () => {
        successMsg.remove();
        overlay.remove();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(successMsg);

    kontaktForm.reset();
});

// ===== Active Nav Link Highlighting =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '';
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});

// ===== Counter Animation for Fakten =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberEl = entry.target.querySelector('.fakt-number');
            if (numberEl && !numberEl.dataset.animated) {
                numberEl.dataset.animated = 'true';
                animateValue(numberEl);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.fakt-card').forEach(card => {
    counterObserver.observe(card);
});

function animateValue(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const finalNum = parseInt(match[1]);
    const suffix = text.replace(match[1], '').trim();
    const prefix = text.substring(0, text.indexOf(match[1]));
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * finalNum);

        el.textContent = prefix + current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = text;
        }
    }

    requestAnimationFrame(update);
}
