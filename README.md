# DJI Mavic Pro AR Demo

An interactive online demo showcasing an animated 3D model of the DJI Mavic Pro drone hovering in augmented reality (AR).
This AR experience is mobile-exclusive.

## Main Features

- Augmented Reality(AR) allows users to interact with the drone in their real-world environment
- Optimized for mobile browsers without WebXR support
- High-quality glb model of the DJI Mavic Pro, complete with animations
- Users can move around the drone to view it from any angle
- 8thWall provides reliable SLAM (Simultaneous Localization and Mapping)

## Project Structure

The source code for this demo is not directly available due to its use of 8thWall's free-tier Studio hosting.
However, the project structure and file copies are provided for reference.

### 3D Scene

- **Scene Object**
  - `src/app.ts`: The primary 8thWall component that manages scene-level states
- **Drone**
  - `src/components/look-at-entity.ts`: Makes an entity rotate around the Y-axis to face a target entity
- **Camera**
  - `camera-controls.ts`: Handles camera states
- **Lighting**
  - Ambient Light
  - Directional Light
- **Ground**

### 2D UI

- **2D Fullscreen**
  - `src/components/ui-fullscreen-visibility.ts`: A component to manage the visibility of the fullscreen UI
- **2D Coaching**
  - `src/components/ui-coaching-visibility.ts`: A component to manage the visibility of the coaching UI

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
