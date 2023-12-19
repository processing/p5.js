precision highp float;
varying vec3 localPos;

// the HDR cubemap converted (can be from an equirectangular environment map.)
uniform sampler2D environmentMap;
varying vec2 vTexCoord;

const float PI = 3.14159265359;

vec2 nTOE( vec3 v ){
  // x = r sin(phi) cos(theta)   
  // y = r cos(phi)  
  // z = r sin(phi) sin(theta)
  float phi = acos( v.y );
  // if phi is 0, then there are no x, z components
  float theta = 0.0;
  // else 
  theta = acos(v.x / sin(phi));
  float sinTheta = v.z / sin(phi);
  if (sinTheta < 0.0) {
    // Turn it into -theta, but in the 0-2PI range
    theta = 2.0 * PI - theta;
  }
  theta = theta / (2.0 * 3.14159);
  phi = phi / 3.14159 ;
  
  vec2 angles = vec2( phi, theta );
  return angles;
}

float random(vec2 p) {
  vec3 p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main()
{   	 
	// the sample direction equals the hemisphere's orientation
  float phi = vTexCoord.x * 2.0 * PI;
  float theta = vTexCoord.y * PI;
  float x = sin(theta) * cos(phi);
  float y = sin(theta) * sin(phi);
  float z = cos(theta);
  vec3 normal = vec3( x, y, z);

	// Discretely sampling the hemisphere given the integral's
  // spherical coordinates translates to the following fragment code:
	vec3 irradiance = vec3(0.0);  
	vec3 up	= vec3(0.0, 1.0, 0.0);
	vec3 right = normalize(cross(up, normal));
	up = normalize(cross(normal, right));

	//  We specify a fixed sampleDelta delta value to traverse
  // the hemisphere; decreasing or increasing the sample delta
  // will increase or decrease the accuracy respectively.
	const float sampleDelta = 0.100;
	float nrSamples = 0.0;
  float randomOffset = random(gl_FragCoord.xy) * sampleDelta;
	for(float rawPhi = 0.0; rawPhi < 2.0 * PI; rawPhi += sampleDelta)
	{
    float phi = rawPhi + randomOffset;
    for(float rawTheta = 0.0; rawTheta < ( 0.5 ) * PI; rawTheta += sampleDelta)
    {
      float theta = rawTheta + randomOffset;
      // spherical to cartesian (in tangent space) // tangent space to world // add each sample result to irradiance
      float x = sin(theta) * cos(phi);
      float y = sin(theta) * sin(phi);
      float z = cos(theta);
      vec3 tangentSample = vec3( x, y, z);
      
      vec3 sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * normal;
        irradiance += (texture2D(environmentMap, nTOE(sampleVec)).xyz) * cos(theta) * sin(theta);
      nrSamples++;
    }
	}
	// divide by the total number of samples taken, giving us the average sampled irradiance.
	irradiance = PI * irradiance * (1.0 / float(nrSamples )) ;
  
 
	gl_FragColor = vec4(irradiance, 1.0);
}