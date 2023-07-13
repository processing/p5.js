precision mediump float;
varying vec3 localPos;

// the HDR cubemap converted (can be from an equirectangular environment map.)
uniform sampler2D environmentMap;
varying vec2 vTexCoord;

const float PI = 3.141;

vec2 normalToEquirectangular( vec3 v){
    vec2 uv;
    // taking the arctangent of the v.z and v.x components and dividing it by the circumference of a circle
    // Adding 0.5 ensures that the resulting value is in the range [0, 1].
    uv.x = atan(v.z, v.x) / 3.14159 + 0.5;
    // taking the arcsine of the v.y component and dividing it by the half circumference of a circle
    uv.y = asin(v.y) / 3.14159 + 0.5;
  
    
    return uv;
}

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

// vec2 func( vec3 localPos ){
//   // x = r sin(phi) cos(theta)   
//   // y = r cos(phi)  
//   // z = r sin(phi) sin(theta)
//   float phi = acos( localPos.y );
//   // if phi is 0, then there are no x, z components
//   float theta = 0.0;
//   // else 
//   theta = acos(normal.x / sin(phi));
//   float sinTheta = normal.z / sin(phi);
//   if (sinTheta < 0.0) {
//     // Turn it into -theta, but in the 0-2PI range
//     theta = 2.0 * PI - theta;
//   }
  
//   vec2 angles = vec2( theta, phi );
//   return angles;
// }

void main()
{   	 
	// the sample direction equals the hemisphere's orientation
    // vec2 angles = func( localPos );
    // float theta = angles.a;
    // float phi = angles.b;
    // float x = sin(theta) * cos(phi);
    // float y = sin(theta) * sin(phi);
    // float z = cos(theta);
    // vec3 normal = vec3( x, y, z);
    float phi = vTexCoord.x * 2.0 * PI;
    float theta = vTexCoord.y * PI;
    float x = sin(theta) * cos(phi);
    float y = sin(theta) * sin(phi);
    float z = cos(theta);
    vec3 normal = vec3( x, y, z);
  // vec3 normal = abs(vec3( x, y, z));

	// Discretely sampling the hemisphere given the integral's spherical coordinates translates to the following fragment code:
	vec3 irradiance = vec3(0.0);  
	vec3 up	= vec3(0.0, 1.0, 0.0);
	vec3 right = normalize(cross(up, normal));
	up     	= normalize(cross(normal, right));

	//  We specify a fixed sampleDelta delta value to traverse the hemisphere; decreasing or increasing the sample delta will increase or decrease the accuracy respectively.
	const float sampleDelta = 0.025;
	float nrSamples = 0.0;
  
	for(float phi = 0.0; phi < 2.0 * PI; phi += sampleDelta)
	{
    	for(float theta = 0.0; theta < ( 0.5 ) * PI; theta += sampleDelta)
    	{
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
  // gl_FragColor = vec4(normal.x, normal.y, normal.z, 1.0);
    // gl_FragColor = vec4(normal.x, 0.0, 0.0, 1.0);
  // gl_FragColor = vec4(0.0, normal.y, 0.0, 1.0);
  
}