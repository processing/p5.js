// From https://openprocessing.org/sketch/2308573

import '../../types/global'
// Fake matter.js import
declare const Matter: any

let engine: any
let blobs: Blob[] = []
let metaballShader: p5.Shader
let spheremap: p5.Image
let renderer: p5.RendererGL

async function setup() {
	spheremap = await loadImage('https://deckard.openprocessing.org/user67809/visual2181338/h987a85d77bacbc3b232fb87ce6fe440a/dusseldorf_bridge.jpg')
	renderer = createCanvas(600, 600, WEBGL)
	metaballShader = createShader(vert, frag)
	setupScene()
	blobs.push(new Blob(random(-1,1)*100, 50, 100, '#f3e17e'))
	blobs.push(new Blob(random(-1,1)*100, -150, 100, '#dd483c'))
	blobs.push(new Blob(random(-1,1)*100, -350, 50, '#4b8a5f'))
	blobs.push(new Blob(random(-1,1)*100, -550, 50, '#0d150b'))
}

function setupScene() {
	engine = Matter.Engine.create()
	
	const ground = Matter.Bodies.rectangle(0, height / 2 + 30, width, 60, {
    isStatic: true,
  })
  const wallLeft = Matter.Bodies.rectangle(-width/2 - 30, 0, 60, 3 * height, {
    isStatic: true,
  })
  const wallRight = Matter.Bodies.rectangle(width/2 + 30, 0, 60, 3 * height, {
    isStatic: true,
  })
	Matter.World.add(engine.world, [ground, wallLeft, wallRight])
}

function draw() {
	background('#faf8e2')
	// translate(width/2, height/2)
	
	for (const blob of blobs) {
		blob.update()
	}
	Matter.Engine.update(engine, 1000 / 60)
	
	for (const blob of blobs) {
		blob.drawBlob()
	}
}

const BLOB_NODE_SIZE = 20
const BLOB_NODE_R = 15
const BLOB_NODE_AREA = Math.PI * BLOB_NODE_SIZE * BLOB_NODE_SIZE

class Blob {
  c: p5.Color
  nodes: any[]
  springs: any[]
  tex: p5.Image

	constructor(x, y, r, c) {
		this.nodes = []
		this.springs = []
		this.c = color(c)
		this.tex = createImage(20, 20)
		this.tex.loadPixels()
		for (let i = 0; i < this.tex.pixels.length; i++) {
			this.tex.pixels[i] = 255
		}
    // @ts-ignore
		renderer.getTexture(this.tex).setInterpolation(NEAREST, NEAREST)
		
		const a = PI * r * r
		const numBlobs = ceil(a / BLOB_NODE_AREA)
		
		while (this.nodes.length < numBlobs) {
			const rx = random(-r, r)
			const ry = random(-r, r)
			if (Math.hypot(rx, ry) > r) continue
			
			const vert = Matter.Bodies.circle(x + rx, y + ry, BLOB_NODE_R, { inertia: Infinity, friction: 0.015 })
			this.nodes.push(vert)
		}
		
		Matter.World.add(engine.world, this.nodes)
	}
	
	bin(x: number, y: number) {
		return [round(x/80), round(y/80)]
	}
	
	nodeBin(node) {
		return this.bin(node.position.x, node.position.y)
	}
	
	adjacentBins(node) {
		const [x, y] = this.nodeBin(node)
		const bins: [number, number][] = []
		for (const dx of [-1, 0, 1]) {
			for (const dy of [-1, 0, 1]) {
				bins.push([x + dx, y + dy])
			}
		}
		return bins
	}
	
	binKey(bin) {
		return bin.join(',')
	}
	
	binnedNodes() {
		const bins = {}
		for (const node of this.nodes) {
			const binKey = this.binKey(this.nodeBin(node))
			if (!bins[binKey]) {
				bins[binKey] = []
			}
			bins[binKey].push(node)
		}
		return bins
	}
	
	update() {
		Matter.World.remove(engine.world, this.springs)
		this.springs = []
		const bins = this.binnedNodes()
		for (const node of this.nodes) {
			const binsToCheck = this.adjacentBins(node)
			for (const bin of binsToCheck) {
				const key = this.binKey(bin)
				if (!bins[key]) continue
				for (const other of bins[key]) {
					if (other === node) continue
					this.springs.push(Matter.Constraint.create({
						bodyA: node,
						pointA: { x: 0, y: 0 },
						bodyB: other,
						pointB: { x: 0, y: 0 },
						stiffness: map(
							Math.hypot(node.position.x - other.position.x, node.position.y - other.position.y),
							0, 12*BLOB_NODE_SIZE,
							0.02, 0.03,
							true
						),
						damping: 0.001,
						// length: 0,
						length: max(
							2 * BLOB_NODE_SIZE,
							Math.hypot(node.position.x - other.position.x, node.position.y - other.position.y) * 0.975
						),
					}))
				}
			}
		}
		Matter.World.add(engine.world, this.springs)
	}
	
