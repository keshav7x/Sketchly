export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export class CameraController {
  private viewportWidth = 0;
  private viewportHeight = 0;

  constructor(public camera: Camera) {
    if (camera.zoom <= 0) {
      camera.zoom = 1;
    }
  }

  pan(dx: number, dy: number): void {
    this.camera.x -= dx / this.camera.zoom;
    this.camera.y -= dy / this.camera.zoom;
  }

  zoomAt(
    screenX: number,
    screenY: number,
    factor: number,
  ): void {
    if (factor <= 0) {
      return;
    }

    const worldBefore = this.screenToWorld({
      x: screenX,
      y: screenY,
    });

    const newZoom = this.camera.zoom * factor;

    this.camera.zoom = newZoom;


    this.camera.x =
      worldBefore.x - screenX / this.camera.zoom;

    this.camera.y =
      worldBefore.y - screenY / this.camera.zoom;
  }

  worldToScreen(point: Point): Point {
    return {
      x: (point.x - this.camera.x) * this.camera.zoom,
      y: (point.y - this.camera.y) * this.camera.zoom,
    };
  }


  screenToWorld(point: Point): Point {
    return {
      x: point.x / this.camera.zoom + this.camera.x,
      y: point.y / this.camera.zoom + this.camera.y,
    };
  }


  getVisibleBounds(): Rect {
    return {
      x: this.camera.x,
      y: this.camera.y,
      width: this.viewportWidth / this.camera.zoom,
      height: this.viewportHeight / this.camera.zoom,
    };
  }


  centerOn(x: number, y: number): void {
    this.camera.x =
      x - this.viewportWidth / (2 * this.camera.zoom);

    this.camera.y =
      y - this.viewportHeight / (2 * this.camera.zoom);
  }


  fitBounds(bounds: Rect): void {
    if (
      bounds.width <= 0 ||
      bounds.height <= 0 ||
      this.viewportWidth <= 0 ||
      this.viewportHeight <= 0
    ) {
      return;
    }

    const padding = 40;

    const availableWidth =
      Math.max(1, this.viewportWidth - padding * 2);

    const availableHeight =
      Math.max(1, this.viewportHeight - padding * 2);

    const zoomX = availableWidth / bounds.width;
    const zoomY = availableHeight / bounds.height;

    this.camera.zoom = Math.min(zoomX, zoomY);

    this.centerOn(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
  }


  setZoom(zoom: number): void {
    if (zoom <= 0) {
      return;
    }

    this.camera.zoom = zoom;
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = Math.max(0, width);
    this.viewportHeight = Math.max(0, height);
  }


  getViewport(): {
    width: number;
    height: number;
  } {
    return {
      width: this.viewportWidth,
      height: this.viewportHeight,
    };
  }

  getWorldCenter(): Point {
    return this.screenToWorld({
      x: this.viewportWidth / 2,
      y: this.viewportHeight / 2,
    });
  }


  reset(): void {
    this.camera.x = 0;
    this.camera.y = 0;
    this.camera.zoom = 1;
  }
}
