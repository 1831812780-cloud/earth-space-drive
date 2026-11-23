import { useEffect, useState } from 'react';
import { Texture, TextureLoader, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';
export type EarthTextures = { day: Texture; clouds: Texture; ocean: Texture };
export function useEarthTextures() {
  const gl = useThree(s => s.gl);
  const [textures, setTextures] = useState<EarthTextures>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const owned: Texture[] = [];
    const mobile = matchMedia('(pointer: coarse)').matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const quality = gl.capabilities.maxTextureSize < 4096 || (memory && memory <= 2) ? '2k' : gl.capabilities.maxTextureSize < 8192 || mobile || (memory && memory <= 4) ? '4k' : '8k';
    async function load(name: string, resolution: string, color = false) {
      let tex: Texture;
      try { tex = await new TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/${name}-${resolution}.jpg`); }
      catch (failure) { if (resolution === '2k') throw failure; tex = await new TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/${name}-2k.jpg`); }
      if (color) tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      owned.push(tex);
      if (cancelled) tex.dispose();
      return tex;
    }
    async function loadLevel(resolution: string) {
      const [day, clouds, ocean] = await Promise.all([
        load('day', resolution, true), load('clouds', resolution), load('ocean', resolution),
      ]);
      if (!cancelled) {
        setTextures({ day, clouds, ocean });
        document.documentElement.dataset.ready = 'true';
        document.documentElement.dataset.textureQuality = resolution;
      }
    }
    // Show the globe before requesting large satellite maps over a public CDN.
    loadLevel('2k').then(() => {
      if (!cancelled && quality !== '2k') return loadLevel(quality).catch(() => {});
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; owned.forEach(t => t.dispose()); };
  }, [gl]);
  if (error) throw new Error('地球纹理加载失败，请刷新页面重试。');
  return textures;
}