	drawBlob() {
		const minX = Math.min(...this.nodes.map((n) => n.position.x)) - 4 * BLOB_NODE_SIZE
		const maxX = Math.max(...this.nodes.map((n) => n.position.x)) + 4 * BLOB_NODE_SIZE
		const minY = Math.min(...this.nodes.map((n) => n.position.y)) - 4 * BLOB_NODE_SIZE
		const maxY = Math.max(...this.nodes.map((n) => n.position.y)) + 4 * BLOB_NODE_SIZE
		const x = (maxX + minX)/2
		const y = (maxY + minY)/2
		const w = maxX - minX
		const h = maxY - minY
		
		this.nodes.forEach((node, i) => {
			this.tex.pixels[i * 4 + 0] = map(node.position.x, minX, maxX, 0, 255, true)
			this.tex.pixels[i * 4 + 1] = map(node.position.y, minY, maxY, 0, 255, true)
		})
		this.tex.updatePixels()
		
		push()
		translate(x, y)
		noStroke()
		shader(metaballShader)
		metaballShader.setUniform('bbox', [minX, minY, maxX, maxY])
		metaballShader.setUniform('k', BLOB_NODE_SIZE * 3)
		metaballShader.setUniform('numNodes', this.nodes.length)
		metaballShader.setUniform('data', this.tex)
		metaballShader.setUniform('r', BLOB_NODE_R)
    // TODO: make this a public API
    // @ts-ignore
		metaballShader.setUniform('c', this.c.array())
		metaballShader.setUniform('spheremap', spheremap)
		plane(w, h)
		pop()
	}
	
	draw2D() {
		fill(this.c)
		stroke(this.c)
		strokeWeight(2 * BLOB_NODE_R)
		strokeJoin(ROUND)
		const hull = convexHull(this.nodes.map(n => n.position))
		beginShape()
		for (const { x, y } of hull) vertex(x, y)
		endShape(CLOSE)
		
		noStroke()
		fill(0)
		for (const node of this.nodes) {
			circle(node.position.x, node.position.y, BLOB_NODE_R * 2)
		}
	}
}

let vert = `#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out vec2 vTexCoord;

void main() {
  // Apply the camera transform
  vec4 viewModelPosition =
      uModelViewMatrix *
      vec4(aPosition, 1.0);

  // Tell WebGL where the vertex goes
  gl_Position =
      uProjectionMatrix *
      viewModelPosition;  

  // Pass along data to the fragment shader
  vTexCoord = aTexCoord;
}`

let frag = `#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D data;
uniform sampler2D spheremap;
uniform vec4 bbox;
uniform int numNodes;
uniform float k;
uniform float r;
uniform vec4 c;

float opSmoothUnion( float d1, float d2, float k )
{
	float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
	return mix( d2, d1, h ) - k*h*(1.0-h);
}

vec2 nodeCoord(int i) {
	float x = fract(float(i)/20.) + 1./40.;
	float y = floor(float(i)/20.)/20. + 1./40.;
	vec2 pos = texture(data, vec2(x, y)).xy;
	return mix(bbox.xy, bbox.zw, pos);
}

void main() {
	vec2 coord = mix(bbox.xy, bbox.zw, vTexCoord);

	float dist = 100000.;
	float avg = 0.;
	float total = 0.;
	for (int i = 0; i < 400; i++) {
		if (i >= numNodes) break;
		
		float dist2 = length(coord - nodeCoord(i)) - r;
		avg += pow(dist2, 2.);
		total += 1.;
		dist = opSmoothUnion(
			dist,
			dist2,
			k
		);
		// dist = min(dist, dist2);
	}
	avg /= total;
	// vec3 pos = vec3(coord, avg * 0.05);
	vec3 pos = vec3(coord, -40.*smoothstep(0., 2., pow(-dist, .1)));

	vec3 normal = -normalize(cross(dFdx(pos), dFdy(pos)));
	
	vec3 fromCam = normalize(pos - vec3(0., 0., -800.0));
	vec3 n = reflect(
		fromCam,
		normal
	);
	float phi = acos( n.y );
	float theta = 0.0;
	theta = acos(n.x / sin(phi));
	float sinTheta = n.z / sin(phi);
	if (sinTheta < 0.0) {
		// Turn it into -theta, but in the 0-2PI range
		theta = 2.0 * 3.14159 - theta;
	}
	theta = theta / (2.0 * 3.14159);
	phi = phi / 3.14159 ;
	vec2 angles = vec2( fract(theta + 0.25), 1.0 - phi );

	vec3 lightDir = normalize(vec3(-0.3, 0.9, 0.));
	float l = 0.15 * max(0., dot(lightDir, normal)) + 0.85;
	vec3 outColor = c.xyz * l + pow(texture(spheremap, angles).xyz, vec3(4.));
	// outColor = vec3(smoothstep(0., 2., pow(-dist, .15)));
	// outColor = normal;
	
	fragColor = vec4(outColor, 1.) * (1. - smoothstep(0., 0.01, dist));
}`

const comparison = (a: p5.Vector, b: p5.Vector) => {
  return a.x == b.x ? a.y - b.y : a.x - b.x
}

const cross = (a: p5.Vector, b: p5.Vector, o: p5.Vector) => {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}

function convexHull(points: p5.Vector[]) {
  points.sort(comparison)
  const L: p5.Vector[] = []
  for (let i = 0; i < points.length; i++) {
    while (
      L.length >= 2 &&
      cross(L[L.length - 2], L[L.length - 1], points[i]) <= 0
    ) {
      L.pop()
    }
    L.push(points[i])
  }
  const U: p5.Vector[] = []
  for (let i = points.length - 1; i >= 0; i--) {
    while (
      U.length >= 2 &&
      cross(U[U.length - 2], U[U.length - 1], points[i]) <= 0
    ) {
      U.pop()
    }
    U.push(points[i])
  }
  L.pop()
  U.pop()
  return L.concat(U)
}
