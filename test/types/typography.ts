// From https://openprocessing.org/sketch/2523015
import '../../types/global'

let font: p5.Font
const txt = 'p5.js'

async function setup() {
	createCanvas(windowWidth, windowHeight);
	font = await loadFont('https://fonts.gstatic.com/s/sniglet/v17/cIf4MaFLtkE3UjaJ_ImHRGEsnIJkWL4.ttf')
}

let prevTxt = ''
let prevTxtTime = 0
function draw() {
	if (txt !== prevTxt) {
		prevTxt = txt
		prevTxtTime = millis()
	}
	const progress = pow(map(millis(), prevTxtTime, prevTxtTime + 2000, 0, 1, true), 0.5)
	
	const contours = font.textToContours(txt, 0, 0, { sampleFactor: 1 })
	
	background(0)
	textAlign(CENTER, CENTER)
	textSize(120)
	textFont(font)
	translate(width/2, height/2)
	scale(min(width, height)/300)
	const w = max(10, fontWidth(txt))
	scale((width * 0.2) / w)
	
	beginShape()
	for (const contour of contours) {
		beginContour()
		for (const pt of contour) {
			vertex(pt.x, pt.y)
		}
		endContour(CLOSE)
	}
	endShape()
	
	push()
	strokeWeight(0.5)
	stroke('rgb(255,127,228)')
	noFill()

	beginShape(LINES)
	for (const contour of contours) {
		const pts = contour.map((v) => createVector(v.x, v.y))
		if (pts[0].dist(pts.at(-1)) === 0) pts.pop()
		const dists = pts.map((pt, i) => max(1e-6, pt.dist(pts[(i+1)%pts.length])))
		
		let tangents = pts.map((v, i) => pts[(i+1)%pts.length].copy().sub(v).div(dists[i]))
		for (let it = 0; it < 2; it++) {
			tangents = tangents.map(
				(tangent, i) =>
					tangent.copy()
						.add(tangents[(i-1+pts.length)%pts.length])
						.add(tangents[(i+1)%pts.length])
						.mult(1/3)
			)
		}
		
		const ks = tangents.map((t, i) => tangents[(i+1)%pts.length].copy().sub(t))
		
		pts.forEach((pt, i) => {
			vertex(pt.x, pt.y)
			vertex(pt.x + ks[i].x * -120 * progress, pt.y + ks[i].y * -120 * progress)
		})
	}
	endShape()
	pop()
}
