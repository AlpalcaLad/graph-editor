//
// Simple passthrough fragment shader
//
varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform float hits[25];
uniform float spriteSize[2];

void main()
{
	/*
	loop through all of the hits
	if hit is set to true
	if distance to hit coordinate <0.2 paint lightly red
	if distance to hit coordinate <0.1 paint more red
	*/
    gl_FragColor = v_vColour * texture2D( gm_BaseTexture, v_vTexcoord );
	float xGran = spriteSize[0];
	float yGran = spriteSize[1];
	for (int i=0; i<5; i++){
		for (int j=0; j<5; j++){
			if (hits[i*5+j]>0.5){
				float pixelDist = sqrt(
					pow(floor(v_vTexcoord.x*xGran)/xGran - float(i)/5.,2.) + 
					pow(floor(v_vTexcoord.y*yGran)/yGran - float(j)/5.,2.)
				);
				
				if (pixelDist < 0.2){
					gl_FragColor = vec4(
						gl_FragColor.r*1.4,
						gl_FragColor.g/1.4,
						gl_FragColor.b/1.4,
						gl_FragColor.a
					);
				}
				if (pixelDist < 0.1){
					gl_FragColor = vec4(
						gl_FragColor.r*1.4,
						gl_FragColor.g/1.4,
						gl_FragColor.b/1.4,
						gl_FragColor.a
					);
				}
				
			}
		}
	}
}
