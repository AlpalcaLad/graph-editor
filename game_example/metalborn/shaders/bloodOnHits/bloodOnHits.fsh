//
// Simple passthrough fragment shader
//
varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform bool hits[25];

void main()
{
    gl_FragColor = v_vColour * texture2D( gm_BaseTexture, v_vTexcoord );
	for (int i=0; i<5; i++){
		for (int j=0; j<5; j++){
			//if (v_vTexcoord.x*5
		}
	}
}
