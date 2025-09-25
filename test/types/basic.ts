import '../../types/global.d.ts'

let geom: p5.Geometry

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)
}

function regenerate() {
	if (geom) {
		freeGeometry(geom)
	}
	geom = buildGeometry(() => {
		let n = round(random(5, 20))
		for (let i = 0; i <= n; i++) {
			push()
			translate(
				random(-1, 1)*width*0.05,
				map(i, 0, n, height*0.4, -height*0.4) + random(-1,1)*height*0.05
			)
			rotateX(PI/2 + random(-1, 1) * PI * 0.15)
			rotateZ(random(-1, 1) * PI * 0.15)
			torus(
				random(0.1, 0.3) * width,
				random(0.01, 0.05) * width,
				50,
				30
			)
			pop()
		}
	})
	geom.clearColors()
}

let lastScene = -1
function draw() {
	const period = 8000
	
	const ms = millis()
	const scene = floor(ms / period)
	if (scene !== lastScene) {
		regenerate()
		lastScene = scene
	}
	
	const t = (ms % period)/period
	background(0)
	orbitControl()
	const s = map(t, 0, 0.2, 0, 1, true) * map(t, 0.8, 1, 1, 0, true)
	directionalLight(s*255, s*255, s*255, -0.4, 0, 1)
	directionalLight(s*255, s*255, s*255, 0.4, 0, 1)
	directionalLight(s*255, s*255, s*255, 0, -0.4, 1)
	directionalLight(s*255, s*255, s*255, 0, 0.4, 1)
	noStroke()
	fill(100)
	specularMaterial(255)
	shininess(400)
	scale(0.8)
	rotateY(millis() * 0.0001)
	model(geom)
}
