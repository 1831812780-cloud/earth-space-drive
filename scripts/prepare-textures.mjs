import sharp from 'sharp';
for (const [name,source] of [['day','day-8k.jpg'],['clouds','clouds-8k.jpg'],['ocean','ocean-source.tif']]) {
 for (const [quality,width] of [['2k',2048],['4k',4096],['8k',8192]]) {
  if (source === `${name}-${quality}.jpg`) continue;
  await sharp(`public/textures/${source}`).resize({width,withoutEnlargement:true}).jpeg({quality:92}).toFile(`public/textures/${name}-${quality}.jpg`);
 }
}
