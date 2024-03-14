#ifdef WEBGL2

#define IN in
#define OUT out

#ifdef FRAGMENT_SHADER
out vec4 outColor;
#define OUT_COLOR outColor
#endif
#define TEXTURE texture
#define TEXTURE_CUBE texture

#else

#ifdef FRAGMENT_SHADER
#define IN varying
#else
#define IN attribute
#endif
#define OUT varying
#define TEXTURE texture2D
#define TEXTURE_CUBE textureCube

#ifdef FRAGMENT_SHADER
#define OUT_COLOR gl_FragColor
#endif

#endif
