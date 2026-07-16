import { useEffect, useRef } from 'react';

/**
 * Fixed full-viewport animated background:
 * Renders an interactive canvas-based coordinate map network of nodes,
 * connecting paths, data pulses, mouse-following spotlights, and click ripples,
 * layered with topographic contours and film grain.
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, px: -1000, py: -1000 });
  const ripplesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; opacity: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      if (mouseRef.current.px === -1000) {
        mouseRef.current.px = e.clientX;
        mouseRef.current.py = e.clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        opacity: 0.8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);

    // Node particle definition
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      originalX: number;
      originalY: number;
    }

    const nodeCount = Math.min(45, Math.floor((width * height) / 22000));
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        originalX: x,
        originalY: y,
      });
    }

    // Light pulses traversing connections
    interface Pulse {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
    }

    const pulses: Pulse[] = [];
    const maxPulses = 7;

    const findConnections = (nodeIndex: number) => {
      const connections: number[] = [];
      const node = nodes[nodeIndex];
      for (let j = 0; j < nodes.length; j++) {
        if (nodeIndex === j) continue;
        const other = nodes[j];
        const dist = Math.hypot(node.x - other.x, node.y - other.y);
        if (dist < 150) {
          connections.push(j);
        }
      }
      return connections;
    };

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate cursor
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.px += (mouse.x - mouse.px) * 0.08;
        mouse.py += (mouse.y - mouse.py) * 0.08;

        // Draw ambient cursor glow (spotlight effect)
        const gradient = ctx.createRadialGradient(
          mouse.px,
          mouse.py,
          0,
          mouse.px,
          mouse.py,
          260
        );
        // Deep blue and cyan light leakage behind contents
        gradient.addColorStop(0, 'rgba(58, 147, 255, 0.12)');
        gradient.addColorStop(0.5, 'rgba(45, 212, 230, 0.035)');
        gradient.addColorStop(1, 'rgba(5, 7, 13, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Update and draw ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 3.5;
        ripple.opacity -= 0.018;

        if (ripple.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(95, 233, 240, ${ripple.opacity * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update nodes
      nodes.forEach((node) => {
        // Base drift velocity
        node.x += node.vx;
        node.y += node.vy;

        // Boundary wrap-around / bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Interact with Mouse (Attraction)
        if (mouse.active) {
          const dx = mouse.px - node.x;
          const dy = mouse.py - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            // Smoothly slide towards cursor
            const force = (220 - dist) / 220;
            node.x += (dx / dist) * force * 0.45;
            node.y += (dy / dist) * force * 0.45;
          }
        }

        // Interact with ripples (repelled outwards)
        ripples.forEach((ripple) => {
          const dx = node.x - ripple.x;
          const dy = node.y - ripple.y;
          const dist = Math.hypot(dx, dy);
          const rippleThickness = 35;

          if (Math.abs(dist - ripple.radius) < rippleThickness) {
            const pushFactor = (rippleThickness - Math.abs(dist - ripple.radius)) / rippleThickness;
            const force = pushFactor * ripple.opacity * 4.5;
            node.x += (dx / (dist || 1)) * force;
            node.y += (dy / (dist || 1)) * force;
          }
        });
      });

      // Draw Connections (Constellation paths)
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

          if (dist < 140) {
            let baseOpacity = ((140 - dist) / 140) * 0.08;

            // Highlight connections inside the mouse spotlight
            if (mouse.active) {
              const mouseDistA = Math.hypot(mouse.px - nodeA.x, mouse.py - nodeA.y);
              const mouseDistB = Math.hypot(mouse.px - nodeB.x, mouse.py - nodeB.y);
              if (mouseDistA < 220 || mouseDistB < 220) {
                const mouseForce = Math.max((220 - mouseDistA) / 220, (220 - mouseDistB) / 220);
                baseOpacity += mouseForce * 0.14;
              }
            }

            ctx.strokeStyle = `rgba(90, 178, 255, ${baseOpacity})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      nodes.forEach((node) => {
        let nodeColor = 'rgba(90, 178, 255, 0.35)';
        let size = node.radius;

        if (mouse.active) {
          const mouseDist = Math.hypot(mouse.px - node.x, mouse.py - node.y);
          if (mouseDist < 220) {
            const force = (220 - mouseDist) / 220;
            size += force * 1.25;
            nodeColor = `rgba(95, 233, 240, ${0.35 + force * 0.45})`;
          }
        }

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw sub-glow for active nodes
        if (size > 2.8) {
          ctx.fillStyle = 'rgba(95, 233, 240, 0.08)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Spawn pulses dynamically along connections
      if (pulses.length < maxPulses && Math.random() < 0.015) {
        const fromIndex = Math.floor(Math.random() * nodes.length);
        const connections = findConnections(fromIndex);
        if (connections.length > 0) {
          const toIndex = connections[Math.floor(Math.random() * connections.length)];
          const exists = pulses.some((p) => p.fromIndex === fromIndex && p.toIndex === toIndex);
          if (!exists) {
            pulses.push({
              fromIndex,
              toIndex,
              progress: 0,
              speed: 0.007 + Math.random() * 0.008,
            });
          }
        }
      }

      // Update and Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        const nodeA = nodes[pulse.fromIndex];
        const nodeB = nodes[pulse.toIndex];

        if (pulse.progress >= 1 || !nodeA || !nodeB) {
          pulses.splice(i, 1);
          continue;
        }

        const px = nodeA.x + (nodeB.x - nodeA.x) * pulse.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * pulse.progress;

        // Pulse glow point
        const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 5);
        pulseGrad.addColorStop(0, 'rgba(95, 233, 240, 0.9)');
        pulseGrad.addColorStop(0.5, 'rgba(90, 178, 255, 0.5)');
        pulseGrad.addColorStop(1, 'rgba(90, 178, 255, 0)');
        ctx.fillStyle = pulseGrad;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Base Dark Theme */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* Interactive canvas system */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Panning grid backdrop */}
      <div className="absolute inset-0 map-grid-pan opacity-15" />

      {/* Topographic contour layer with slightly higher visibility */}
      <div className="absolute inset-0 topo-bg opacity-[0.12]" />

      {/* Large drifting gradient depth blurs */}
      <div className="absolute -top-32 left-[10%] h-[500px] w-[500px] rounded-full bg-accent-500/5 blur-[120px] animate-drift-1" />
      <div className="absolute top-[35%] right-[5%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px] animate-drift-2" />
      <div className="absolute bottom-[5%] left-[25%] h-[450px] w-[450px] rounded-full bg-accent-600/3 blur-[110px] animate-drift-3" />

      {/* Film grain overlay */}
      <div className="absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950/40" />
    </div>
  );
}
