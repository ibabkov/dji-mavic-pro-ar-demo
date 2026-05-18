# DJI Mavic Pro AR Demo

An interactive online demo showcasing an animated 3D model of the DJI Mavic Pro drone hovering in augmented reality (AR). This AR experience is mobile-exclusive.

## Main Features

- Augmented Reality(AR) allows users to interact with the drone in their real-world environment
- Optimized for mobile browsers without WebXR support
- High-quality glb model of the DJI Mavic Pro, complete with animations
- Users can move around the drone to view it from any angle
- 8thWall provides reliable SLAM (Simultaneous Localization and Mapping)

## Before starting

- Remove all TODOs
- Change APP_TITLE, APP_DESCRIPTION in README.md
- Change name in package.json
- Remove this section

## Getting Started

First, run the development server:

```bash
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Why 8thWall?

- **Reliable SLAM**: Provides the most stable world-tracking for web-based AR applications
- **Safari Compatibility**: Ensures a seamless experience on Safari, covering a significant user base
- **Better Performance**: Superior stability compared to alternatives like AR.js and ZapWorks

## How to access

Since this project is hosted on 8thWall's free-tier infrastructure,
the demo can only be viewed via a live deployment.

1. Open the demo on your mobile device: [ibabkov.com/projects/dji-mavic-pro-ar-demo/](http://www.ibabkov.com/projects/dji-mavic-pro-ar-demo/)
2. Grant camera & motion access when prompted
3. Hold your phone up straight
4. Move around the model to view it from all angles

## 8thWall references

- [8thwall.org/docs/api/engine](https://8thwall.org/docs/api/engine) — engine API reference
- [github.com/8thwall/8thwall](https://github.com/8thwall/8thwall) — open-source packages: [`packages/xrextras`](https://github.com/8thwall/8thwall/tree/main/packages/xrextras), [`packages/landing-page`](https://github.com/8thwall/8thwall/tree/main/packages/landing-page), [`packages/ecs`](https://github.com/8thwall/8thwall/tree/main/packages/ecs)
- [github.com/8thwall/engine](https://github.com/8thwall/engine) — distribution of the closed-source [`@8thwall/engine-binary`](https://www.npmjs.com/package/@8thwall/engine-binary) (WASM tracking runtime)
