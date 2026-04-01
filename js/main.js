/**
 * Zynora Portfolio — Core Interactions
 * Pure ES6, zero dependencies
 */

(function() {
    'use strict';

    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    function setupCursor() {
        var dot = document.getElementById('cursorDot');
        var ring = document.getElementById('cursorRing');
        if (!dot || !ring) return;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = 'translate(' + (mouseX - 3) + 'px,' + (mouseY - 3) + 'px)';
        });

        function followRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.transform = 'translate(' + (ringX - 16) + 'px,' + (ringY - 16) + 'px)';
            requestAnimationFrame(followRing);
        }
        followRing();

        var hovers = document.querySelectorAll('[data-cursor="hover"], a, button');
        for (var i = 0; i < hovers.length; i++) {
            hovers[i].addEventListener('mouseenter', function() {
                dot.classList.add('is-hover');
                ring.classList.add('is-hover');
            });
            hovers[i].addEventListener('mouseleave', function() {
                dot.classList.remove('is-hover');
                ring.classList.remove('is-hover');
            });
        }
    }

    function setupPreloader() {
        var el = document.getElementById('preloader');
        if (!el) return;
        window.addEventListener('load', function() {
            setTimeout(function() {
                el.style.opacity = '0';
                el.style.transform = 'translateY(-8px)';
                setTimeout(function() {
                    el.style.display = 'none';
                    window.dispatchEvent(new Event('scroll'));
                }, 700);
            }, 800);
        });
    }

    function setupTheme() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var saved = localStorage.getItem('zynora-theme');
        if (saved) document.documentElement.setAttribute('data-theme', saved);

        btn.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = (current === 'light') ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('zynora-theme', next);
        });
    }

    function setupReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('is-visible');
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.12 });

        for (var i = 0; i < items.length; i++) {
            observer.observe(items[i]);
        }
    }

    function setupTyper() {
        var el = document.getElementById('heroTyper');
        if (!el) return;

        var words = ['Digital Products.', 'SaaS Platforms.', 'Premium Plugins.'];
        var wordIndex = 0, charIndex = 0, deleting = false;

        function tick() {
            var current = words[wordIndex];
            if (deleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            el.textContent = current.substring(0, charIndex);

            var delay = deleting ? 45 : 110;
            if (!deleting && charIndex === current.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 400;
            }
            setTimeout(tick, delay);
        }
        tick();
    }

    function setupCounter() {
        var el = document.getElementById('expCounter');
        if (!el) return;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var counted = false;

        var obs = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                var n = 0;
                var step = function() {
                    n++;
                    el.textContent = n;
                    if (n < target) setTimeout(step, 90);
                };
                step();
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        obs.observe(el);
    }

    function setupGraph() {
        var container = document.getElementById('commitGraph');
        if (!container) return;
        var frag = document.createDocumentFragment();
        var total = 60;
        for (var i = 0; i < total; i++) {
            var node = document.createElement('div');
            node.className = 'graph__node';
            var r = Math.random();
            var lvl = 0;
            if (r > 0.55) lvl = 1;
            if (r > 0.8) lvl = 2;
            if (r > 0.93) lvl = 3;
            node.setAttribute('data-level', lvl);
            frag.appendChild(node);
        }
        container.appendChild(frag);
    }

    function setupFilter() {
        var btns = document.querySelectorAll('.filter-btn');
        var cards = document.querySelectorAll('.card');
        if (!btns.length) return;

        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function() {
                for (var j = 0; j < btns.length; j++) btns[j].classList.remove('is-active');
                this.classList.add('is-active');
                var val = this.getAttribute('data-filter');

                for (var k = 0; k < cards.length; k++) {
                    var cat = cards[k].getAttribute('data-category');
                    if (val === 'all' || val === cat) {
                        cards[k].classList.remove('is-hidden');
                        cards[k].style.opacity = '0';
                        cards[k].style.transform = 'scale(0.96)';
                        (function(c) {
                            setTimeout(function() {
                                c.style.opacity = '1';
                                c.style.transform = 'scale(1)';
                            }, 40);
                        })(cards[k]);
                    } else {
                        cards[k].classList.add('is-hidden');
                    }
                }
            });
        }
    }

    function setupCardTilt() {
        var cards = document.querySelectorAll('.card');
        for (var i = 0; i < cards.length; i++) {
            (function(card) {
                var photo = card.querySelector('.card__photo');

                card.addEventListener('mousemove', function(e) {
                    var r = card.getBoundingClientRect();
                    var px = (e.clientX - r.left) / r.width - 0.5;
                    var py = (e.clientY - r.top) / r.height - 0.5;
                    card.style.transform = 'perspective(800px) rotateY(' + (px * 12) + 'deg) rotateX(' + (py * -12) + 'deg) scale3d(1.02,1.02,1)';
                    if (photo) photo.style.transform = 'translate(' + (px * -8) + 'px,' + (py * -8) + 'px) scale(1.04)';
                    card.style.transition = 'none';
                    if (photo) photo.style.transition = 'none';
                });

                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';
                    card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                    if (photo) {
                        photo.style.transform = '';
                        photo.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                    }
                });
            })(cards[i]);
        }
    }

    function setupTimeline() {
        var section = document.getElementById('timeline');
        var line = document.getElementById('timelineLine');
        var dots = document.querySelectorAll('.timeline__item');
        if (!section || !line) return;

        function update() {
            var rect = section.getBoundingClientRect();
            var vh = window.innerHeight;
            var start = rect.top - vh * 0.5;
            var pct = 0;
            if (start < 0) {
                pct = Math.min(100, Math.max(0, Math.abs(start) / rect.height * 100));
            }
            line.style.height = pct + '%';

            for (var i = 0; i < dots.length; i++) {
                var dr = dots[i].getBoundingClientRect();
                if (dr.top < vh * 0.55) {
                    dots[i].classList.add('is-active');
                } else {
                    dots[i].classList.remove('is-active');
                }
            }
        }

        window.addEventListener('scroll', function() { requestAnimationFrame(update); });
        update();
    }

    function setupAccordion() {
        var items = document.querySelectorAll('.accordion__item');
        for (var i = 0; i < items.length; i++) {
            (function(item) {
                var trigger = item.querySelector('.accordion__trigger');
                trigger.addEventListener('click', function() {
                    var open = item.classList.contains('is-open');
                    for (var j = 0; j < items.length; j++) items[j].classList.remove('is-open');
                    if (!open) item.classList.add('is-open');
                });
            })(items[i]);
        }
    }

    function setupForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        var success = document.getElementById('formSuccess');

        function isValidEmail(str) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var fields = [
                { el: document.getElementById('inputName'), type: 'text' },
                { el: document.getElementById('inputEmail'), type: 'email' },
                { el: document.getElementById('inputMessage'), type: 'text' }
            ];
            var ok = true;

            for (var i = 0; i < fields.length; i++) {
                var group = fields[i].el.closest('.form__group');
                group.classList.remove('has-error');
                var val = fields[i].el.value.trim();
                if (!val || (fields[i].type === 'email' && !isValidEmail(val))) {
                    group.classList.add('has-error');
                    ok = false;
                }
            }
            if (success) success.classList.remove('is-visible');

            if (ok) {
                var btn = form.querySelector('.form__btn');
                var orig = btn.textContent;
                btn.textContent = 'Sending...';
                btn.disabled = true;
                setTimeout(function() {
                    btn.textContent = orig;
                    btn.disabled = false;
                    form.reset();
                    if (success) success.classList.add('is-visible');
                    setTimeout(function() { success.classList.remove('is-visible'); }, 4000);
                }, 1200);
            }
        });
    }

    /* Initialize everything on DOM ready */
    document.addEventListener('DOMContentLoaded', function() {
        if (window.matchMedia('(pointer:fine)').matches) setupCursor();
        setupPreloader();
        setupTheme();
        setupReveal();
        setupTyper();
        setupCounter();
        setupGraph();
        setupFilter();
        setupCardTilt();
        setupTimeline();
        setupAccordion();
        setupForm();
    });

})();
