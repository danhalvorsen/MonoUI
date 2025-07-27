# mr-image-processing

A modular image processing library designed with IoC (Inversion of Control) using [tsyringe](https://www.npmjs.com/package/tsyringe). This library enables flexible, pipeline-based image transformations and seamless integration with web and 3D components.

## Features

- **Pipeline Architecture:** Compose image processing steps as reusable "pipes" in a pipeline.
- **IoC Ready:** Built with tsyringe for easy dependency injection and testability.
- **Web & 3D Integration:** Output can be rendered in both web components and Three.js scenes.
- **Extensible:** Easily add new pipes for custom image processing tasks.

## Dependencies

- [mr-web-components]() — Render processed images as web components.
- [mr-threejs-components]() — Use processed images as textures or objects in Three.js.
- [pipeline-core]() — Core pipeline logic for chaining processing steps.
- [tsyringe](https://www.npmjs.com/package/tsyringe) — Dependency injection.
- (Planned) Image pipes module for reusable image processing steps.

## Motivation

- **Modular Processing:** Process images through a series of modular, testable steps.
- **Flexible Rendering:** Display results in web components or as textures in Three.js, supporting advanced features like layering, transformation, blending, and animation.
- **Separation of Concerns:** Keep processing logic independent from rendering logic, making the library easy to extend and maintain.

---

*This library is ideal for applications that require dynamic, extensible image processing pipelines with modern web and