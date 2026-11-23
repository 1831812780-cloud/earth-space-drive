# 纹理来源与许可

全部纹理由 Solar System Scope / INOVE 提供，https://www.solarsystemscope.com/textures/ 。
许可：Creative Commons Attribution 4.0 International (CC BY 4.0)，https://creativecommons.org/licenses/by/4.0/ 。允许使用、改编和再分发，包括商业用途；应保留署名、许可链接并指出修改，不暗示原作者认可本项目。

- `day-8k.jpg`：原始 `8k_earth_daymap.jpg`，8192×4096，基于 NASA Blue Marble 影像和地理数据的合成纹理。
- `clouds-8k.jpg`：原始 `8k_earth_clouds.jpg`，8192×4096，全球云层合成纹理。
- `ocean-source.tif`：原始 `2k_earth_specular_map.tif`，海洋反射遮罩；只提供 2K 原始精度，其 4K/8K 文件不增加源数据精度。
- 2K、4K 变体由 `scripts/prepare-textures.mjs` 使用 Lanczos 缩小并重新编码；海洋遮罩转换为 JPEG。

下载根地址：https://www.solarsystemscope.com/textures/download/ 。资源本地托管，运行不依赖第三方网络。

这些是经过调整的静态合成图，不代表实时天气、单一时间点或完全未经修饰的摄影。没有 AI 生成大陆。发行或移植时请随产品保留本说明及许可署名；本作品默认不显示覆盖画面的署名。

## 月球

`moon-2k.jpg`：Solar System Scope / INOVE，原始下载 https://www.solarsystemscope.com/textures/download/2k_moon.jpg ，2048×1024。与上述纹理相同，CC BY 4.0；NASA 影像数据衍生，不使用生成式地形。

## 驾驶舱前景

`public/images/cockpit.png`：由用户提供的 `Astronaut Driving Toward Earth.png` 经内置 image_gen 编辑生成的透明前景；保留驾驶舱与双手，移除窗外地球。提示词记录在 `public/images/PROMPT.txt`。它不是 NASA 素材，不适用上述 CC BY 声明；原图权利归其权利人。

## 手势驾驶资源

- `cockpit-base.png`、`steering-hands.png`：内置 image_gen 编辑用户提供的驾驶舱图片，分别保留固定车体与双手/方向盘，提示词在 `public/images/PROMPT.txt`。不是 NASA 素材。
- MediaPipe Tasks Vision：Google，npm 包版本见 `package-lock.json`，Apache 2.0，许可证随包保存在 `public/mediapipe/LICENSE`。`vision_bundle.js` 与 WASM 是 npm 包的本地复制，不是手写应用代码。
- Hand Landmarker float16 v1：Google 官方模型地址 `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`。说明与模型参考：`https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker`。图像处理在浏览器本地执行。

## 音乐

`public/audio/space-oddity-mitty-mix.mp3`：用户于本会话提供的本地文件 `Space Oddity (Mitty Mix) - David Bowie, Kristen Wiig (128k).mp3` 的原样副本，时长约 311 秒。音乐及录音权利归相应权利人，不属于地球纹理 CC BY 许可。应用当前默认播放此文件，不再连接 YouTube。

`output/playwright/test-tone.wav` 是前次验证结束事件所用的短测试音，不是产品默认音乐。
