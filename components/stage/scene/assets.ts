/**
 * Texture manifest for the clay scene.
 *
 * Every file below is hotlinked from a third-party origin we do not control.
 * That origin can rename a bucket, flip the public flag or go down, and the
 * requests will start failing without any warning to us. Nothing here is
 * therefore allowed to be load-bearing: `loadClayTexture` resolves to `null`
 * rather than rejecting, and `createClayMaterial` compiles a plain matte
 * variant when it gets `null`. That fallback path is the only reason the
 * sculpture does not break the day the assets disappear.
 *
 * We deliberately do NOT hotlink the baked lightmaps from the source design.
 * Those were baked against the original artboard, and a lightmap that no
 * longer matches its geometry reads worse than no lightmap at all. The clay
 * reading comes from real lights plus the procedural environment instead.
 */

export type Three = typeof import("three");

export const BASE =
  "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/";

/**
 * Four clay surface scans. They are tiled into a single 512x512 canvas (2x2,
 * 256 each) rather than kept as four textures, because the material samples
 * triplanar: three fetches per fragment per texture, so one atlas costs three
 * fetches where four textures would cost twelve.
 */
export const CLAY_FILES = [
  "8d1b5781-21d5-4ac7-b7a5-04f56c577966_original.webp",
  "7a60413a-0776-4a47-b83d-893b7b74ba36_original.webp",
  "17a412f8-3770-4951-81a4-37709e2a0b14_original.webp",
  "6746000b-1aa6-4f1e-a32b-a45c91878105_original.webp",
] as const;

export const CLAY_ATLAS = 512;
export const CLAY_TILE = CLAY_ATLAS / 2;

/** How long we wait on the remote origin before giving up and going matte. */
const LOAD_TIMEOUT_MS = 8000;

const loadImage = (url: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    // The atlas is drawn into a canvas and read back by the GPU as a texture,
    // which taints the canvas unless the fetch is explicitly anonymous CORS.
    img.crossOrigin = "anonymous";
    let done = false;
    const settle = (value: HTMLImageElement | null) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      resolve(value);
    };
    const timer = window.setTimeout(() => settle(null), LOAD_TIMEOUT_MS);
    img.onload = () => settle(img);
    img.onerror = () => settle(null);
    img.src = url;
  });

/**
 * Build the clay atlas texture, or `null` if the origin let us down.
 *
 * Partial success still wins: a missing tile is left as neutral grey, so three
 * of four scans is a slightly flatter grain rather than a dead scene. Only a
 * total failure returns `null`.
 */
export const loadClayTexture = async (
  THREE: Three,
): Promise<import("three").Texture | null> => {
  try {
    const images = await Promise.all(
      CLAY_FILES.map((file) => loadImage(BASE + file)),
    );
    if (images.every((img) => img === null)) return null;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = CLAY_ATLAS;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Mid grey, because the shader treats 0.5 as "no change": an unfilled
    // quadrant then contributes nothing instead of a dark patch.
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, CLAY_ATLAS, CLAY_ATLAS);
    images.forEach((img, i) => {
      if (!img) return;
      const x = (i % 2) * CLAY_TILE;
      const y = Math.floor(i / 2) * CLAY_TILE;
      ctx.drawImage(img, x, y, CLAY_TILE, CLAY_TILE);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    // Sampled as a grain signal, not as colour, but it was authored in sRGB,
    // so decode it as such and the midpoint lands where the shader expects.
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
    texture.needsUpdate = true;
    return texture;
  } catch {
    // Any throw here (blocked image, no canvas 2d, no WebGL) is a reason to go
    // matte, never a reason to take the page down.
    return null;
  }
};
