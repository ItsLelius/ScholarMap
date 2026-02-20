document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    const body = document.body;
    
    const top = document.getElementById('top-line');
    const mid = document.getElementById('mid-line');
    const bot = document.getElementById('bot-line');

    const toggleMenu = () => {
        const isOpen = menu.classList.toggle('open');
        body.classList.toggle('no-scroll', isOpen);
        
        if (isOpen) {
            top.style.transform = "rotate(45deg) translate(5px, 5px)";
            mid.style.opacity = "0";
            bot.style.transform = "rotate(-45deg) translate(5px, -5px)";
        } else {
            top.style.transform = "none";
            mid.style.opacity = "1";
            bot.style.transform = "none";
        }
    };

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Handle Smooth Scroll for both Desktop and Mobile Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // If menu is open (mobile), close it first
            if (menu.classList.contains('open')) {
                toggleMenu();
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to the element
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Subtract header height
                    behavior: 'smooth'
                });
            }
        });
    });
});