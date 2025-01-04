import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDMemoCardProps {
    title: string;
    content: string;
}

const ThreeDMemoCard: React.FC<ThreeDMemoCardProps> = ({ title, content }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const geometry = new THREE.BoxGeometry(1, 1.5, 0.1);
        // Using MeshBasicMaterial instead of MeshStandardMaterial
        const material = new THREE.MeshBasicMaterial({
            color: 0x0077ff,
            side: THREE.DoubleSide
        });
        const card = new THREE.Mesh(geometry, material);
        scene.add(card);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        // Access position through Object3D
        light.position.set(5, 5, 5);
        scene.add(light);

        // Access position through Object3D
        camera.position.set(0, 0, 5);

        const animate = () => {
            requestAnimationFrame(animate);
            // Access rotation through Object3D
            card.rotation.set(
                card.rotation.x,
                card.rotation.y + 0.01,
                card.rotation.z
            );
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '100vh', backgroundColor: '#121212' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white' }}>
                <h1>{title}</h1>
                <p>{content}</p>
            </div>
        </div>
    );
};

export default ThreeDMemoCard;
