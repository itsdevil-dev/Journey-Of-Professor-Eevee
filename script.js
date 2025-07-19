window.onload = () => {
  
  const text = `✨ Step into a magical Pokémon tale where science meets legend! 🌟
Follow Professor Eevee and the mysterious Pokémon Euvee in a heart-touching adventure filled with glowing secrets, fierce battles, and a bond that could change the world forever. 🧪❤️‍🔥
Are you ready to discover a story where every heartbeat echoes with magic? 🌈📖`;

  const typewriterElement = document.getElementById('typewriter-text');
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      const char = text.charAt(index);
      if (char === '\n') {
        typewriterElement.innerHTML += '<br><br>';
      } else {
        typewriterElement.innerHTML += char;
      }
      index++;
      const delay = char === '.' || char === '!' || char === '?' ? 200 : 40;
      setTimeout(typeWriter, delay);
    }
  }

  typeWriter();

  const btn = document.querySelector('.start-btn');
  btn.addEventListener('click', () => {
    btn.classList.add('starting');
    setTimeout(() => {
      window.location.assign("Chapters/chapter1.html");
      
  
    }, 800);
  });
};


const bgMusic = new Audio('src/p.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;
bgMusic.muted = true;  

function tryPlayMusic() {
  if (bgMusic.muted) {
    bgMusic.muted = false;
    bgMusic.play().then(() => {
      console.log('Music started');
    }).catch(err => {
      console.warn('Autoplay failed:', err);
    });
  }
}

window.addEventListener('click', tryPlayMusic);
window.addEventListener('keydown', tryPlayMusic);
window.addEventListener('scroll', tryPlayMusic);


document.querySelector('.start-btn').addEventListener('click', () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
});

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  let explosions = [];

  const STAR_COUNT = 200;
  const EXPLOSION_CHANCE = 0.015;    
  const EXPLOSION_PARTICLES = 60;    
  const MAX_PARTICLE_SPEED = 10;     
  const MAX_RADIUS = 4;              

  function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = Array(STAR_COUNT).fill().map(createStar);
    explosions = [];
    createExplosion();              
  }

  function createStar() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3
    };
  }

  function createExplosion() {
    const ex = {
      x: Math.random() * width,
      y: Math.random() * height,
      particles: []
    };
    for (let i = 0; i < EXPLOSION_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * MAX_PARTICLE_SPEED + 1;
      ex.particles.push({
        x: ex.x,
        y: ex.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        radius: Math.random() * (MAX_RADIUS - 2) + 2, 
        life: 60 + Math.random() * 40,               
        hue: Math.floor(Math.random() * 360)         
      });
    }
    explosions.push(ex);
  }

  function drawStar(s) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }

  function drawExplosionParticle(p) {
  const spikes = 5;
  const outerR = p.radius;
  const innerR = p.radius * 0.5;
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;

  ctx.save();
  // glow settings 
  ctx.shadowBlur = outerR * 4;                    
  ctx.shadowColor = `hsla(${p.hue}, 100%, 80%, ${p.life / 80})`;
  ctx.fillStyle = `hsla(${p.hue}, 100%, ${40 + (p.life / 100) * 60}%, ${p.life / 80})`;

  ctx.beginPath();
  ctx.moveTo(p.x, p.y - outerR);
  for (let i = 0; i < spikes; i++) {
    // outer point
    ctx.lineTo(
      p.x + Math.cos(rot) * outerR,
      p.y + Math.sin(rot) * outerR
    );
    rot += step;
    // inner point
    ctx.lineTo(
      p.x + Math.cos(rot) * innerR,
      p.y + Math.sin(rot) * innerR
    );
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
  
  function update() {
    ctx.clearRect(0, 0, width, height);

    
    if (Math.random() < EXPLOSION_CHANCE) {
      createExplosion();
    }

    
    stars.forEach(s => {
      drawStar(s);
      s.x += s.dx; s.y += s.dy;
      s.alpha += (Math.random() - 0.5) * 0.01;
      if (s.alpha < 0.1) s.alpha = 0.1;
      if (s.alpha > 1) s.alpha = 1;
      if (s.x < 0 || s.x > width) s.dx *= -1;
      if (s.y < 0 || s.y > height) s.dy *= -1;
    });


    explosions = explosions.filter(ex => ex.particles.length > 0);
    explosions.forEach(ex => {
      ex.particles = ex.particles.filter(p => p.life > 0);
      ex.particles.forEach(p => {
        drawExplosionParticle(p);
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
      });
    });

    requestAnimationFrame(update);
  }

  window.addEventListener('resize', initCanvas);

  initCanvas();
  update();
});
