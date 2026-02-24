import React, { useEffect, useRef } from 'react';
import './CursorEffect.css';

const CursorEffect = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });
    const raf = useRef(null);
    const hovering = useRef(false);

    useEffect(() => {
        const dot = dotRef.current;
        const ringEl = ringRef.current;
        if (!dot || !ringEl) return;

        /* ── move dot immediately ── */
        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
            dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        };

        /* ── smooth ring follows ── */
        const animate = () => {
            ring.current.x += (pos.current.x - ring.current.x) * 0.12;
            ring.current.y += (pos.current.y - ring.current.y) * 0.12;
            ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
            raf.current = requestAnimationFrame(animate);
        };
        raf.current = requestAnimationFrame(animate);

        /* ── hover state on interactive elements ── */
        const setHover = () => {
            if (hovering.current) return;
            hovering.current = true;
            dot.classList.add('cursor-dot--hover');
            ringEl.classList.add('cursor-ring--hover');
        };
        const clearHover = () => {
            hovering.current = false;
            dot.classList.remove('cursor-dot--hover');
            ringEl.classList.remove('cursor-ring--hover');
        };

        const addHoverListeners = () => {
            document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, .lp-book-card, .lp-blog-card, .lp-what__card')
                .forEach(el => {
                    el.addEventListener('mouseenter', setHover);
                    el.addEventListener('mouseleave', clearHover);
                });
        };
        addHoverListeners();

        /* ── click burst ── */
        const onClick = (e) => {
            spawnParticles(e.clientX, e.clientY);
            dot.classList.add('cursor-dot--click');
            setTimeout(() => dot.classList.remove('cursor-dot--click'), 300);
        };

        /* ── particle burst ── */
        const spawnParticles = (x, y) => {
            const count = 8;
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'cursor-particle';
                const angle = (i / count) * 360;
                const dist = 28 + Math.random() * 20;
                const dx = Math.cos((angle * Math.PI) / 180) * dist;
                const dy = Math.sin((angle * Math.PI) / 180) * dist;
                p.style.cssText = `left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px`;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 600);
            }
        };

        /* ── hide/show on leave/enter window ── */
        const onLeave = () => { dot.style.opacity = '0'; ringEl.style.opacity = '0'; };
        const onEnter = () => { dot.style.opacity = '1'; ringEl.style.opacity = '1'; };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('click', onClick);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('click', onClick);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
            <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
        </>
    );
};

export default CursorEffect;
