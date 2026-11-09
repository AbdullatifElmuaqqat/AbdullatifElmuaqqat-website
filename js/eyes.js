// Portrait whose eyes follow the cursor. The photo stays untouched; only the irises slide inside
// the eye openings, and the lids blink now and then. No dependencies.

// Measured on the 800x800 reference photo (image pixels).
const EYES = [
  { iris: [317, 333], inner: [345, 337], outer: [284, 336], top: 327.5, bottom: 340 },
  { iris: [456.5, 333], inner: [422.5, 337], outer: [492.5, 340], top: 327.5, bottom: 340.6 },
];
const IRIS_R = 11;
const MAX = { x: 8, y: 2 }; // how far an iris can slide (px)

const loadImage = (src) => new Promise((ok, fail) => {
  const im = new Image(); im.onload = () => ok(im); im.onerror = fail; im.src = src;
});

// Almond-shaped eye opening; `s` shrinks it toward the centre.
function openingPath(ctx, e, s = 1) {
  const cx = (e.inner[0] + e.outer[0]) / 2, cy = (e.inner[1] + e.outer[1]) / 2;
  const p = ([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s];
  const mid = (e.inner[1] + e.outer[1]) / 2;
  const [ix, iy] = p(e.inner), [ox, oy] = p(e.outer);
  const [tx, ty] = p([cx, 2 * e.top - mid]), [bx, by] = p([cx, 2 * e.bottom - mid]);
  ctx.beginPath(); ctx.moveTo(ox, oy);
  ctx.quadraticCurveTo(tx, ty, ix, iy);
  ctx.quadraticCurveTo(bx, by, ox, oy);
  ctx.closePath();
}

const avg = (data, w, pts) => {
  const c = [0, 0, 0];
  for (const [x, y] of pts) { const i = (Math.round(y) * w + Math.round(x)) * 4; for (let k = 0; k < 3; k++) c[k] += data[i + k]; }
  return c.map((v) => Math.round(v / pts.length));
};
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export async function mountEyes(container, { photo = 'avatar-photo.jpg' } = {}) {
  const img = await loadImage(photo);
  const W = img.naturalWidth, H = img.naturalHeight;
  const sx = W / 800, sy = H / 800; // landmarks scale with the photo size

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  canvas.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, W, H).data;
  ctx.scale(sx, sy);

  // Per eye: an iris patch cut from the photo, plus sampled sclera and lid colours.
  const eyes = EYES.map((e) => {
    const [cx, cy] = e.iris, r = IRIS_R + 1;
    const patch = document.createElement('canvas');
    patch.width = patch.height = Math.ceil(2 * r * sx);
    const g = patch.getContext('2d');
    g.scale(sx, sy); g.translate(r - cx, r - cy);
    openingPath(g, e); g.clip();
    g.beginPath(); g.arc(cx, cy, IRIS_R, 0, Math.PI * 2); g.clip();
    g.drawImage(img, 0, 0, W, H, 0, 0, 800, 800);
    const at = (pts) => avg(px, W, pts.map(([x, y]) => [x * sx, y * sy]));
    return {
      ...e, patch, r,
      scleraTop: at([[cx - 15, cy - 1], [cx + 15, cy - 1]]),
      scleraBottom: at([[cx - 14, cy + 3], [cx + 14, cy + 3]]),
      skin: at([[cx - 8, e.top - 6], [cx + 8, e.top - 6], [cx, e.top - 7]]),
      look: { x: 0, y: 0 },
    };
  });

  // Gaze target in image pixels (null = look at the viewer).
  let pointer = null, lastMove = 0;
  const toImage = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    return [((clientX - r.left) / r.width) * 800, ((clientY - r.top) / r.height) * 800];
  };
  addEventListener('pointermove', (ev) => { pointer = toImage(ev.clientX, ev.clientY); lastMove = performance.now(); }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer = null; });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let nextBlink = performance.now() + 2500, blinkStart = -1;

  function drawEye(e, lid) {
    ctx.save();
    openingPath(ctx, e, 0.94); ctx.clip(); // stay inside the lash line
    const [cx, cy] = e.iris;
    // Cover the original iris with sclera, then draw it at its new place.
    const grad = ctx.createLinearGradient(0, e.top, 0, e.bottom);
    grad.addColorStop(0, rgb(e.scleraTop)); grad.addColorStop(1, rgb(e.scleraBottom));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, IRIS_R + 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(e.patch, cx - e.r + e.look.x, cy - e.r + e.look.y, 2 * e.r, 2 * e.r);
    // Soft shadow from the upper lid keeps the moved iris sitting in the socket.
    const shade = ctx.createLinearGradient(0, e.top, 0, e.top + 6);
    shade.addColorStop(0, 'rgba(40,24,18,0.35)'); shade.addColorStop(1, 'rgba(40,24,18,0)');
    ctx.fillStyle = shade; ctx.fillRect(e.outer[0] - 5, e.top - 2, e.inner[0] - e.outer[0] + 10, 10);
    ctx.restore();

    if (lid > 0) { // blink: the real upper-lid skin from the photo slides down, edge curving with the lid
      const mid = (e.inner[1] + e.outer[1]) / 2, cx = (e.inner[0] + e.outer[0]) / 2;
      const ctrlY = (2 * e.top - mid) + ((2 * e.bottom - mid) - (2 * e.top - mid)) * lid;
      const x0 = e.outer[0] - 6, x1 = e.inner[0] + 6, skinTop = e.top - 12;
      const edge = (c) => { c.moveTo(e.outer[0], e.outer[1]); c.quadraticCurveTo(cx, ctrlY, e.inner[0], e.inner[1]); };
      ctx.save();
      openingPath(ctx, e, 1.12); ctx.clip();
      ctx.beginPath(); ctx.moveTo(x0, skinTop); ctx.lineTo(x1, skinTop); ctx.lineTo(e.inner[0], e.inner[1]);
      ctx.quadraticCurveTo(cx, ctrlY, e.outer[0], e.outer[1]); ctx.closePath(); ctx.clip();
      const lidBottom = (ctrlY + mid) / 2 + 1; // lowest point of the lid edge
      ctx.drawImage(img, x0 * sx, skinTop * sy, (x1 - x0) * sx, 10 * sy, x0, skinTop, x1 - x0, lidBottom - skinTop);
      const sh = ctx.createLinearGradient(0, skinTop, 0, lidBottom);
      sh.addColorStop(0, 'rgba(60,35,25,0)'); sh.addColorStop(1, 'rgba(60,35,25,0.25)');
      ctx.fillStyle = sh; ctx.fillRect(x0, skinTop, x1 - x0, lidBottom - skinTop);
      ctx.restore();
      ctx.save(); // lash line along the lid edge
      ctx.strokeStyle = 'rgba(28,18,14,0.9)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
      ctx.beginPath(); edge(ctx); ctx.stroke();
      ctx.restore();
    }
  }

  function frame(now) {
    const idle = !pointer || now - lastMove > 4000;
    let lid = 0;
    if (!reduced) {
      if (blinkStart < 0 && now > nextBlink) blinkStart = now;
      if (blinkStart >= 0) {
        const t = (now - blinkStart) / 160; // 160 ms down + up
        lid = t < 1 ? t : 2 - t;
        if (t >= 2) { blinkStart = -1; lid = 0; nextBlink = now + 2500 + Math.random() * 4000; }
      }
    }
    for (const e of eyes) {
      let tx = 0, ty = 0;
      if (!idle) {
        const dx = pointer[0] - e.iris[0], dy = pointer[1] - e.iris[1];
        const d = Math.hypot(dx, dy) || 1, reach = Math.tanh(d / 250);
        tx = (dx / d) * reach * MAX.x; ty = (dy / d) * reach * MAX.y;
      }
      const k = reduced ? 1 : 0.2;
      e.look.x += (tx - e.look.x) * k; e.look.y += (ty - e.look.y) * k;
    }
    ctx.drawImage(img, 0, 0, W, H, 0, 0, 800, 800);
    for (const e of eyes) drawEye(e, Math.max(0, Math.min(1, lid)));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return { canvas, eyes, blink: () => { nextBlink = 0; } };
}
