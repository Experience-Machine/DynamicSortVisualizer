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

#define ALPHA_VALUE_BORDER 0.5

void main() 
{
    vec2 T = vTexCoord.xy;

    // The inverse of the viewport dimensions along X and Y
    vec2 u_viewportInverse = vec2(1.0/100.0, 1.0/80.0);

    // Color of the outline
    vec3 u_color = vec3(1.0, 1.0, 0.0);

    // Thickness of the outline
    const float u_offset = 1.5;

    // Step to check for neighbors
    const float u_step = 1.0;

    float alpha = 0.0;
    bool allin = true;
    for( float ix = -u_offset; ix < u_offset; ix += u_step )
    {
      for( float iy = -u_offset; iy < u_offset; iy += u_step )
       {
          float newAlpha = texture2D(uSampler, T + vec2(ix, iy) * u_viewportInverse).a;
          allin = allin && newAlpha > ALPHA_VALUE_BORDER;
          if (newAlpha > ALPHA_VALUE_BORDER && newAlpha >= alpha)
          {
             alpha = newAlpha;
          }
      }
    }
    if (allin)
    {
        //alpha = 0.0;
        gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
        
    }
    else
    {
        gl_FragColor = vec4(u_color,alpha);
    }
}