import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BlurText from './components/BlurText';
import LiveCVEWidget from './components/LiveCVEWidget';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// CountUp component using intersection observer for high performance
const CountUp = ({ to, duration = 1200, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            setCount(Math.floor(easedProgress * to));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [to, duration, hasAnimated]);

  return (
    <span ref={elementRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export default function App() {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const videoRef = useRef(null);
  const storyCardRef = useRef(null);
  const storyBar1Ref = useRef(null);
  const storyBar2Ref = useRef(null);

  // States for text cycling
  const [storySlide, setStorySlide] = useState(0);
  const [qaIndex, setQaIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Video Play Auto-Trigger
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.warn('Video autoplay blocked:', err));
    }
  }, []);

  // 3D Card Tilt Effect
  useEffect(() => {
    const storyCard = storyCardRef.current;
    if (!storyCard) return;

    let rx = 0, ry = 0, tx = 0, ty = 0;
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tx = nx * 18;
      ty = ny * -12;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const tilt = () => {
      rx += (ty - rx) * 0.08;
      ry += (tx - ry) * 0.08;
      storyCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      animationFrameId = requestAnimationFrame(tilt);
    };

    const timeoutId = setTimeout(tilt, 900);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Story Progress Bars Animation
  useEffect(() => {
    const b1 = storyBar1Ref.current;
    const b2 = storyBar2Ref.current;
    if (!b1 || !b2) return;

    const anim1 = b1.animate(
      [
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(1)', offset: 0.5 },
        { transform: 'scaleX(1)' }
      ],
      { duration: 6000, iterations: Infinity, easing: 'linear' }
    );

    const anim2 = b2.animate(
      [
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(0)', offset: 0.5 },
        { transform: 'scaleX(1)' }
      ],
      { duration: 6000, iterations: Infinity, easing: 'linear' }
    );

    return () => {
      anim1.cancel();
      anim2.cancel();
    };
  }, []);

  // Story Headline Cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setStorySlide((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // VulnScan Q&A Cycling
  const questions = useMemo(
    () => [
      {
        q: 'Scan example.com for vulnerabilities',
        a: 'Running XSS detection, SQL injection tests, and CSRF validation. Scan complete: 0 critical vulnerabilities found. 2 minor warnings flagged for review.'
      },
      {
        q: 'Analyze kernel module for privilege escalation',
        a: 'Hellhound framework loaded. Syscall hooks verified, stack analysis clean. Privilege escalation vectors blocked. System integrity confirmed.'
      },
      {
        q: 'Deploy AetherFlux to OnePlus device',
        a: 'Magisk module injected successfully. Liquid-glass lockscreen clock rendering at 60fps. OxygenOS compatibility verified across 3 build variants.'
      }
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setQaIndex((prev) => (prev + 1) % questions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [questions]);

  // Smooth scroll helper
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  // GSAP animations setup via useGSAP
  useGSAP(() => {
    // ═════════ HERO SECTION ═════════
    gsap.from('.hero-btn', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.hero-card', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.9,
      ease: 'power2.out'
    });

    // Infinite Marquee Loop
    gsap.to('.marquee-inner', {
      x: -430,
      duration: 12,
      ease: 'none',
      repeat: -1
    });
  }, { scope: heroRef });

  useGSAP(() => {
    // ═════════ SKILLS SECTION ═════════
    // Header
    gsap.from('.skills-header h2', {
      scrollTrigger: {
        trigger: '.skills-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.skills-header p', {
      scrollTrigger: {
        trigger: '.skills-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out'
    });

    // Left and Right Grid Cards
    gsap.from('.skills-card-left', {
      scrollTrigger: {
        trigger: '.skills-grid-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: -60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.skills-card-right', {
      scrollTrigger: {
        trigger: '.skills-grid-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Left card progress bars (animate to data-width)
    gsap.fromTo('.progress-bar-fill', 
      { width: 0 },
      {
        scrollTrigger: {
          trigger: '.skills-card-left',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        width: (i, el) => el.getAttribute('data-width') || '100%',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power2.out'
      }
    );

    // Right card sub-elements
    gsap.from('.skills-right-overlay-card', {
      scrollTrigger: {
        trigger: '.skills-card-right',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.from('.web-tech-icon', {
      scrollTrigger: {
        trigger: '.skills-card-right',
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      y: 25,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });

    gsap.from('.skills-right-pill-overlay', {
      scrollTrigger: {
        trigger: '.skills-card-right',
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      scale: 0.85,
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.out'
    });
  }, { scope: skillsRef });

  useGSAP(() => {
    // ═════════ PROJECTS SECTION ═════════
    // Header
    gsap.from('.projects-header h2', {
      scrollTrigger: {
        trigger: '.projects-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.projects-header p', {
      scrollTrigger: {
        trigger: '.projects-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out'
    });

    // 3D Entrance for Project Cards
    gsap.from('.project-card-gsap', {
      scrollTrigger: {
        trigger: '.projects-grid-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 80,
      rotationX: 10,
      opacity: 0,
      duration: 0.9,
      stagger: 0.2,
      transformOrigin: 'top center',
      ease: 'power3.out'
    });

    // Hellhound SVG Chart Drawing
    gsap.fromTo('.hellhound-chart-line',
      { strokeDashoffset: 300, strokeDasharray: 300 },
      {
        scrollTrigger: {
          trigger: '.hellhound-card',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.hellhound-chart-area',
      { opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.hellhound-card',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        duration: 1.4,
        delay: 0.2,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.hellhound-chart-helper-line',
      { strokeDashoffset: 36, strokeDasharray: 36 },
      {
        scrollTrigger: {
          trigger: '.hellhound-card',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        strokeDashoffset: 0,
        duration: 0.5,
        delay: 1.2,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.hellhound-chart-circle',
      { scale: 0 },
      {
        scrollTrigger: {
          trigger: '.hellhound-card',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        scale: 1,
        duration: 0.4,
        delay: 1.5,
        ease: 'back.out(1.8)'
      }
    );

    // AetherFlux SVG compatibility tree drawing
    gsap.fromTo('.aetherflux-tree-path',
      { strokeDashoffset: 200, strokeDasharray: 200 },
      {
        scrollTrigger: {
          trigger: '.aetherflux-card',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power2.out'
      }
    );

    // Scale up tree node circles
    gsap.fromTo('.aetherflux-tree-circle',
      { scale: 0 },
      {
        scrollTrigger: {
          trigger: '.aetherflux-card',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        transformOrigin: 'center center'
      }
    );

    // Staggered fade/scale in tree labels
    gsap.fromTo('.aetherflux-tree-label',
      { opacity: 0, scale: 0.85 },
      {
        scrollTrigger: {
          trigger: '.aetherflux-card',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out'
      }
    );

    // Interactive mouse parallax on .parallax-card inner targets
    const parallaxCards = gsap.utils.toArray('.parallax-card');
    parallaxCards.forEach(card => {
      const target = card.querySelector('.parallax-target');
      if (!target) return;

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) - 0.5;
        const py = (y / rect.height) - 0.5;

        gsap.to(target, {
          x: px * 16,
          y: py * 16,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      const onMouseLeave = () => {
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }, { scope: projectsRef });

  useGSAP(() => {
    // ═════════ ABOUT SECTION ═════════
    // Header
    gsap.from('.about-header h2', {
      scrollTrigger: {
        trigger: '.about-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.about-header p', {
      scrollTrigger: {
        trigger: '.about-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out'
    });

    // Cards entrance
    gsap.from('.about-card-gsap', {
      scrollTrigger: {
        trigger: '.about-cards-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }, { scope: aboutRef });

  useGSAP(() => {
    // ═════════ CONTACT SECTION ═════════
    gsap.from('.contact-header h2', {
      scrollTrigger: {
        trigger: '.contact-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.contact-header p, .contact-btn', {
      scrollTrigger: {
        trigger: '.contact-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, { scope: contactRef });

  return (
    <main className="bg-black text-white antialiased selection:bg-[#00ff88] selection:text-black" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      
      {/* ═══════════════════ NAVIGATION ═══════════════════ */}
      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-8">
        <div className="relative flex h-12 items-center justify-between">
          <a href="#" className="flex items-center gap-2" onClick={(e) => handleScroll(e, 'hero')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[0.75rem] font-bold text-black" style={{ background: 'linear-gradient(135deg,#00ff88,#00d4ff)' }}>S.</div>
            <span className="text-[0.9375rem] font-semibold tracking-tight text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              santhosh<span style={{ color: '#00ff88' }}>_dev</span>
            </span>
          </a>

          {/* Center Navigation Pills */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 md:flex" style={{ background: 'rgba(28,28,28,.75)', borderColor: 'rgba(255,255,255,.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className="rounded-full px-4 py-2 text-[0.875rem] font-normal text-white/80 transition-all hover:bg-white/10">Skills</a>
            <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="rounded-full px-4 py-2 text-[0.875rem] font-normal text-white/80 transition-all hover:bg-white/10">Projects</a>
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="rounded-full px-4 py-2 text-[0.875rem] font-normal text-white/80 transition-all hover:bg-white/10">About</a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="rounded-full px-4 py-2 text-[0.875rem] font-normal text-white/80 transition-all hover:bg-white/10">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <a href="https://github.com/Sanzlgd/" target="_blank" rel="noopener noreferrer" className="hidden rounded-full px-4 py-2 text-[0.875rem] text-white/80 transition-all hover:text-white sm:block">GitHub</a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="rounded-full bg-white px-5 py-2.5 text-[0.875rem] font-normal text-black transition-all hover:scale-105">Hire me</a>
            
            {/* Hamburger Button for Mobile */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <iconify-icon icon={menuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} style={{ fontSize: '1.25rem' }}></iconify-icon>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-2xl md:hidden"
          >
            <a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className="text-2xl font-normal text-white/80 hover:text-white">Skills</a>
            <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="text-2xl font-normal text-white/80 hover:text-white">Projects</a>
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-2xl font-normal text-white/80 hover:text-white">About</a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-2xl font-normal text-white/80 hover:text-white">Contact</a>
            <a href="https://github.com/Sanzlgd/" target="_blank" rel="noopener noreferrer" className="text-2xl font-normal text-[#00ff88] hover:text-white">GitHub Profile</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden bg-black" aria-label="Hero — Introduction">
        {/* Background Video (Instant local stream) */}
        <video 
          ref={videoRef} 
          className="absolute inset-0 z-0 h-full w-full object-cover" 
          src="/hero-bg.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
        ></video>
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,.60) 0%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.65) 100%)' }}></div>

        {/* Live CVE Security Widget */}
        <LiveCVEWidget />

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pt-20">
          
          {/* Animated BlurText Hero Heading */}
          <BlurText
            text="I break, secure & build systems"
            delay={80}
            animateBy="words"
            direction="top"
            className="text-center text-[3.8rem] font-normal leading-[0.98] tracking-tight text-white md:text-[6.375rem] max-w-4xl"
          />

          {/* Action Button */}
          <button 
            className="hero-btn mt-8 flex items-center gap-2 rounded-full bg-white py-1.5 pl-6 pr-2 text-[0.9375rem] font-normal text-black cursor-pointer hover:scale-105 transition-all"
            onClick={(e) => handleScroll(e, 'projects')}
          >
            View my projects
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
              <iconify-icon icon="solar:arrow-right-up-linear" style={{ fontSize: '.875rem', strokeWidth: 1.5 }}></iconify-icon>
            </span>
          </button>

          {/* Interactive 3D Tilting Story Card */}
          <div className="mt-12" style={{ perspective: 1200 }}>
            <div 
              ref={storyCardRef}
              className="hero-card relative h-[455px] w-[310px] overflow-hidden rounded-[28px] bg-[#1a1a1a] will-change-transform" 
              style={{ 
                transformStyle: 'preserve-3d',
                boxShadow: '0 40px 100px rgba(0,0,0,.55),0 8px 24px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.18),inset 0 0 0 1px rgba(255,255,255,.06)' 
              }}
            >
              {/* Profile Photo */}
              <img src="/Santhosh.jpg" alt="Santhosh" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 20%' }} />
              
              {/* Soft overlay gradients */}
              <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: 'soft-light', background: 'linear-gradient(160deg,rgba(0,255,136,.55) 0%,rgba(0,212,255,.30) 40%,rgba(0,100,80,.20) 100%)' }}></div>
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 15%,rgba(0,255,136,.20),transparent 55%)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[28px]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)' }}></div>

              {/* Progress bars */}
              <div className="absolute left-6 right-6 top-6 z-20 flex gap-1.5">
                <div className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(0,255,136,.15)' }}>
                  <div ref={storyBar1Ref} className="h-full origin-left rounded-full" style={{ background: 'rgba(0,255,136,.80)', transform: 'scaleX(0)' }}></div>
                </div>
                <div className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(0,255,136,.15)' }}>
                  <div ref={storyBar2Ref} className="h-full origin-left rounded-full" style={{ background: 'rgba(0,255,136,.80)', transform: 'scaleX(0)' }}></div>
                </div>
              </div>

              {/* Card content and cycling title */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(0deg,#040504 20.54%,rgba(4,5,4,0) 100%)' }}></div>
              
              <AnimatePresence mode="wait">
                <motion.h3 
                  key={storySlide}
                  initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.26 }}
                  className="absolute bottom-[88px] left-6 right-6 z-10 text-[2.375rem] font-normal leading-[2.5rem] tracking-tight text-white" 
                  style={{ textShadow: '0 2px 18px rgba(0,0,0,.35)' }}
                >
                  {storySlide === 0 ? (
                    <>
                      <span className="font-semibold">Breaking</span><br />
                      <span style={{ fontFamily: "'Instrument Serif', serif", style: 'italic' }}>& securing</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Building</span><br />
                      <span style={{ fontFamily: "'Instrument Serif', serif", style: 'italic' }}>the future</span>
                    </>
                  )}
                </motion.h3>
              </AnimatePresence>

              {/* Status and Action Buttons */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center gap-2.5">
                <span className="rounded-full px-4 py-[9px] text-[0.8125rem] font-normal text-[#0a0a0a]" style={{ background: 'rgba(255,255,255,.96)', boxShadow: '0 6px 18px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.9)' }}>Available</span>
                <a href="https://github.com/Sanzlgd/" target="_blank" rel="noopener noreferrer" className="flex h-[38px] w-[38px] items-center justify-center rounded-[14px] border text-white transition-all hover:scale-105" style={{ background: 'rgba(20,20,20,.45)', borderColor: 'rgba(255,255,255,.14)', backdropFilter: 'blur(10px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12)' }}>
                  <iconify-icon icon="mdi:github" style={{ fontSize: '1.125rem' }}></iconify-icon>
                </a>
                <a href="mailto:santhosh@example.com" className="flex h-[38px] w-[38px] items-center justify-center rounded-[14px] border text-white transition-all hover:scale-105" style={{ background: 'rgba(20,20,20,.45)', borderColor: 'rgba(255,255,255,.14)', backdropFilter: 'blur(10px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12)' }}>
                  <iconify-icon icon="solar:letter-linear" style={{ fontSize: '1.125rem' }}></iconify-icon>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Animation (Tech stack) */}
        <div className="absolute bottom-10 left-10 z-10 hidden lg:block">
          <h2 className="mb-[18px] text-[1.3125rem] font-normal leading-[1.2] text-white/60 tracking-tight">Tech stack</h2>
          <div className="w-[430px] overflow-hidden">
            <div className="marquee-inner flex w-max gap-[54px]">
              {['C++', 'React', 'Python', 'TypeScript', 'C++', 'React', 'Python', 'TypeScript'].map((tech, i) => (
                <span key={i} className="h-[30px] shrink-0 flex items-center text-[1rem] font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,.40)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Bio */}
        <div className="absolute bottom-10 right-10 z-10 hidden max-w-[430px] lg:block">
          <p className="mb-3 text-[1.3125rem] font-normal leading-[1.4] tracking-tight text-white">System-level developer & security researcher, building highly optimized tools and securing systems at every layer.</p>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-[1.3125rem] font-normal tracking-tight text-white underline">Learn more</a>
        </div>
      </section>

      {/* ═══════════════════ SKILLS SECTION ═══════════════════ */}
      <section id="skills" ref={skillsRef} className="overflow-hidden bg-black px-5 py-20 md:px-12" aria-label="Technical Skills">
        <div className="skills-header mb-16 text-center">
          <div className="mb-4 text-[0.75rem] font-normal uppercase tracking-[0.125rem] text-white/50">TECH STACK</div>
          <h2 className="m-0 text-white">
            <span className="block text-[3.5rem] font-normal leading-none tracking-tight md:text-[4.5rem]">Tools of the</span>
            <span className="block text-[3.5rem] font-normal italic leading-none tracking-tight md:text-[4.5rem]" style={{ fontFamily: "'Instrument Serif', serif" }}>trade I master</span>
          </h2>
          <p className="mt-4 text-[1rem] font-normal text-white/60">
            From kernel space to browser — a versatile arsenal for building, breaking & securing
          </p>
        </div>

        <div className="skills-grid-container mx-auto flex max-w-[1200px] flex-col items-stretch gap-4 lg:flex-row">
          {/* Low-Level & Systems Card */}
          <article className="skills-card-left relative min-h-[480px] flex-[1.4] overflow-hidden rounded-3xl">
            <div className="absolute inset-0 z-0 h-full w-full" style={{ background: 'linear-gradient(135deg,#0a120a 0%,#0d1a12 50%,#060e08 100%)' }}></div>
            <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,.15)' }}></div>

            <div className="absolute left-8 right-8 top-8 z-[2] rounded-[20px] border px-7 py-6" style={{ borderColor: 'rgba(255,255,255,.20)', background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(56px)', WebkitBackdropFilter: 'blur(56px)' }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[0.6875rem] font-normal tracking-[0.09375rem] text-white/60">SYSTEMS & LOW-LEVEL</span>
                <span className="text-[0.6875rem] font-normal tracking-[0.09375rem] text-white/60 underline">CORE</span>
              </div>
              
              {/* Counts up dynamically */}
              <div className="mb-6 text-[2.625rem] font-normal tracking-tight text-white tabular-nums">
                <CountUp to={7} suffix=" skills" />
              </div>
              
              <div className="mb-5 w-full border-t border-dashed border-white/20"></div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-[0.8125rem]"><span className="text-white/70">C / C++</span><span className="font-normal text-white">Advanced</span></div>
                <div className="relative mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-[#040504]/20">
                  <div 
                    className="progress-bar-fill absolute left-0 top-0 h-full rounded-full" 
                    data-width="85%"
                    style={{ background: 'linear-gradient(90deg,#00ff88 60.8%,rgba(0,255,136,0) 100%)' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-[0.8125rem]"><span className="text-white/70">Kernel Analysis</span><span className="font-normal text-white">Deep</span></div>
                <div className="relative mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-[#040504]/20">
                  <div 
                    className="progress-bar-fill absolute left-0 top-0 h-full rounded-full" 
                    data-width="70%"
                    style={{ background: 'linear-gradient(90deg,#00d4ff 55.74%,rgba(0,212,255,0) 100%)' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[0.8125rem]"><span className="text-white/70">Android Modding</span><span className="font-normal text-white">Expert</span></div>
                <div className="relative mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-[#040504]/20">
                  <div 
                    className="progress-bar-fill absolute left-0 top-0 h-full rounded-full" 
                    data-width="90%"
                    style={{ background: 'linear-gradient(90deg,#fff 52.46%,rgba(255,255,255,0) 100%)' }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-[22px] left-8 right-8 z-[2]">
              <BlurText
                text="Deep system mastery, from bootloader to kernel."
                delay={60}
                animateBy="words"
                direction="bottom"
                className="mb-2 text-[1.625rem] font-normal italic tracking-tight text-white flex wrap w-full font-serif"
              />
              <p className="m-0 text-[0.8125rem] font-normal leading-[1.6] text-white/65">Bootloaders, rooting, GSI flashing, Magisk modules — operating at every layer of the Android and Linux stack.</p>
            </div>
          </article>

          {/* Web & Full-Stack Card */}
          <article className="skills-card-right relative min-h-[480px] flex-1 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 z-0 h-full w-full" style={{ background: 'linear-gradient(135deg,#0a0a14 0%,#0d1020 50%,#06060e 100%)' }}></div>
            <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,.10)' }}></div>
            <div className="absolute right-6 top-6 z-[2] text-[0.6875rem] font-normal tracking-[0.09375rem] text-white/70 underline">WEB</div>

            <div className="skills-right-overlay-card absolute left-8 top-8 z-[2] w-[200px] rounded-2xl bg-white px-[18px] py-4 shadow-2xl">
              <div className="flex items-start justify-between">
                {/* Dynamic count-up */}
                <div className="text-[1.375rem] font-normal tracking-tight text-black tabular-nums">
                  <CountUp to={10} suffix="+" />
                </div>
                <iconify-icon icon="solar:code-square-linear" style={{ fontSize: '1rem', color: 'rgba(0,0,0,.35)' }}></iconify-icon>
              </div>
              <div className="mb-3.5 text-[0.75rem] text-black/45">Projects built</div>
              <button className="flex w-full items-center justify-between rounded-full bg-black py-2.5 pl-3.5 pr-2 text-[0.8125rem] font-normal text-white transition-all hover:scale-105 cursor-pointer" onClick={(e) => handleScroll(e, 'projects')}>
                View projects
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <iconify-icon icon="solar:arrow-right-up-linear" style={{ fontSize: '.8125rem', strokeWidth: 1.5 }}></iconify-icon>
                </span>
              </button>
            </div>

            {/* Tech icons cluster */}
            <div className="absolute bottom-[140px] left-1/2 z-[2] -translate-x-1/2 flex gap-3">
              <div 
                className="web-tech-icon flex h-[60px] w-[60px] items-center justify-center rounded-2xl text-[1.5rem]" 
                style={{ background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.12)' }}
              >
                <iconify-icon icon="logos:react" style={{ fontSize: '1.75rem' }}></iconify-icon>
              </div>
              <div 
                className="web-tech-icon flex h-[60px] w-[60px] items-center justify-center rounded-2xl text-[1.5rem]" 
                style={{ background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.12)' }}
              >
                <iconify-icon icon="logos:typescript-icon" style={{ fontSize: '1.75rem' }}></iconify-icon>
              </div>
              <div 
                className="web-tech-icon flex h-[60px] w-[60px] items-center justify-center rounded-2xl text-[1.5rem]" 
                style={{ background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.12)' }}
              >
                <iconify-icon icon="logos:python" style={{ fontSize: '1.75rem' }}></iconify-icon>
              </div>
            </div>

            <div className="skills-right-pill-overlay absolute bottom-[160px] right-6 z-[3] flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4 text-[0.8125rem] text-white" style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(12px)', fontFamily: "'JetBrains Mono', monospace" }}>
                Full-Stack
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:scale-110 cursor-pointer" style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(12px)' }} onClick={(e) => handleScroll(e, 'projects')}>
                <iconify-icon icon="solar:arrow-right-up-linear" style={{ fontSize: '1rem', strokeWidth: 1.5 }}></iconify-icon>
              </button>
            </div>

            <div className="absolute bottom-[22px] left-8 right-8 z-[2]">
              <BlurText
                text="Modern web, pixel-perfect execution"
                delay={60}
                animateBy="words"
                direction="bottom"
                className="mb-2 text-[1.5rem] font-normal italic tracking-tight text-white flex wrap w-full font-serif"
              />
              <p className="m-0 text-[0.8125rem] font-normal leading-[1.6] text-white/65">React, TypeScript, Python, HTML5, CSS3 — building responsive, optimized applications from the ground up.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ═══════════════════ PROJECTS SECTION ═══════════════════ */}
      <section id="projects" ref={projectsRef} className="overflow-hidden bg-black px-5 py-20 md:px-12" aria-label="Featured Projects">
        <div className="projects-header mb-16 text-center">
          <div className="mb-4 text-[0.75rem] font-normal uppercase tracking-[0.125rem] text-white/50">FEATURED WORK</div>
          <h2 className="m-0 text-white">
            <span className="text-[3.5rem] font-normal leading-none tracking-tight md:text-[4.5rem]">Projects that </span>
            <span className="text-[3.5rem] font-normal italic leading-none tracking-tight md:text-[4.5rem]" style={{ fontFamily: "'Instrument Serif', serif" }}>push limits</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[1rem] font-normal leading-[1.6] text-white/60">
            From automated security scanners to kernel frameworks — tools that operate at the edge
          </p>
        </div>

        <div className="projects-grid-container mx-auto flex max-w-[1200px] flex-col items-stretch gap-4 lg:flex-row">
          
          {/* Project 1: VULNSCAN.io */}
          <article className="project-card-gsap parallax-card relative min-h-[560px] flex-1 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 z-0 h-full w-full" style={{ background: 'linear-gradient(135deg,#040d08 0%,#081a10 50%,#041008 100%)' }}></div>
            <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,.15)' }}></div>

            <div className="parallax-target absolute left-6 right-6 top-8 z-[2] rounded-[20px] border p-5" style={{ borderColor: 'rgba(255,255,255,.20)', background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(56px)', WebkitBackdropFilter: 'blur(56px)' }}>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(0,255,136,.15)' }}>
                  <iconify-icon icon="solar:shield-check-bold" style={{ fontSize: '1.375rem', color: '#00ff88' }}></iconify-icon>
                </div>
                <span className="text-[1rem] font-normal text-white">VULNSCAN.io</span>
              </div>
              <div className="mb-4 border-t border-dashed border-white/20"></div>

              {/* Cycling VulnScan Terminal output */}
              <div className="relative h-40">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={qaIndex}
                    initial={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 6, filter: 'blur(8px)' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <p className="mb-3 text-[1rem] font-normal leading-[1.4] text-white">{questions[qaIndex].q}</p>
                    <div className="flex items-start gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/15">
                        <iconify-icon icon="solar:shield-check-bold" style={{ fontSize: '0.75rem', color: '#00ff88' }}></iconify-icon>
                      </div>
                      <p className="m-0 text-[0.75rem] font-normal leading-[1.6] text-white/55">{questions[qaIndex].a}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-[0.8125rem] font-normal text-black transition-all hover:scale-105 cursor-pointer">
                  View report
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black text-white">
                    <iconify-icon icon="solar:arrow-right-up-linear" style={{ fontSize: '.75rem', strokeWidth: 1.5 }}></iconify-icon>
                  </span>
                </button>
                <span className="text-[0.8125rem] font-normal text-white/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>React + Python</span>
              </div>
            </div>

            <div className="absolute bottom-7 left-6 right-6 z-[2]">
              <h3 className="mb-2 text-[1.625rem] font-normal italic tracking-tight text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>Automated Web Vulnerability Scanner</h3>
              <p className="text-[0.8125rem] font-normal leading-[1.6] text-white/65">A SaaS platform for instant, actionable web security auditing. Enter a URL, get a high-intensity automated scan.</p>
            </div>
          </article>

          {/* Project 2: Hellhound */}
          <article className="project-card-gsap parallax-card hellhound-card relative min-h-[560px] flex-1 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 z-0 h-full w-full" style={{ background: 'linear-gradient(135deg,#0f0408 0%,#1a0610 50%,#0e040a 100%)' }}></div>
            <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,.10)' }}></div>

            <div className="parallax-target absolute left-6 right-6 top-8 z-[2]">
              <div className="rounded-[20px] px-5 pb-5 pt-6 text-center" style={{ background: 'rgba(255,255,255,.92)' }}>
                <div className="mb-1 text-[0.75rem] font-normal leading-[1.5] text-black/50">Kernel Security<br />Framework</div>
                <div className="text-[3.25rem] font-normal italic leading-none tracking-tight text-black" style={{ fontFamily: "'Instrument Serif', serif" }}>C++</div>
                <div className="h-4"></div>

                {/* Animated Chart SVG */}
                <div className="relative mx-auto h-[145px] w-[280px] max-w-full overflow-visible">
                  <svg viewBox="60 -25 220 145" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,51,102,.85)"></stop>
                        <stop offset="100%" stopColor="rgba(255,51,102,.10)"></stop>
                      </linearGradient>
                    </defs>
                    
                    <g>
                      <path 
                        className="hellhound-chart-line"
                        d="M 60 75 L 150 20 L 280 28" 
                        fill="none" 
                        stroke="#ff3366" 
                        strokeWidth="3" 
                        strokeLinejoin="round" 
                        strokeLinecap="round"
                      />
                      
                      <path 
                        className="hellhound-chart-area"
                        d="M 60 75 L 150 20 L 280 28 L 280 120 L 60 120 Z" 
                        fill="url(#areaFill)"
                      />

                      <line x1="60" y1="75" x2="60" y2="120" stroke="#ff3366" strokeWidth="1" strokeDasharray="3 3" opacity=".6"></line>
                      <line x1="280" y1="28" x2="280" y2="120" stroke="#ff3366" strokeWidth="1" strokeDasharray="3 3" opacity=".6"></line>
                    </g>

                    <line 
                      className="hellhound-chart-helper-line"
                      x1="150" y1="-15" x2="150" y2="20" 
                      stroke="#ff3366" 
                      strokeWidth="1.2" 
                      strokeDasharray="36"
                    />

                    <circle 
                      className="hellhound-chart-circle"
                      cx="150" cy="-15" r="4.5" 
                      fill="#ff3366" 
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  </svg>
                </div>

                <div className="mt-4 inline-block rounded-full border px-4 py-2 text-center text-[0.6875rem] text-black/60" style={{ borderColor: 'rgba(0,0,0,.12)', background: 'rgba(255,255,255,.80)', backdropFilter: 'blur(8px)' }}>Deep vulnerability assessment & reverse engineering</div>
              </div>
            </div>

            <div className="absolute bottom-7 left-6 right-6 z-[2]">
              <h3 className="mb-2 text-[1.625rem] font-normal italic tracking-tight text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>Hellhound C++ Kernel Framework</h3>
              <p className="text-[0.8125rem] font-normal leading-[1.6] text-white/65">System-level security framework exploring kernel constraints, reverse engineering parameters, and vulnerability assessment.</p>
            </div>
          </article>

          {/* Project 3: AetherFlux */}
          <article className="project-card-gsap parallax-card aetherflux-card relative min-h-[560px] flex-1 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 z-0 h-full w-full" style={{ background: 'linear-gradient(135deg,#08040f 0%,#10061a 50%,#0a040e 100%)' }}></div>
            <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,.15)' }}></div>

            <div className="parallax-target absolute left-4 right-4 top-8 bottom-[110px] z-[2]">
              
              {/* Dynamic Compatibility Tree SVG & Nodes */}
              <svg className="absolute inset-0 z-[1] h-full w-full overflow-visible" viewBox="0 0 360 380" preserveAspectRatio="none">
                <defs>
                  <path id="tree-path-0" d="M180 44 C180 73,105 73,105 102"></path>
                  <path id="tree-path-1" d="M180 44 C180 73,255 73,255 102"></path>
                  <path id="tree-path-2" d="M105 140 C105 166,105 166,105 192"></path>
                  <path id="tree-path-3" d="M255 140 C255 166,255 166,255 192"></path>
                  <path id="tree-path-4" d="M180 44 C180 171,180 171,180 298"></path>
                  <path id="tree-path-5" d="M180 334 C180 347,180 347,180 360"></path>
                </defs>
                
                <g>
                  <path className="aetherflux-tree-path" d="M180 44 C180 73,105 73,105 102" stroke="rgba(168,85,247,.35)" strokeWidth="1" fill="none"></path>
                  <path className="aetherflux-tree-path" d="M180 44 C180 73,255 73,255 102" stroke="rgba(168,85,247,.35)" strokeWidth="1" fill="none"></path>
                  <path className="aetherflux-tree-path" d="M105 140 C105 166,105 166,105 192" stroke="rgba(168,85,247,.35)" strokeWidth="1" fill="none"></path>
                  <path className="aetherflux-tree-path" d="M255 140 C255 166,255 166,255 192" stroke="rgba(168,85,247,.35)" strokeWidth="1" fill="none"></path>
                  <path className="aetherflux-tree-path" d="M180 44 C180 171,180 171,180 298" stroke="rgba(168,85,247,.35)" strokeWidth="1" fill="none"></path>
                  <path className="aetherflux-tree-path" d="M180 334 C180 347,180 347,180 360" stroke="rgba(168,85,247,.35)" strokeWidth="1" fill="none"></path>
                  
                  <circle className="aetherflux-tree-circle" cx="105" cy="102" r="2.5" fill="rgba(168,85,247,.9)"></circle>
                  <circle className="aetherflux-tree-circle" cx="255" cy="102" r="2.5" fill="rgba(168,85,247,.9)"></circle>
                  <circle className="aetherflux-tree-circle" cx="105" cy="192" r="2.5" fill="rgba(168,85,247,.9)"></circle>
                  <circle className="aetherflux-tree-circle" cx="255" cy="192" r="2.5" fill="rgba(168,85,247,.9)"></circle>
                  <circle className="aetherflux-tree-circle" cx="180" cy="298" r="2.5" fill="rgba(168,85,247,.9)"></circle>
                  <circle className="aetherflux-tree-circle" cx="180" cy="360" r="2.5" fill="rgba(168,85,247,.9)"></circle>

                  {/* Flowing particle animations */}
                  <circle r="3" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,.8))' }}><animateMotion dur="2.4s" repeatCount="indefinite" begin=".85s"><mpath href="#tree-path-0"></mpath></animateMotion></circle>
                  <circle r="3" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,.8))' }}><animateMotion dur="2.4s" repeatCount="indefinite" begin="1s"><mpath href="#tree-path-1"></mpath></animateMotion></circle>
                  <circle r="3" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,.8))' }}><animateMotion dur="2.4s" repeatCount="indefinite" begin="1.2s"><mpath href="#tree-path-2"></mpath></animateMotion></circle>
                  <circle r="3" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,.8))' }}><animateMotion dur="2.4s" repeatCount="indefinite" begin="1.38s"><mpath href="#tree-path-3"></mpath></animateMotion></circle>
                  <circle r="3" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,.8))' }}><animateMotion dur="2.4s" repeatCount="indefinite" begin="1.55s"><mpath href="#tree-path-4"></mpath></animateMotion></circle>
                  <circle r="3" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,.8))' }}><animateMotion dur="2.4s" repeatCount="indefinite" begin="1.75s"><mpath href="#tree-path-5"></mpath></animateMotion></circle>
                </g>
              </svg>

              <div className="relative z-[2] flex h-full flex-col items-center gap-[18px]">
                {[
                  { label: 'AetherFlux', delay: 0, customStyle: { fontFamily: "'Instrument Serif', serif", borderColor: 'rgba(168,85,247,.35)', background: 'rgba(168,85,247,.10)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', fontStyle: 'italic' }, classes: 'rounded-full border px-5 py-2.5 text-[1rem] text-white' },
                  { wrap: true, children: [
                    { label: 'HarmonyOS', delay: 180, customStyle: { fontFamily: "'Instrument Serif', serif", borderColor: 'rgba(168,85,247,.35)', background: 'rgba(168,85,247,.10)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', fontStyle: 'italic' }, classes: 'rounded-full border px-5 py-2.5 text-[1rem] text-white' },
                    { label: 'OneUI', delay: 360, customStyle: { fontFamily: "'Instrument Serif', serif", borderColor: 'rgba(168,85,247,.35)', background: 'rgba(168,85,247,.10)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', fontStyle: 'italic' }, classes: 'rounded-full border px-5 py-2.5 text-[1rem] text-white' }
                  ]},
                  { wrap: true, children: [
                    { label: 'Liquid-glass lockscreen clock UI', delay: 540, customStyle: { background: 'rgba(255,255,255,.92)' }, classes: 'max-w-[160px] rounded-xl px-4 py-2.5 text-[0.75rem] font-normal leading-[1.5] text-black/75' },
                    { label: 'Dynamic system modifications', delay: 720, customStyle: { background: 'rgba(255,255,255,.92)' }, classes: 'max-w-[160px] rounded-xl px-4 py-2.5 text-[0.75rem] font-normal leading-[1.5] text-black/75' }
                  ]},
                  { spacer: true },
                  { label: 'OxygenOS', delay: 900, customStyle: { fontFamily: "'Instrument Serif', serif", borderColor: 'rgba(168,85,247,.35)', background: 'rgba(168,85,247,.10)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', fontStyle: 'italic' }, classes: 'rounded-full border px-5 py-2.5 text-[1rem] text-white' },
                  { label: 'Magisk module for custom lockscreen', delay: 1080, customStyle: { background: 'rgba(255,255,255,.92)' }, classes: 'max-w-[160px] rounded-xl px-4 py-2.5 text-center text-[0.75rem] font-normal leading-[1.5] text-black/75' }
                ].map((item, idx) => {
                  if (item.spacer) return <div key={idx} className="mt-auto"></div>;
                  if (item.wrap) {
                    return (
                      <div key={idx} className="flex gap-4">
                        {item.children.map((child, cidx) => (
                          <div 
                            key={cidx}
                            className={`aetherflux-tree-label ${child.classes}`}
                            style={child.customStyle}
                          >
                            {child.label}
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div 
                      key={idx}
                      className={`aetherflux-tree-label ${item.classes}`}
                      style={item.customStyle}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute bottom-7 left-6 right-6 z-[2]">
              <h3 className="mb-2 text-[1.625rem] font-normal italic tracking-tight text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>AetherFlux Magisk Module</h3>
              <p className="text-[0.8125rem] font-normal leading-[1.6] text-white/65">Custom Android system modification for liquid-glass lockscreen clocks, tested across multiple OS builds.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ═══════════════════ ABOUT SECTION ═══════════════════ */}
      <section id="about" ref={aboutRef} className="overflow-hidden bg-black px-5 py-20 md:px-12" aria-label="About Santhosh">
        <div className="mx-auto max-w-[1200px]">
          <div className="about-header text-center">
            <div className="mb-4 text-[0.75rem] font-normal uppercase tracking-[0.125rem] text-white/50">ABOUT & PHILOSOPHY</div>
            
            {/* BlurText Reveal animation on Section Header */}
            <BlurText
              text="Discipline in all forms"
              delay={80}
              animateBy="words"
              direction="bottom"
              className="text-center text-[3.2rem] font-normal leading-none tracking-tight md:text-[4.5rem] flex justify-center w-full"
            />

            <p className="mx-auto mt-4 max-w-2xl text-center text-[1rem] font-normal leading-[1.6] text-white/60">The same structural discipline from physical training goes straight into clean code architectures</p>
          </div>

          <div className="about-cards-container mx-auto mt-16 flex max-w-[900px] flex-col items-stretch gap-4 md:flex-row">
            <div 
              className="about-card-gsap relative flex-1 overflow-hidden rounded-3xl border p-8" 
              style={{ borderColor: 'rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'rgba(0,255,136,.10)', border: '1px solid rgba(0,255,136,.15)' }}>
                <iconify-icon icon="solar:monitor-linear" style={{ fontSize: '1.375rem', color: '#00ff88' }}></iconify-icon>
              </div>
              <h3 className="mb-3 text-[1.25rem] font-semibold tracking-tight text-white">Hardware Optimization</h3>
              <p className="text-[0.875rem] leading-[1.7] text-white/55">Experienced in squeezing maximum performance out of budget hardware — modding and tweaking setups for high-efficiency gaming and compilation.</p>
            </div>

            <div 
              className="about-card-gsap relative flex-1 overflow-hidden rounded-3xl border p-8" 
              style={{ borderColor: 'rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'rgba(0,212,255,.10)', border: '1px solid rgba(0,212,255,.15)' }}>
                <iconify-icon icon="solar:dumbbell-large-minimalistic-linear" style={{ fontSize: '1.375rem', color: '#00d4ff' }}></iconify-icon>
              </div>
              <h3 className="mb-3 text-[1.25rem] font-semibold tracking-tight text-white">Fitness & Discipline</h3>
              <p className="text-[0.875rem] leading-[1.7] text-white/55">High-intensity bodybuilding & calisthenics enthusiast — bringing the same strict routine and structural discipline from physical training into clean code.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT FOOTER ═══════════════════ */}
      <footer id="contact" ref={contactRef} className="overflow-hidden bg-black px-5 py-20 md:px-12" aria-label="Contact & Footer">
        <div className="mx-auto max-w-[600px] text-center">
          <div className="contact-header">
            <h2 className="m-0 mb-4 text-white">
              <span className="text-[3rem] font-normal leading-none tracking-tight md:text-[4rem]">Let's build </span>
              <span className="text-[3rem] font-normal italic leading-none tracking-tight md:text-[4rem]" style={{ fontFamily: "'Instrument Serif', serif" }}>something epic</span>
            </h2>
            <p className="mb-8 text-[1rem] font-normal leading-[1.6] text-white/60">Have a project, a security challenge, or just want to connect? I'm always open to interesting conversations.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:santhosh@example.com" className="contact-btn flex items-center gap-2 rounded-full border px-5 py-3 text-[0.875rem] text-white/80 transition-all hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              <iconify-icon icon="solar:letter-linear" style={{ fontSize: '1.125rem' }}></iconify-icon>Email
            </a>
            <a href="https://github.com/Sanzlgd/" target="_blank" rel="noopener noreferrer" className="contact-btn flex items-center gap-2 rounded-full border px-5 py-3 text-[0.875rem] text-white/80 transition-all hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              <iconify-icon icon="mdi:github" style={{ fontSize: '1.125rem' }}></iconify-icon>GitHub
            </a>
            <a href="https://linkedin.com/in/santhosh" target="_blank" rel="noopener noreferrer" className="contact-btn flex items-center gap-2 rounded-full border px-5 py-3 text-[0.875rem] text-white/80 transition-all hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              <iconify-icon icon="mdi:linkedin" style={{ fontSize: '1.125rem' }}></iconify-icon>LinkedIn
            </a>
            <a href="https://twitter.com/santhosh" target="_blank" rel="noopener noreferrer" className="contact-btn flex items-center gap-2 rounded-full border px-5 py-3 text-[0.875rem] text-white/80 transition-all hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              <iconify-icon icon="ri:twitter-x-fill" style={{ fontSize: '1.125rem' }}></iconify-icon>Twitter / X
            </a>
          </div>
          
          {/* ═══ Lighthouse / Performance Badge ═══ */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Performance', score: 98, color: '#00ff88' },
              { label: 'Accessibility', score: 95, color: '#00d4ff' },
              { label: 'Best Practices', score: 100, color: '#a855f7' },
              { label: 'SEO', score: 100, color: '#f59e0b' },
            ].map(({ label, score, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 min-w-[80px]"
                style={{
                  borderColor: `${color}22`,
                  background: `${color}08`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <svg viewBox="0 0 36 36" className="h-10 w-10" aria-hidden="true">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                    strokeLinecap="round"
                  />
                  <text x="18" y="20.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="600" fontFamily="'Inter Tight',sans-serif">{score}</text>
                </svg>
                <span className="text-[0.625rem] font-medium tracking-wide text-white/40 text-center">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.65rem] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Lighthouse scores via CI audit</p>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-[0.75rem] text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>&lt;/&gt; Built with precision by Santhosh · Salem, TN · 2025</p>
          </div>
        </div>
      </footer>
    </main>
  );

}
