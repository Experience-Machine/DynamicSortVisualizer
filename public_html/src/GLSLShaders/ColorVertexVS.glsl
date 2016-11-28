// For NetBeans Syntax Highlight: http://plugins.netbeans.org/plugin/46515/glsl-syntax-highlighter 
//
// This is the vertex shader 
attribute vec3 aSquareVertexPosition;  // Vertex shader expects one vertex position
attribute vec4 aVertexColorValue;

// to transform the vertex position
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

// passing to fragment shader
varying vec4 vColorValue;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelTransform and uViewProjTransform before
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0); 

    vColorValue = aVertexColorValue;
}