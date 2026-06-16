const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);

    const spans = hamburger.querySelectorAll('span');
    if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => {
            s.style.transform = '';
            s.style.opacity = '';
        });
    });
});

const typedTarget = document.querySelector('.typed-cmd');

const phrases = [
    '.\\portfolio.exe',
    'segmentation fault (core dumped)',
    'debugging...',
    'fixing null pointer...',
    'recompiling...',
    '.\\portfolio.exe',
    'fatal error: out of memory',
    'Alt F4',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function typeLoop() {
    if (isPaused) return;

    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
        typedTarget.textContent = phrase.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === phrase.length) {
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
                typeLoop();
            }, 2000);
            return;
        }
        setTimeout(typeLoop, 65 + Math.random() * 40);
    } else {
        typedTarget.textContent = phrase.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeLoop, 400);
            return;
        }
        setTimeout(typeLoop, 30);
    }
}

setTimeout(typeLoop, 1200);

const revealEls = document.querySelectorAll('.reveal');
const cardEls = document.querySelectorAll('.project-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index ?? '0', 10);
            const delay = (idx % 2) * 100;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);

            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

cardEls.forEach(el => cardObserver.observe(el));

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    const scrollY = window.scrollY + window.innerHeight * 0.25;
    let current = null;
    sections.forEach(section => {
        if (section.offsetTop <= scrollY) {
            current = section.id;
        }
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
}

let scrollSuppressed = false;

function setActiveNavIfNotSuppressed() {
    if (!scrollSuppressed) setActiveNav();
}

navAnchors.forEach(a => {
    a.addEventListener('click', () => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        navAnchors.forEach(n => n.classList.remove('active'));
        a.classList.add('active');

        scrollSuppressed = true;
        clearTimeout(window._navScrollTimer);
        window._navScrollTimer = setTimeout(() => {
            scrollSuppressed = false;
        }, 800);
    });
});

window.addEventListener('scroll', setActiveNavIfNotSuppressed, { passive: true });
setActiveNav();

const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--green) !important;
    }
    .nav-links a.active::after {
        width: 100% !important;
    }
`;

document.head.appendChild(style);