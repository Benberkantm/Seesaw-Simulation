# Seesaw Simulation

A simple seesaw simulation built with vanilla JavaScript.

## Project Overview

This is a basic seesaw simulation where you can click on the plank to place objects. The seesaw angle changes based on the weight distribution.

**Live Demo:** [benberkantm.github.io/Seesaw-Simulation/](https://benberkantm.github.io/Seesaw-Simulation/)

## Thought Process and Design Decisions

### 1. **Class-Based Architecture**
I chose to implement the simulation using a class-based approach rather than functional programming. This decision was made because:
- EASY TO READ AND CLEAN
- It provides better encapsulation and organization of related functionality
- Easier to maintain and extend in the future
- Easy to adress and test any problem

### 2. **Coordinate System and Rotation**
One of the most challenging aspects was handling coordinate transformations. The seesaw plank rotates, but objects need to be positioned correctly in screen coordinates. I implemented:
- **Pivot-based positioning**: All calculations are relative to the center pivot point
- **Rotation matrix calculations**: Converting screen click coordinates to plank coordinates required rotation matrix transformations
- **Real-time position updates**: Objects maintain their relative position on the plank as it rotates

### 3. **Physics Model**
The simulation uses a simplified torque-based physics model:
- **Torque calculation**: `torque = weight × distance_from_pivot`
- **Angle calculation**: The angle is proportional to the difference between left and right torques, divided by a damping factor (10)
- **Angle limits**: Maximum angle is clamped to ±30 degrees

### 4. **Click Detection**
Implementing accurate click detection on a rotating plank was complex:
- **Coordinate transformation**: Click coordinates need to be rotated back to plank coordinates
- **Tolerance zone**: A `plank_click_tolerance` (20px) allows clicks near the plank to be detected
- **Boundary checking**: Validates that clicks are within the plank length and tolerance zone

### 5. **State Persistence**
I implemented localStorage-based state saving to:
- Preserve user's simulation state across page refreshes
- Store object positions, weights, and sizes

### 6. **Animation Loop**
Using `requestAnimationFrame` for the animation loop ensures:
- Smooth animations
- Efficient browser rendering
- Automatic pausing when the tab is not visible

### 7. **Visual Feedback**
- **Sound effects**: Audio feedback for object creation and reset actions
- **Real-time statistics**: Display of weights, angles, and next weight
- **Logging system**: Tracks all object placements for reference

## Trade-offs and Limitations

### 1. **Simplified Physics Model**
**Trade-off**: The physics simulation is simplified and doesn't account for realistic physics. Even though CSS transitions (`transition: transform 0.4s ease-in-out`) are used for smooth animations, the movement can still feel rough.

### 2. **Vanilla JavaScript Physics Calculations**
**Limitation**: Implementing physics calculations from scratch using vanilla JavaScript was challenging. Without a physics library

## AI-Assisted Sections

### 1. **Coordinate Calculation Optimization** (Lines 44-61)
**AI Assistance**: The `calculateObjectScreenPosition()` function was optimized with AI help.

**Before AI**: I had separate variables for x and y calculations scattered across different functions, making the code harder to maintain.

**After AI**: The function now returns a clean object `{x, y}` with consolidated calculations, improving code organization and readability.

**Code Location**: `script.js` lines 55-57

### 2. **Click Handler Fixes** (Lines 63-95)
**AI Assistance**: The `handleClick()` event handler had multiple issues that AI helped resolve.

**Problems Encountered**:
- Coordinate system misalignment
- Incorrect rotation transformations
- Boundary detection failures
- Click validation logic errors

**AI Contribution**: AI helped fix the rotation matrix calculations for converting screen coordinates to plank coordinates, ensuring accurate click detection even when the plank is rotated.

**Code Location**: `script.js` lines 69-89

**Note**: While AI assisted with debugging and optimization, the overall architecture, physics model, and design decisions were implemented independently.


## File Structure

```
├── index.html          # Main HTML structure
├── script.js           # Core simulation logic
├── style.css           # Styling and layout
└── assets/
    ├── audio/          # Sound effects
    │   ├── creation_effect.mp3
    │   └── reset.mp3
    └── images/         # Visual assets
        ├── anvil.png
        ├── background.jpg
        ├── plank.png
        ├── Red_nail.png
        └── seesaw_logo.png
```

## Features

- ✅ Interactive seesaw with click-to-place objects
- ✅ Real-time physics calculations (torque and angle)
- ✅ Visual feedback with smooth animations
- ✅ Audio feedback for interactions
- ✅ State persistence using localStorage
- ✅ Real-time statistics display
- ✅ Activity logging
- ✅ Reset functionality

## Usage

1. Open `index.html` in a web browser
2. Click anywhere on the seesaw plank to place a weighted object
3. Watch the seesaw balance based on weight distribution
4. View real-time statistics (weights, angles)
5. Use the Reset button to clear all objects

## Author

**Süleyman Berkant Melli**



