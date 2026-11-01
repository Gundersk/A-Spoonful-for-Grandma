// Official ILayout.scrollTo + ILayer.getViewport/scrollTo APIs.
// Only Kitchen exists. Add future layout names here when they are implemented.
export const CAMERA_LAYOUTS = Object.freeze({
  Kitchen: Object.freeze({ mode: 'static', x: 480, y: 270 })
});

function clampAxis(value, size, viewportSize) {
  // A room smaller than the viewport remains centred rather than jittering.
  return size <= viewportSize ? size / 2
    : Math.max(viewportSize / 2, Math.min(size - viewportSize / 2, value));
}

export class CameraController {
  constructor(runtime, getTarget, configs = CAMERA_LAYOUTS) {
    this.runtime = runtime;
    this.getTarget = getTarget;
    this.configs = configs;
  }

  update() {
    const layout = this.runtime.layout;
    const config = this.configs[layout.name] ?? { mode: 'static' };
    if (!['static', 'follow'].includes(config.mode))
      throw new Error(`Unknown camera mode: ${config.mode}`);
    const world = layout.getLayer('World');
    const view = world.getViewport();
    let x = config.x ?? layout.width / 2;
    let y = config.y ?? layout.height / 2;
    if (config.mode === 'follow') {
      const target = this.getTarget();
      // No valid target yet: retain the current view during layout startup.
      if (target && Number.isFinite(target.x) && Number.isFinite(target.y)) {
        x = target.x;
        y = target.y;
      } else {
        x = layout.scrollX;
        y = layout.scrollY;
      }
    }
    layout.scrollTo(clampAxis(x, layout.width, view.width),
      clampAxis(y, layout.height, view.height));
    // Existing HUD uses design coordinates 0..960 / 0..540. Keep it fixed
    // independently of World; do not change its parallax or add another layer.
    layout.getLayer('UI').scrollTo(480, 270);
  }
}
