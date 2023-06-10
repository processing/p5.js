# p5.js WEBGL模式架构

本文档描述了p5.js WEBGL模式的结构，供p5.js的贡献者、维护者和其他感兴趣的人参考。如果您对在草图中使用3D图形感兴趣，请查看[此教程](https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5)。

## 结构和对象概述

WEBGL架构中的核心对象包括p5.Renderer.GL、p5.Shader、p5.Texture和p5.Geometry。
p5.Renderer.GL的单个实例管理其自己的p5.Shaders、p5.Textures和p5.Geometry。其中一个目标是允许使用WebGL进行屏幕外渲染，但尚未进行测试。
着色器和纹理与特定的GL上下文关联在一起，通过渲染器进行管理。

### p5.RendererGL
p5.RendererGL对象是p5.js的WEBGL/3D模式渲染器。
它继承自p5.Renderer，提供了2D模式中不可用的额外功能，例如：`box()`，`cone()`，着色器的使用，加速纹理渲染和光照。

* 管理（创建和缓存）着色器（p5.Shader对象）和纹理（p5.Texture对象）
* 通过着色器准备形状的坐标，用作属性数组
* 在调用描边、填充、纹理和各种光照方法时，选择正确的着色器，并向这些着色器提供适当的uniform变量
* 维护与光照有关的数据：使用各种类型的光源及其参数的计数
* 缓存三维基元的几何形状（在保留模式下），除了使用begin/endShape创建的形状，这些形状在每次绘制时都会动态生成并推送到GL中（在即时模式下）。

渲染器负责选择适当的p5.Shader来满足当前的绘图条件。

### p5.Shader
p5.Shader类提供了对GL程序的uniform变量和attribute变量的访问。

* 编译和链接顶点着色器和片元着色器组件
* 提供API来访问和设置着色器的属性和uniform变量
* 在渲染形状之前，绑定着色器所需的纹理
* 提供bindShader()方法，在绘制形状之前使用，在形状绘制之后解绑着色器。

有四个默认的着色器，如着色器部分所述。

### p5.Texture
p5.Texture对象根据`p5.Image`、`p5.MediaElement`、`p5.Element`或`ImageData`管理基于纹理的GL状态。

* 在内部处理基于类型的图像数据处理，这样p5.Renderer的实现在处理纹理时就不需要在自己的方法中做特殊例外。
* 根据情况每帧进行更新，通过猜测图像数据是否发生了变化。如果没有进行更改，则尽量不上传纹理，以提高性能。

### p5.Geometry
在p5.Renderer对象的缓存中，以p5.Geometry对象的形式存储在保留模式下呈现的形状。
渲染器根据绘制的形状和其参数（例如使用`box(70, 80, 90, 10, 20)`创建的盒子的几何形状通过`'box|70|80|90|10|20'`进行映射）将字符串映射到p5.Geometry对象。调用使用保留几何形状的函数时，首次通过创建一个p5.Geometry对象，并使用上述字符串ID将其存储在几何哈希中。后续的调用会在哈希中查找该ID，如果找到则使用它引用现有对象，而不是创建一个新对象。

* 为几何形状的顶点、法线、面、线顶点、线法线和纹理坐标存储数据。
* 提供计算一组顶点的面、法线、线顶点和线法线的方法。

## 即时模式
使用即时模式进行绘制的所有属性都存储在渲染器中的对象中，用于绘制到GL绘图上下文，然后被丢弃。

## 几何形状：保留模式和即时模式
保留几何形状用于3D基本图形，而即时模式用于使用begin/endShape创建的形状。

| 使用保留几何形状的函数 | 使用即时模式几何形状的函数 |
| ---------------------- | -------------------------- |
| plane()                | bezier()                   |
| box()                  | curve()                    |
| sphere()               | line()                     |
| cylinder()             | beginShape()               |
| cone()                 | vertex()                   |
| ellipsoid()            | endShape()                 |
| torus()                | point()                    |
| triangle()             | curveVertex()              |
| arc()                  | bezierVertex()             |
| point()                | quadraticVertex()          |
| ellipse()              |                            |
| rect()                 |                            |
| quad()                 |                            |
| text()                 |                            |






## 纹理管理
p5.Renderer.GL实例按需管理一组p5.Textures对象。
为使用`texture()`方法或作为自定义着色器提供的uniform的图像和视频创建纹理。

当渲染器需要纹理时，首先检查是否已经为给定的图像/视频创建了纹理，然后将其提供给着色器进行渲染。只有在找不到图像/视频的现有纹理时才会创建新的纹理。

## 着色器

### 着色器的类型

#### Color Shader（颜色着色器）
基于当前填充颜色，为对象提供平面着色。

#### Light Shader（用于光照和纹理）
考虑以下内容：
* 由`ambientLight()`、`directionalLight()`、`pointLight()`、`spotLight()`和`specularColor()`设置的光照参数
* 由`ambientMaterial()`、`emissiveMaterial()`和`specularMaterial()`设置的材质参数
* 由`texture()`设置的纹理参数

