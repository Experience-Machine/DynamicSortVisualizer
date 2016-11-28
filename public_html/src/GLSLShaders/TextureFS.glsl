// this is the fragment (or pixel) shader that 
// outputs constant red color for every pixel rendered.

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of pixel
uniform vec4 uPixelColor;  

// coming from Vertex Shader
varying vec4 vColorValue;
varying vec2 vTexCoord;

void main(void) {
    // now do texture lookup with the web-gl utility
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    // what would this show?
    //       c = vec4(vTexCoord.s, vTexCoord.t, 0, 1);

    // for every pixel called sets to the user specified color
    gl_FragColor = c;  // or what every you want to do!
        // gl_FragColor = c * vColorValue;
        // gl_FragColor = uPixelColor + * (c * vColorValue);
}