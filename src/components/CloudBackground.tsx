import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uSunColor;
uniform vec3 uAmbientColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;

// 3D Hash
float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return -1.0 + 2.0 * fract((p.x + p.y) * p.z);
}

// 3D Noise
float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(
            mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), u.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x),
            u.y
        ),
        mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x),
            u.y
        ),
        u.z
    );
}

// 3D FBM for zooming clouds
float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
        f += w * noise(p);
        p *= 2.0;
        w *= 0.5;
    }
    return f * 0.5 + 0.5; // Map to [0, 1]
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.25; // Speed of flying into the clouds
    
    // Background Sky
    vec3 sky = mix(uSkyHorizon, uSkyZenith, uv.y);
    vec3 col = sky;

    // Sun config for volumetric shading is now passed via uniforms
    vec2 sunPos = vec2(1.0, 2.0); // Light coming from top right

    // Render 4 massive layers of overlapping parallax cumulus clouds
    for(float i = 1.0; i <= 4.0; i++) {
        // Zooming forward into the clouds by progressing the Z-axis of the 3D noise
        vec2 cp2d = p * (0.8 + i * 0.4); // Scale decreases for foreground
        cp2d.y -= i * 0.15 - 0.5;      // Shift layers vertically
        
        vec3 cp = vec3(cp2d, -t * (0.5 + i * 0.25)); // Move forward through the noise

        // Generate cloud density map using 3D FBM
        float d = fbm(cp);
        
        // Threshold for puffiness. Lower threshold = larger clouds.
        float threshold = 0.45 - i * 0.04; 
        
        // This smoothstep creates the hard, rounded puffy edges characteristics of cumulus
        float cloudAlpha = smoothstep(threshold, threshold + 0.15, d);
        
        if (cloudAlpha > 0.0) {
            // Fake volumetric lighting: sample the density slightly closer to the sun.
            vec3 lightDir = normalize(vec3(sunPos - p, 0.5));
            float shadowSample = fbm(cp + lightDir * 0.15); 
            
            // "thickness" measures how much cloud is between us and the light.
            float thickness = smoothstep(threshold - 0.1, threshold + 0.3, shadowSample);
            
            // Mix between shadow color and bright sunlit color based on exposure to 'sun'
            vec3 cloudCol = mix(uSunColor, uAmbientColor, thickness * 1.2);
            
            // Add delicate subsurface scattering / silver lining rim light at the very edges
            float rimLight = smoothstep(threshold + 0.05, threshold, d);
            cloudCol += uSunColor * rimLight * 0.6;

            // Blend this layer over the sky/previous clouds
            col = mix(col, cloudCol, cloudAlpha * 0.95);
        }
    }

    // Very subtle beautiful vignette to frame the scene
    float dist = length(uv - 0.5);
    float vignette = 1.0 - smoothstep(0.4, 1.0, dist);
    col = mix(col, col * vignette, 0.4); // Light vignette effect

    gl_FragColor = vec4(col, 1.0);
}
`;

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const ShaderPlane = ({ variant }: { variant: 'light' | 'dark' }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size } = useThree();

    const uniforms = useMemo(() => {
        // Light mode (Platform): Bright, clean, white clouds with light blue/grey shadows
        const lightModeUniforms = {
            uSunColor: new THREE.Color(1.0, 1.0, 1.0),
            uAmbientColor: new THREE.Color(0.85, 0.9, 0.95), // Bright clouds
            uSkyZenith: new THREE.Color(0.8, 0.9, 1.0),      // Very pale sky
            uSkyHorizon: new THREE.Color(0.9, 0.95, 1.0),
        };

        // Dark mode (Loading): Moody, deep blue skies with heavy dark shadows
        const darkModeUniforms = {
            uSunColor: new THREE.Color(1.0, 1.0, 1.0),
            uAmbientColor: new THREE.Color(0.4, 0.5, 0.6),   // Dark heavy clouds
            uSkyZenith: new THREE.Color(0.3, 0.55, 0.8),     // Deep sky blue
            uSkyHorizon: new THREE.Color(0.6, 0.75, 0.9),
        };

        const activeConfig = variant === 'light' ? lightModeUniforms : darkModeUniforms;

        return {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uSunColor: { value: activeConfig.uSunColor },
            uAmbientColor: { value: activeConfig.uAmbientColor },
            uSkyZenith: { value: activeConfig.uSkyZenith },
            uSkyHorizon: { value: activeConfig.uSkyHorizon },
        };
    }, [size, variant]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
};

export const CloudBackground = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) => {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
            <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 1]}>
                <ShaderPlane variant={variant} />
            </Canvas>
        </div>
    );
};