#### Normal Shader（法线着色器）
在使用`normalMaterial()`时设置法线着色器。它使用表面的法线矢量来确定片段的颜色。

### 着色器参数

#### 标准模型视图和相机uniforms
| 参数                              | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| --------------------------------- | ---------- | -------------- | ---------- | ---------- | -------- |
| `uniform mat4 uModelViewMatrix;`  | x          | x              | x          | x          | x        |
| `uniform mat4 uProjectionMatrix;` | x          | x              | x          | x          | x        |
| `uniform vec4 uViewPort;`         | x          |                |            |            |          |
| `uniform vec4 uPerspective;`      | x          |                |            |            |          |


#### 几何属性和uniforms
| 参数                           | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| ------------------------------ | ---------- | -------------- | ---------- | ---------- | -------- |
| `attribute vec3 aPosition;`    | x          | x              | x          | x          | x        |
| `attribute vec3 aNormal;`      |            | x              |            | x          |          |
| `attribute vec2 aTexCoord;`    |            | x              |            | x          |          |
| `uniform mat3 uNormalMatrix;`  |            | x              |            | x          |          |
| `attribute vec4 aDirection;`   | x          |                |            |            |          |
| `uniform float uStrokeWeight;` | x          |                |            |            |          |

#### 材质颜色
| 参数                           | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| ------------------------------ | ---------- | -------------- | ---------- | ---------- | -------- |
| `uniform vec4 uMaterialColor;` | x          | x              |            |            | x        |
| `attribute vec4 aVertexColor;` |            |                | x          |            |          |

#### 光照参数

| 参数                                          | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| --------------------------------------------- | ---------- | -------------- | ---------- | ---------- | -------- |
| `uniform int uAmbientLightCount;`             |            | x              |            |            |          |
| `uniform int uDirectionalLightCount;`         |            | x              |            |            |          |
| `uniform int uPointLightCount;`               |            | x              |            |            |          |
| `uniform int uSpotLightCount;`                |            | x              |            |            |          |
| `uniform vec3 uAmbientColor[8];`              |            | x              |            |            |          |
| `uniform vec3 uLightingDirection[8];`         |            | x              |            |            |          |
| `uniform vec3 uDirectionalDiffuseColors[8];`  |            | x              |            |            |          |
| `uniform vec3 uDirectionalSpecularColors[8];` |            | x              |            |            |          |
| `uniform vec3 uPointLightLocation[8];`        |            | x              |            |            |          |
| `uniform vec3 uPointLightDiffuseColors[8];`   |            | x              |            |            |          |
| `uniform vec3 uPointLightSpecularColors[8];`  |            | x              |            |            |          |
| `uniform float uSpotLightAngle[8];`           |            | x              |            |            |          |
| `uniform float uSpotLightConc[8];`            |            | x              |            |            |          |
| `uniform vec3 uSpotLightDiffuseColors[8];`    |            | x              |            |            |          |
| `uniform vec3 uSpotLightSpecularColors[8];`   |            | x              |            |            |          |
| `uniform vec3 uSpotLightLocation[8];`         |            | x              |            |            |          |
| `uniform vec3 uSpotLightDirection[8];`        |            | x              |            |            |          |
| `uniform bool uSpecular;`                     |            | x              |            |            |          |
| `uniform bool uEmissive;`                     |            | x              |            |            |          |
| `uniform int  uShininess;`                    |            | x              |            |            |          |
| `uniform bool uUseLighting;`                  |            | x              |            |            |          |
| `uniform float uConstantAttenuation;`         |            | x              |            |            |          |
| `uniform float uLinearAttenuation;`           |            | x              |            |            |          |
| `uniform float uQuadraticAttenuation;`        |            | x              |            |            |          |

#### 纹理参数

| 参数                          | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| ----------------------------- | ---------- | -------------- | ---------- | ---------- | -------- |
| `uniform sampler2D uSampler;` |            | x              |            |            |          |
| `uniform bool isTexture;`     |            | x              |            |            |          |

#### 通用参数

| 参数                         | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| ---------------------------- | ---------- | -------------- | ---------- | ---------- | -------- |
| `uniform float uResolution;` |            |                | x          |            |          |
| `uniform float uPointSize;`  |            |                | x          |            | x        |

#### 变量参数

| 参数                                | 线条着色器 | 纹理光照着色器 | 颜色着色器 | 法线着色器 | 点着色器 |
| ----------------------------------- | ---------- | -------------- | ---------- | ---------- | -------- |
| `varying vec3 vVertexNormal;`       |            | x              |            |            |          |
| `varying vec2 vVertTexCoord;`       |            | x              |            |            |          |
| `varying vec3 vLightWeighting;`     |            | x              |            |            |          |
| `varying highp vec2 vVertTexCoord;` |            |                |            | x          |          |
| `varying vec4 vColor;`              |            |                | x          |            |          |
| `varying float vStrokeWeight`       |            |                |            |            | x        |

## 下一步计划

即将推出！
