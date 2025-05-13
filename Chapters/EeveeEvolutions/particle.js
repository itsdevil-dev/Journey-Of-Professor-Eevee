class ElectricParticle {
  constructor(x, y, velocity, container) {
    this.ctx = container.ctx;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2;
    this.opacity = 1;
    this.fadeSpeed = Math.random() * 0.02 + 0.01;
    this.dx = (Math.random() - 0.5) * velocity;
    this.dy = (Math.random() - 0.5) * velocity;
    this.color = `hsla(200, 100%, 60%, ${this.opacity})`;
    this.sparkLength = Math.random() * 5 + 5;
  }

  drawLightning() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    for (let i = 0; i < 4; i++) {
      let offsetX = (Math.random() - 0.5) * this.sparkLength;
      let offsetY = (Math.random() - 0.5) * this.sparkLength;
      ctx.lineTo(this.x + offsetX, this.y + offsetY);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.stroke();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= this.fadeSpeed;
    this.color = this.color.replace(/[\d.]+\)$/, `${this.opacity})`);
  }

  render() {
    this.drawLightning();
  }

  refresh() {
    this.render();
    this.update();
  }
}

class ElectricParticles extends HTMLElement {
  static register(tag = "electric-particles") {
    if ("customElements" in window) customElements.define(tag, this);
  }

  static style = `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
    }
    canvas {
      display: block;
    }
  `;

  constructor() {
    super();
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
  }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    const styleSheet = new CSSStyleSheet();
    this.shadowRootInstance = this.attachShadow({ mode: "open" });
    styleSheet.replaceSync(ElectricParticles.style);
    this.shadowRootInstance.adoptedStyleSheets = [styleSheet];
    this.shadowRootInstance.append(canvas);
    this.canvas = this.shadowRootInstance.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.setupEvents();
    this.animate();
  }

  createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      this.particles.push(new ElectricParticle(x + offsetX, y + offsetY, Math.random() * 2 + 1, this));
    }
  }

  setupEvents() {
    // Click event
    window.addEventListener("click", (e) => {
      this.createParticles(e.clientX, e.clientY);
    });
    // Scroll event
    window.addEventListener("scroll", () => {
      // Particle effect at the center of the viewport during scroll
      const x = window.innerWidth / 2;
      const y = window.scrollY + window.innerHeight / 2;
      this.createParticles(x, y);
    });
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].refresh();
      if (this.particles[i].opacity <= 0.02) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
  }
}

ElectricParticles.register();


