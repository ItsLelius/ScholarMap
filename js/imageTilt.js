const heroTilt = document.getElementById('hero-tilt');

if (heroTilt) {
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Tilt amount (5 = 5 degrees max)
        const tiltX = (y - 0.5) * -10; 
        const tiltY = (x - 0.5) * 10;
        
        heroTilt.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    // Smooth reset when mouse leaves
    window.addEventListener('mouseleave', () => {
        heroTilt.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}