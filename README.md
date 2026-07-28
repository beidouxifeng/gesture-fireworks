# 🎆 掌上烟花 — 手势识别烟花特效

> 挥挥手，就能放烟花！基于 MediaPipe 手势识别 + Canvas 粒子系统的实时交互式烟花模拟器。

![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Tech](https://img.shields.io/badge/tech-MediaPipe%20%7C%20Canvas-orange)

---

## ✨ 效果展示

打开摄像头，做出 **握拳 → 张开手掌** 的手势，烟花就会在你手掌所在的位置绽放！

| 手势 | 效果 |
|------|------|
| ✊ 握拳 | 蓄力准备 |
| 🖐️ 张开手掌 | 🎆 发射烟花！ |

---

## 🚀 快速开始

### 1. 运行项目

直接用浏览器打开 `index.html` 即可：

```bash
# 方式一：直接打开
start index.html

# 方式二：用本地服务器（推荐，避免跨域问题）
npx serve .
# 或
python -m http.server 8000
```

> ⚠️ **注意**：因为需要调用摄像头，浏览器可能会弹出权限请求，请点击 **"允许"**。

### 2. 使用说明

1. 打开页面后，右上角会出现摄像头预览窗口
2. 面对摄像头，做出 **握拳** 手势
3. 然后 **张开手掌**，烟花就会在你手掌位置绽放！
4. 摄像头窗口可以 **拖动** 到任意位置

---

## 🧠 技术原理

### 手势识别
- 使用 **MediaPipe Hands** 实时检测手部 21 个关键点
- 通过手指指尖与手腕的距离判断手指是否伸出
- 多帧平滑滤波，避免误触发

### 烟花粒子系统
- 基于 Canvas 2D 的高性能粒子引擎
- 支持多种烟花类型：菊花型（Chrysanthemum）、噼啪型（Crackle）
- 包含拖尾效果、闪光（Glitter）、雌蕊（Pistil）子爆炸
- 物理模拟：重力、空气阻力、旋转

---

## 📁 项目结构

```
手势烟花/
├── index.html                 # 主程序：手势识别 + 烟花渲染
├── test-camera.html           # 摄像头调试工具（测试 MediaPipe 是否正常）
├── Firework_Simulator-2.0/    # 烟花模拟器参考项目（Apache 2.0）
│   ├── index.html             # 独立烟花模拟器（鼠标点击发射）
│   ├── js/                    # 核心 JS 引擎
│   ├── css/                   # 样式
│   ├── audio/                 # 音效
│   └── fonts/                 # 字体
├── .gitignore
└── README.md
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **MediaPipe Hands** | 手部关键点检测与手势识别 |
| **Canvas API** | 烟花粒子实时渲染 |
| **WebRTC / getUserMedia** | 摄像头画面采集 |
| **原生 JavaScript** | 全部逻辑，零框架依赖 |

---

## 🙏 致谢

- 烟花粒子引擎参考了 [Firework Simulator v2](https://codepen.io/MillerTime/pen/XgpNwb) (CodePen) 和 [NianBroken/Firework_Simulator](https://github.com/NianBroken/Firework_Simulator)
- 手势识别基于 [Google MediaPipe](https://mediapipe.dev/) 框架
- `Firework_Simulator-2.0/` 目录保留了原始烟花模拟器的完整代码，详见其 [README](./Firework_Simulator-2.0/README.md)

---

## 📄 许可证

本项目基于 [Apache License 2.0](./Firework_Simulator-2.0/LICENSE) 许可证开源。

你可以自由使用、修改和分享本项目的代码，但需保留原始许可证和版权信息。

---

## 🔮 后续计划

- [ ] 支持更多手势（比耶、点赞等触发不同烟花）
- [ ] 双手同时识别，分别控制不同效果
- [ ] 音效反馈
- [ ] PWA 支持，离线可用
- [ ] 移动端适配优化

---

*Made with ❤️ by 北斗 | 2024*
