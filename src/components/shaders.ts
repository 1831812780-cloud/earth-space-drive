export const vertex = /* glsl */`
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main() {
 vUv = uv; vNormal = normalize(mat3(modelMatrix) * normal);
 vec4 world = modelMatrix * vec4(position, 1.0); vPosition = world.xyz;
 gl_Position = projectionMatrix * viewMatrix * world;
}`;
export const surface = /* glsl */`
uniform sampler2D dayMap; uniform sampler2D oceanMap; uniform vec3 sun;
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main() {
 vec3 n = normalize(vNormal); vec3 view = normalize(cameraPosition - vPosition);
 float incidence = dot(n, sun);
 float daylight = smoothstep(-0.07, 0.12, incidence);
 vec3 albedo = texture2D(dayMap, vUv).rgb;
 float ocean = texture2D(oceanMap, vUv).r;
 float diffuse = max(incidence, 0.0);
 vec3 color = albedo * (0.006 + 1.22 * diffuse) * daylight;
 vec3 halfway = normalize(sun + view);
 float specular = pow(max(dot(n, halfway), 0.0), 65.0) * 0.13 * ocean * daylight;
 color += vec3(0.93, 0.95, 1.0) * specular;
 gl_FragColor = vec4(color, 1.0);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const clouds = /* glsl */`
uniform sampler2D cloudMap; uniform vec3 sun; uniform float opacity;
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main() {
 float light = max(dot(normalize(vNormal), sun), 0.0);
 float density = texture2D(cloudMap, vUv).r;
 float alpha = smoothstep(0.08, 0.92, density) * opacity;
 gl_FragColor = vec4(vec3(0.006 + light * 1.35), alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const atmosphere = /* glsl */`
uniform vec3 sun; uniform float strength;
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main() {
 vec3 n = normalize(vNormal); vec3 view = normalize(cameraPosition - vPosition);
 float rim = pow(1.0 - abs(dot(n, view)), 7.0);
 float lit = smoothstep(-0.05, 0.65, dot(n, sun));
 gl_FragColor = vec4(vec3(0.23, 0.49, 0.8), rim * lit * strength);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
