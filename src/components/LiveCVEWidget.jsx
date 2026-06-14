import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { useRef } from 'react';

/**
 * LiveCVEWidget — Fetches the latest critical CVE from the NIST NVD public API
 * and displays it as a floating security badge. No API key required.
 */
export default function LiveCVEWidget() {
  const [cve, setCve] = useState(null);
  const [loading, setLoading] = useState(true);
  const widgetRef = useRef(null);

  useEffect(() => {
    const fetchLatestCVE = async () => {
      try {
        // NIST NVD public API — latest critical CVEs, no key needed
        const res = await fetch(
          'https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL&resultsPerPage=1',
          { signal: AbortSignal.timeout(6000) }
        );
        if (!res.ok) throw new Error('NVD API error');
        const data = await res.json();
        const item = data?.vulnerabilities?.[0]?.cve;
        if (item) {
          const score =
            item.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
            item.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
            '??';
          const desc =
            item.descriptions?.find((d) => d.lang === 'en')?.value ||
            'No description available.';
          setCve({
            id: item.id,
            score,
            desc: desc.length > 80 ? desc.slice(0, 80) + '…' : desc,
            published: item.published?.slice(0, 10) || '',
          });
        }
      } catch {
        // Silently fail — show fallback
        setCve({ id: 'CVE-2025-????', score: '—', desc: 'Live feed unavailable.', published: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCVE();
  }, []);

  // Animate in once data loads
  useEffect(() => {
    if (!loading && widgetRef.current) {
      gsap.fromTo(
        widgetRef.current,
        { opacity: 0, y: 18, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)', delay: 1.4 }
      );
    }
  }, [loading]);

  if (loading) return null;

  return (
    <div
      ref={widgetRef}
      className="absolute left-4 top-[88px] z-20 hidden xl:block"
      style={{ opacity: 0 }}
      title={`Latest critical CVE: ${cve?.id}`}
    >
      <div
        className="flex items-start gap-3 rounded-2xl border px-4 py-3 max-w-[280px]"
        style={{
          background: 'rgba(10,10,10,0.75)',
          borderColor: 'rgba(255,51,102,0.25)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 0 24px rgba(255,51,102,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Pulsing dot */}
        <div className="mt-1 flex-shrink-0 relative">
          <span
            className="block h-2.5 w-2.5 rounded-full"
            style={{ background: '#ff3366' }}
          />
          <span
            className="absolute inset-0 block h-2.5 w-2.5 rounded-full animate-ping"
            style={{ background: 'rgba(255,51,102,0.5)' }}
          />
        </div>

        <div className="min-w-0">
          {/* Label */}
          <div className="mb-1 flex items-center gap-2">
            <span
              className="text-[0.6rem] font-semibold uppercase tracking-widest"
              style={{ color: '#ff3366' }}
            >
              Live Threat
            </span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold"
              style={{ background: 'rgba(255,51,102,0.15)', color: '#ff7799' }}
            >
              CVSS {cve?.score}
            </span>
          </div>

          {/* CVE ID */}
          <div
            className="text-[0.8125rem] font-semibold tracking-tight text-white truncate"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {cve?.id}
          </div>

          {/* Description */}
          <p className="mt-0.5 text-[0.7rem] leading-[1.5] text-white/50 line-clamp-2">
            {cve?.desc}
          </p>

          {/* Date + source */}
          {cve?.published && (
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[0.65rem] text-white/30">{cve.published}</span>
              <span className="text-[0.65rem] text-white/20">·</span>
              <span className="text-[0.65rem] text-white/30">NIST NVD</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
