import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

@Component({
  selector: 'app-particles-bg',
  standalone: true,
  templateUrl: './particles-bg.component.html',
  styleUrl: './particles-bg.component.scss'
})
export class ParticlesBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private dots: Dot[] = [];
  private rafId = 0;

  private w = 0;
  private h = 0;
  private dpr = 1;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.onResize();
    window.addEventListener('resize', this.onResize);

    this.seedDots();
    this.loop();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    canvas.width = Math.floor(this.w * this.dpr);
    canvas.height = Math.floor(this.h * this.dpr);
    canvas.style.width = `${this.w}px`;
    canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // reseed if needed
    const target = this.targetCount();
    if (this.dots.length < target) this.seedDots(target - this.dots.length);
    if (this.dots.length > target) this.dots.length = target;
  };

  private targetCount() {
    const area = this.w * this.h;
    // density similar to screenshot
    return Math.max(90, Math.min(220, Math.floor(area / 9000)));
  }

  private seedDots(count = this.targetCount()) {
    for (let i = 0; i < count; i++) {
      this.dots.push(this.newDot(true));
    }
  }

  private newDot(randomPos = false): Dot {
    const speed = 0.08 + Math.random() * 0.22;
    const ang = Math.random() * Math.PI * 2;

    return {
      x: randomPos ? Math.random() * this.w : (Math.random() < 0.5 ? -20 : this.w + 20),
      y: randomPos ? Math.random() * this.h : Math.random() * this.h,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      r: 1 + Math.random() * 2.2,
      a: 0.25 + Math.random() * 0.55
    };
  }

  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);
    this.render();
  };

  private render() {
    const ctx = this.ctx;

    // background base
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = '#070a10';
    ctx.fillRect(0, 0, this.w, this.h);

    // subtle vignette
    const g = ctx.createRadialGradient(this.w * 0.5, this.h * 0.45, 0, this.w * 0.5, this.h * 0.45, Math.max(this.w, this.h) * 0.8);
    g.addColorStop(0, 'rgba(96,165,250,0.06)');
    g.addColorStop(0.45, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);

    // dots
    for (const d of this.dots) {
      d.x += d.vx;
      d.y += d.vy;

      // wrap
      if (d.x < -30) d.x = this.w + 30;
      if (d.x > this.w + 30) d.x = -30;
      if (d.y < -30) d.y = this.h + 30;
      if (d.y > this.h + 30) d.y = -30;

      // occasional colored specks like screenshot
      const colored = Math.random() < 0.035;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = colored
        ? `rgba(${this.pickColor()}, ${d.a})`
        : `rgba(255,255,255,${d.a})`;
      ctx.fill();
    }
  }

  private pickColor() {
    // RGB triplets without specifying “theme colors” elsewhere
    const colors = [
      '96,165,250',  // blue-ish
      '34,197,94',   // green
      '236,72,153',  // pink
      '250,204,21'   // yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
