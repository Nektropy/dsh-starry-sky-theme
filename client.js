/**
 * Starry Sky theme — Browser half.
 *
 * A dark-only theme. Both Light and Dark appearance settings resolve to the
 * night sky: the Client half pins the appearance preference to `dark`, overlays
 * the deep-space alias palette for whichever scheme is momentarily active, and
 * paints a twinkling starfield with constellation figures in `shell.overlay`.
 *
 * Everything is removed when the plugin is disabled; the saved preference then
 * stays dark until the user changes it in Settings → Appearance.
 */
window.__ModuleLoader__.load({
  id: 'dsh-starry-sky-theme',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const PACKAGE_ID = 'dsh-starry-sky-theme';

    /**
     * One palette for both color schemes: the theme is dark-only, so the
     * `light` values repeat the dark ones instead of providing a daylight look.
     */
    const TOKENS = {
      '--dsw-alias-bg-base': { light: '#060814', dark: '#060814' },
      '--dsw-alias-bg-layer-1': { light: '#0c1024', dark: '#0c1024' },
      '--dsw-alias-bg-layer-2': { light: '#131a36', dark: '#131a36' },
      '--dsw-alias-bg-overlay': { light: '#0e1430', dark: '#0e1430' },
      '--dsw-alias-border-l1': { light: '#232a4d', dark: '#232a4d' },
      '--dsw-alias-border-l2': { light: '#303a66', dark: '#303a66' },
      '--dsw-alias-brand-primary': { light: '#8fa9ff', dark: '#8fa9ff' },
      '--dsw-alias-label-primary': { light: '#e9ecff', dark: '#e9ecff' },
      '--dsw-alias-label-secondary': { light: '#9aa3c9', dark: '#9aa3c9' },
      '--dsw-alias-state-error-primary': { light: '#ff7d95', dark: '#ff7d95' },
      '--dsw-alias-state-idle-primary': { light: '#7981a5', dark: '#7981a5' },
      '--dsw-alias-state-success-primary': { light: '#67e8b8', dark: '#67e8b8' },
      '--dsw-alias-state-warn-primary': { light: '#ffd27a', dark: '#ffd27a' },
      '--dsw-specific-sidebar-fill': { light: '#080b19', dark: '#080b19' },
    };

    /** Deterministic star layout (pure computation, no side effects). */
    function createStars(count, seed) {
      let state = (seed % 2147483646) + 1;
      const next = () => (state = (state * 16807) % 2147483647) / 2147483647;
      const stars = [];
      for (let index = 0; index < count; index += 1) {
        const bright = index % 8 === 0;
        stars.push({
          x: next() * 100,
          y: next() * 100,
          size: bright ? 2.2 + next() * 1.2 : 0.8 + next() * 1,
          bright,
          min: 0.16 + next() * 0.22,
          max: 0.52 + next() * 0.44,
          duration: 2.8 + next() * 5.2,
          delay: next() * 6,
        });
      }
      return stars;
    }

    const STARS = createStars(68, 20261017);

    /** Star-chart figures, in viewport percentages, shared by the one sky. */
    const CONSTELLATIONS = [
      [[7, 57], [13, 52], [19, 54], [25, 48], [32, 51], [30, 58], [23, 60], [16, 59]],
      [[64, 12], [70, 16], [76, 14], [81, 20], [77, 25], [71, 23]],
      [[66, 78], [72, 73], [78, 75], [84, 70], [88, 74]],
      [[12, 84], [17, 80], [22, 83]],
    ];

    const CONSTELLATION_POINTS = CONSTELLATIONS.reduce(
      (points, figure) => points.concat(figure),
      [],
    );

    const SKY_CSS = [
      '@keyframes starry-sky-twinkle{from{opacity:var(--sk-min)}to{opacity:var(--sk-max)}}',
      '.starry-sky-root{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0}',
      '.starry-sky-nebula{position:absolute;inset:-25%;filter:blur(14px)}',
      '.starry-sky-star{position:absolute;border-radius:50%;animation:starry-sky-twinkle var(--sk-dur) ease-in-out var(--sk-delay) infinite alternate}',
      '.starry-sky-figures{position:absolute;inset:0;width:100%;height:100%}',
      '.starry-sky-anchor{position:absolute;width:2px;height:2px;border-radius:50%;transform:translate(-50%,-50%)}',
      '@media (prefers-reduced-motion: reduce){.starry-sky-star{animation:none;opacity:var(--sk-max)}}',
    ].join('\n');

    const SKY = {
      star: '#f4f7ff',
      brightStar: '#ffffff',
      anchor: '#eef2ff',
      anchorGlow: '0 0 4px rgba(198,214,255,0.7)',
      glow: '0 0 6px 1px rgba(196,214,255,0.65)',
      constellation: 'rgba(158,176,238,0.26)',
      blend: 'screen',
      nebula: [
        'radial-gradient(42% 38% at 16% 12%, rgba(92,76,196,0.42), rgba(92,76,196,0) 70%)',
        'radial-gradient(48% 44% at 84% 76%, rgba(24,88,168,0.36), rgba(24,88,168,0) 72%)',
        'radial-gradient(34% 30% at 58% 38%, rgba(180,142,255,0.16), rgba(180,142,255,0) 70%)',
        'radial-gradient(30% 26% at 70% 8%, rgba(64,132,196,0.18), rgba(64,132,196,0) 70%)',
      ].join(','),
    };

    /** The night sky: nebula, constellation figures, then the twinkling stars. */
    function StarfieldLayer() {
      const stars = STARS.map((star, index) =>
        h('div', {
          key: index,
          className: 'starry-sky-star',
          style: {
            left: `${star.x.toFixed(2)}%`,
            top: `${star.y.toFixed(2)}%`,
            width: `${star.size.toFixed(2)}px`,
            height: `${star.size.toFixed(2)}px`,
            backgroundColor: star.bright ? SKY.brightStar : SKY.star,
            boxShadow: star.bright ? SKY.glow : 'none',
            '--sk-min': star.min.toFixed(2),
            '--sk-max': star.max.toFixed(2),
            '--sk-dur': `${star.duration.toFixed(2)}s`,
            '--sk-delay': `${star.delay.toFixed(2)}s`,
          },
        }),
      );
      const chart = [
        h(
          'svg',
          {
            key: 'figures',
            className: 'starry-sky-figures',
            viewBox: '0 0 100 100',
            preserveAspectRatio: 'none',
            'aria-hidden': true,
          },
          CONSTELLATIONS.map((figure, index) =>
            h('polyline', {
              key: index,
              points: figure.map(([x, y]) => `${x},${y}`).join(' '),
              fill: 'none',
              stroke: SKY.constellation,
              strokeWidth: 1,
              vectorEffect: 'non-scaling-stroke',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }),
          ),
        ),
        ...CONSTELLATION_POINTS.map(([x, y], index) =>
          h('div', {
            key: `anchor-${index}`,
            className: 'starry-sky-anchor',
            style: {
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: SKY.anchor,
              boxShadow: SKY.anchorGlow,
            },
          }),
        ),
      ];
      return h(
        'div',
        {
          className: 'starry-sky-root',
          'aria-hidden': true,
          style: { mixBlendMode: SKY.blend },
        },
        h('style', null, SKY_CSS),
        h('div', {
          className: 'starry-sky-nebula',
          style: { backgroundImage: SKY.nebula },
        }),
        chart,
        stars,
      );
    }

    return {
      inject: ['slots', 'theme'],
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens(PACKAGE_ID, TOKENS),
          'starry-sky-theme: palette layer',
        );

        // Both appearance values are dark: pin the preference whenever the
        // resolved scheme is light (an explicit Light choice included).
        ctx.effect(() => {
          let disposed = false;
          const pinDark = (snapshot) => {
            if (snapshot.active.colorScheme === 'dark') return;
            // Defer past the current emit, then settle on the built-in dark theme.
            queueMicrotask(() => {
              if (disposed) return;
              try {
                ctx.theme.setTheme('dark');
              } catch (_error) {
                // The settings scope may still be settling; the next theme change retries.
              }
            });
          };
          pinDark(ctx.theme.getTheme());
          const stop = ctx.on('theme/change', pinDark);
          return () => {
            disposed = true;
            stop();
          };
        }, 'starry-sky-theme: dark only');

        function Starfield() {
          return h(StarfieldLayer);
        }

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'starry-sky-theme', order: -100 },
            Starfield,
          ),
        );
      },
    };
  },
});
