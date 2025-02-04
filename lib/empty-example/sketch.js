let geom
let fonts
let artShader
let lineShader

console.warn = () => {}

OPC.text('words', 'WORD ART!')
OPC.select('font', ['Anton', 'Montserrat', 'Source Serif'], 'Anton')
OPC.slider({ name: 'warp', min: 0, max: 3, step: 0.01, value: 1 })
OPC.slider({ name: 'extrude', min: 0, max: 20, step: 0.01, value: 5 })
OPC.palette(
	'palette',
	[
		["#ffe03d", "#fe4830", "#d33033", "#6d358a", "#1c509e", "#00953c"],
		["#021d34", "#228fca", "#dcedf0"],
		["#044e9e", "#6190d3", "#fcf7ed", "#fcd494", "#f4b804"],
		["#0a0a0a", "#f7f3f2", "#0077e1", "#f5d216", "#fc3503"],
	]
)

async function setup() {
	createCanvas(800, 800, WEBGL)
	fonts = {
		Anton: await loadFont('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf'),
		Montserrat: await loadFont('https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf'),
		'Source Serif': await loadFont('https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf'),
	}
	
	artShader = baseMaterialShader().modify({
		uniforms: {
			'float time': () => millis(),
			'float warp': () => warp,
			'float numColors': () => palette.length,
			'vec3[6] colors': () => palette.flatMap((c) => [red(c)/255, green(c)/255, blue(c)/255]),
		},
		vertexDeclarations: 'out vec3 vPos;',
		fragmentDeclarations: 'in vec3 vPos;',
		'Vertex getObjectInputs': `(Vertex inputs) {
			vPos = inputs.position;
			inputs.position.x += 5. * warp * sin(inputs.position.y*0.1 + time*0.001) / (1. + warp);
			inputs.position.y += 5. * warp * sin(inputs.position.x*0.1 + time*0.0009) / (1. + warp);
			return inputs;
		}`,
		'vec4 getFinalColor': `(vec4 _c) {
			float x = vPos.x * 0.005;
			float a = floor(fract(x)*numColors);
			float b = a == numColors-1. ? 0. : a + 1.;
			float t = fract(x*numColors);
			vec3 c = mix(colors[int(a)], colors[int(b)], t);
			return vec4(c, 1.);
		}`
	})
	
	lineShader = baseStrokeShader().modify({
		uniforms: {
			'float time': () => millis(),
			'float warp': () => warp,
		},
		'StrokeVertex getObjectInputs': `(StrokeVertex inputs) {
			inputs.position.x += 5. * warp * sin(inputs.position.y*0.1 + time*0.001) / (1. + warp);
			inputs.position.y += 5. * warp * sin(inputs.position.x*0.1 + time*0.0009) / (1. + warp);
			return inputs;
		}`,
	})
}

let prevWords = ''
let prevFont = ''
let prevExtrude = -1

function draw() {
	if (words !== prevWords || prevFont !== font || prevExtrude !== extrude) {
		if (geom) freeGeometry(geom)
		
		geom = fonts[font].textToModel(words, 0, 50, { sampleFactor: 2, extrude: 0 });
		geom.clearColors()
		geom.normalize()
		
		prevWords = words
		prevFont = font
		prevExtrude = extrude
	}
	
	background(255)
	orbitControl()
	// noStroke()
	shader(artShader)
	strokeShader(lineShader)
	strokeWeight(4)
	scale(min(width,height)/300)
	model(geom)
}