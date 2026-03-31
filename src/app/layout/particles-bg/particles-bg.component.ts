import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

@Component({
  selector: 'app-particles-bg',
  standalone: true,
  templateUrl: './particles-bg.component.html',
  styleUrl: './particles-bg.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticlesBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly tintPalette = ['96,165,250', '34,197,94', '236,72,153', '250,204,21'];
  private readonly motionQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  private ctx!: CanvasRenderingContext2D;
  private dots: Dot[] = [];
  private rafId = 0;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private targetFrameMs = 1000 / 30;
  private lastPaint = 0;
  private shouldAnimate = true;
  private pageVisible = true;
  private backgroundGradient: CanvasGradient | null = null;

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;
    this.shouldAnimate = !(this.motionQuery?.matches ?? false);

    this.onResize();

    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange, { passive: true });

    if (this.motionQuery) {
      if (typeof this.motionQuery.addEventListener === 'function') {
        this.motionQuery.addEventListener('change', this.onMotionPreferenceChange);
      } else {
        this.motionQuery.addListener(this.onMotionPreferenceChange);
      }
    }

    if (this.shouldAnimate) {
      this.startAnimation();
    } else {
      this.render();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    if (this.motionQuery) {
      if (typeof this.motionQuery.removeEventListener === 'function') {
        this.motionQuery.removeEventListener('change', this.onMotionPreferenceChange);
      } else {
        this.motionQuery.removeListener(this.onMotionPreferenceChange);
      }
    }
  }

  private onResize = () => {
    const canvas = this.canvasRef.nativeElement;

    this.dpr = Math.min(2, Math.max(1, Math.floor(window.devicePixelRatio || 1)));
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.targetFrameMs = this.w < 760 ? 1000 / 24 : 1000 / 30;

    canvas.width = Math.floor(this.w * this.dpr);
    canvas.height = Math.floor(this.h * this.dpr);
    canvas.style.width = `${this.w}px`;
    canvas.style.height = `${this.h}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.buildGradient();

    const target = this.targetCount();
    if (this.dots.length < target) this.seedDots(target - this.dots.length);
    if (this.dots.length > target) this.dots.length = target;

    if (!this.shouldAnimate) this.render();
  };

  private onVisibilityChange = () => {
    this.pageVisible = document.visibilityState === 'visible';
    if (this.pageVisible) this.startAnimation();
  };

  private onMotionPreferenceChange = () => {
    this.shouldAnimate = !(this.motionQuery?.matches ?? false);

    const target = this.targetCount();
    if (this.dots.length < target) this.seedDots(target - this.dots.length);
    if (this.dots.length > target) this.dots.length = target;

    if (!this.shouldAnimate) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      this.render();
      return;
    }

    this.startAnimation();
  };

  private startAnimation() {
    if (this.rafId !== 0 || !this.shouldAnimate || !this.pageVisible) return;

    this.lastPaint = 0;
    this.ngZone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(this.loop);
    });
  }

  private loop = (timestamp = 0) => {
    if (!this.shouldAnimate || !this.pageVisible) {
      this.rafId = 0;
      return;
    }

    if (this.lastPaint === 0 || timestamp - this.lastPaint >= this.targetFrameMs) {
      this.lastPaint = timestamp;
      this.render();
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private targetCount() {
    const area = this.w * this.h;
    const base = Math.max(70, Math.min(170, Math.floor(area / 13000)));
    return this.shouldAnimate ? base : Math.max(26, Math.floor(base / 2));
  }

  private seedDots(count = this.targetCount()) {
    for (let i = 0; i < count; i++) {
      this.dots.push(this.newDot(true));
    }
  }

  private newDot(randomPos = false): Dot {
    const speed = 0.08 + Math.random() * 0.18;
    const ang = Math.random() * Math.PI * 2;
    const alpha = 0.24 + Math.random() * 0.55;

    return {
      x: randomPos ? Math.random() * this.w : Math.random() < 0.5 ? -20 : this.w + 20,
      y: randomPos ? Math.random() * this.h : Math.random() * this.h,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      r: 1 + Math.random() * 2,
      color: this.dotColor(alpha)
    };
  }

  private dotColor(alpha: number): string {
    const tint = Math.random() < 0.04;
    return tint ? `rgba(${this.pickColor()}, ${alpha})` : `rgba(255,255,255,${alpha})`;
  }

  private buildGradient() {
    this.backgroundGradient = this.ctx.createRadialGradient(
      this.w * 0.5,
      this.h * 0.45,
      0,
      this.w * 0.5,
      this.h * 0.45,
      Math.max(this.w, this.h) * 0.8
    );

    this.backgroundGradient.addColorStop(0, 'rgba(96,165,250,0.06)');
    this.backgroundGradient.addColorStop(0.45, 'rgba(0,0,0,0)');
    this.backgroundGradient.addColorStop(1, 'rgba(0,0,0,0.65)');
  }

  private render() {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = '#070a10';
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = this.backgroundGradient ?? '#070a10';
    ctx.fillRect(0, 0, this.w, this.h);

    for (const d of this.dots) {
      d.x += d.vx;
      d.y += d.vy;

      if (d.x < -30) d.x = this.w + 30;
      if (d.x > this.w + 30) d.x = -30;
      if (d.y < -30) d.y = this.h + 30;
      if (d.y > this.h + 30) d.y = -30;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
    }
  }

  private pickColor() {
    return this.tintPalette[Math.floor(Math.random() * this.tintPalette.length)];
  }
}
