// src/features/landing/hooks/useHeroScrollParallax.ts
import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroParallaxRefs {
  sectionRef: RefObject<HTMLElement | null>;
  bgLayerRef: RefObject<HTMLDivElement | null>;
  leftLayerRef: RefObject<HTMLDivElement | null>;
  rightLayerRef: RefObject<HTMLDivElement | null>;
}

interface BreakpointMotionConfig {
  end: string;
  scrub: number;
  leftXPercent: number;
  leftYPercent: number;
  leftScale: number;
  rightXPercent: number;
  rightYPercent: number;
  rightScale: number;
  bgScale: number;
}

const DESKTOP_CONFIG: BreakpointMotionConfig = {
  end: '+=65%',
  scrub: 1,
  leftXPercent: -36,
  leftYPercent: -2.5,
  leftScale: 1.04,
  rightXPercent: 42,
  rightYPercent: 2.5,
  rightScale: 1.04,
  bgScale: 1.025,
};

const TABLET_CONFIG: BreakpointMotionConfig = {
  end: '+=55%',
  scrub: 1,
  leftXPercent: -34,
  leftYPercent: -2,
  leftScale: 1.03,
  rightXPercent: 40,
  rightYPercent: 2,
  rightScale: 1.03,
  bgScale: 1.02,
};

const MOBILE_CONFIG: BreakpointMotionConfig = {
  end: '+=40%',
  scrub: 0.85,
  leftXPercent: -32,
  leftYPercent: -1.5,
  leftScale: 1.02,
  rightXPercent: 38,
  rightYPercent: 2,
  rightScale: 1.02,
  bgScale: 1.015,
};

/**
 * Sincroniza la separación horizontal y profundidad parallax de las 3 capas del hero
 * con el progreso real del scroll mediante GSAP ScrollTrigger.
 */
export const useHeroScrollParallax = ({
  sectionRef,
  bgLayerRef,
  leftLayerRef,
  rightLayerRef,
}: HeroParallaxRefs): void => {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bgLayer = bgLayerRef.current;
    const leftLayer = leftLayerRef.current;
    const rightLayer = rightLayerRef.current;

    if (!section || !bgLayer || !leftLayer || !rightLayer) {
      return;
    }

    const buildTimeline = (config: BreakpointMotionConfig) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none', force3D: true },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: config.end,
          scrub: config.scrub,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        leftLayer,
        {
          xPercent: config.leftXPercent,
          yPercent: config.leftYPercent,
          scale: config.leftScale,
        },
        0
      )
        .to(
          rightLayer,
          {
            xPercent: config.rightXPercent,
            yPercent: config.rightYPercent,
            scale: config.rightScale,
          },
          0
        )
        .to(
          bgLayer,
          {
            scale: config.bgScale,
          },
          0
        );

      return tl;
    };

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([bgLayer, leftLayer, rightLayer], { clearProps: 'transform' });
    });

    mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      buildTimeline(DESKTOP_CONFIG);
    });

    mm.add('(min-width: 769px) and (max-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      buildTimeline(TABLET_CONFIG);
    });

    mm.add('(max-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      buildTimeline(MOBILE_CONFIG);
    });

    return () => {
      mm.revert();
    };
  }, [sectionRef, bgLayerRef, leftLayerRef, rightLayerRef]);
};

