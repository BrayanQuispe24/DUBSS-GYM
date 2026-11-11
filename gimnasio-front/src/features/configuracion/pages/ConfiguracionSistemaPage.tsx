import React from 'react';
import {
  Check,
  Minus,
  Monitor,
  Moon,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Type,
} from 'lucide-react';
import {
  FONT_SCALES,
  FONT_SCALE_ORDER,
  type FontScaleKey,
  type ThemeMode,
  useUIStore,
} from '@/store/uiStore';
import showToast from '@/utils/toast';

interface ThemeOptionConfig {
  id: ThemeMode;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  swatches: { label: string; hex: string }[];
  preview: {
    canvasBg: string;
    sidebarBg: string;
    cardBg: string;
    borderColor: string;
    headingBg: string;
    mutedBg: string;
  };
}

const THEME_OPTIONS: ThemeOptionConfig[] = [
  {
    id: 'dark',
    title: 'Tema Oscuro · Obsidiana & Carmesí',
    subtitle: 'Predeterminado · Paleta Portada',
    description:
      'Superficies carbón profundo y negro obsidiana con acentos carmesí UAGRM para reducir la fatiga visual en jornadas prolongadas.',
    icon: <Moon size={16} />,
    swatches: [
      { label: 'Obsidiana', hex: '#0B0B0D' },
      { label: 'Carbón', hex: '#141419' },
      { label: 'Carmesí', hex: '#990000' },
      { label: 'Blanco Puro', hex: '#FAFAFA' },
    ],
    preview: {
      canvasBg: '#0B0B0D',
      sidebarBg: '#0E0E12',
      cardBg: '#141419',
      borderColor: '#272732',
      headingBg: '#F4F4F5',
      mutedBg: '#52525B',
    },
  },
  {
    id: 'light',
    title: 'Tema Claro · Plata & Carmesí',
    subtitle: 'Alto contraste diurno',
    description:
      'Lienzo neutro plata con tarjetas blancas nítidas, bordes estructurales definidos y contraste óptimo bajo iluminación intensa.',
    icon: <Sun size={16} />,
    swatches: [
      { label: 'Plata', hex: '#F4F4F6' },
      { label: 'Superficie', hex: '#FFFFFF' },
      { label: 'Carmesí', hex: '#990000' },
      { label: 'Grafito', hex: '#18181B' },
    ],
    preview: {
      canvasBg: '#F4F4F6',
      sidebarBg: '#09090B',
      cardBg: '#FFFFFF',
      borderColor: '#E4E4E7',
      headingBg: '#18181B',
      mutedBg: '#A1A1AA',
    },
  },
];

const FONT_METADATA: Record<FontScaleKey, { name: string; usage: string }> = {
  sm: { name: 'Compacto', usage: 'Máxima densidad en tablas y monitores amplios' },
  md: { name: 'Estándar', usage: 'Escala base recomendada para uso diario' },
  lg: { name: 'Grande', usage: 'Lectura cómoda y mayor legibilidad en paneles' },
  xl: { name: 'Extra Grande', usage: 'Accesibilidad visual ampliada para todo el sistema' },
};

/**
 * Vista de Configuración del Sistema para gestionar apariencia (Tema Oscuro / Claro)
 * y escala tipográfica global con vista previa inmediata y persistencia en localStorage.
 */
const ConfiguracionSistemaPage: React.FC = () => {
  const {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    increaseFontScale,
    decreaseFontScale,
    resetFontScale,
  } = useUIStore();

  const currentIdx = FONT_SCALE_ORDER.indexOf(fontScale);
  const canDecrease = currentIdx > 0;
  const canIncrease = currentIdx < FONT_SCALE_ORDER.length - 1;
  const activeScale = FONT_SCALES[fontScale];

  const handleSelectTheme = (nextTheme: ThemeMode) => {
    if (theme === nextTheme) return;
    setTheme(nextTheme);
    showToast.info(
      nextTheme === 'dark' ? 'Tema Oscuro activado.' : 'Tema Claro activado.',
      'Apariencia actualizada'
    );
  };

  const handleSelectFont = (nextScale: FontScaleKey) => {
    if (fontScale === nextScale) return;
    setFontScale(nextScale);
    showToast.info(
      `Tamaño de fuente ajustado a ${FONT_SCALES[nextScale].label} (${FONT_SCALES[nextScale].px}px).`,
      'Tipografía actualizada'
    );
  };

  const handleResetAll = () => {
    setTheme('dark');
    resetFontScale();
    showToast.success(
      'Preferencias restablecidas a Tema Oscuro y escala 100% (16px).',
      'Configuración restablecida'
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Encabezado Enterprise */}
      <section className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-[#990000]/10 dark:bg-red-500/15 border border-[#990000]/25 dark:border-red-500/30 text-[#990000] dark:text-red-400 flex items-center justify-center shrink-0">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Configuración de Apariencia y Accesibilidad
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
              Personaliza el esquema cromático y el tamaño tipográfico global de todo el sistema interno. Los cambios se aplican al instante y se conservan en este navegador.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-sm border border-zinc-300 dark:border-[#2E2E3A] bg-zinc-50 dark:bg-[#1A1A22] hover:bg-zinc-100 dark:hover:bg-[#23232D] text-xs font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-200 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw size={14} />
          Restablecer por defecto
        </button>
      </section>

      {/* Sección 1: Selector de Tema */}
      <section className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-[#272732]">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Monitor size={15} className="text-[#DC2626] dark:text-red-400" />
              1. Esquema de Color del Sistema
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Elige entre el tema oscuro inspirado en la portada o el modo claro de alto contraste.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-tiny font-bold uppercase bg-zinc-100 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#2E2E3A] text-zinc-700 dark:text-zinc-300 self-start sm:self-auto">
            Activo: {theme === 'dark' ? 'Oscuro' : 'Claro'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_OPTIONS.map((option) => {
            const isSelected = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectTheme(option.id)}
                aria-pressed={isSelected}
                className={`text-left rounded-sm border p-4 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-[#DC2626] dark:border-red-500 ring-1 ring-[#DC2626]/30 bg-red-50/30 dark:bg-red-950/15'
                    : 'border-zinc-200 dark:border-[#272732] bg-zinc-50/70 dark:bg-[#101014] hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="space-y-3">
                  {/* Cabecera tarjeta */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-8 h-8 rounded-sm flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[#990000] text-white border-[#990000]'
                            : 'bg-white dark:bg-[#1A1A22] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#2E2E3A]'
                        }`}
                      >
                        {option.icon}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                          {option.title}
                        </div>
                        <div className="text-tiny font-semibold text-zinc-500 dark:text-zinc-400">
                          {option.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#990000] text-white text-[11px] font-bold uppercase shrink-0">
                        <Check size={12} />
                        Activo
                      </span>
                    )}
                  </div>

                  {/* Mini Mockup de Interfaz */}
                  <div
                    className="rounded-sm border overflow-hidden h-24 flex"
                    style={{
                      backgroundColor: option.preview.canvasBg,
                      borderColor: option.preview.borderColor,
                    }}
                  >
                    <div
                      className="w-14 h-full p-2 flex flex-col gap-1.5 shrink-0"
                      style={{
                        backgroundColor: option.preview.sidebarBg,
                        borderRight: `1px solid ${option.preview.borderColor}`,
                      }}
                    >
                      <div className="h-2.5 w-8 rounded-xs bg-[#990000]" />
                      <div className="h-1.5 w-9 rounded-xs bg-zinc-700/70 mt-1" />
                      <div className="h-1.5 w-7 rounded-xs bg-zinc-700/50" />
                      <div className="h-1.5 w-8 rounded-xs bg-zinc-700/50" />
                    </div>
                    <div className="flex-1 p-2.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div
                          className="h-2 w-24 rounded-xs"
                          style={{ backgroundColor: option.preview.headingBg }}
                        />
                        <div className="h-3 w-10 rounded-xs bg-[#990000]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div
                          className="rounded-xs border p-1.5 flex flex-col justify-between"
                          style={{
                            backgroundColor: option.preview.cardBg,
                            borderColor: option.preview.borderColor,
                          }}
                        >
                          <div
                            className="h-1.5 w-10 rounded-xs"
                            style={{ backgroundColor: option.preview.mutedBg }}
                          />
                          <div className="h-2.5 w-12 rounded-xs bg-[#DC2626]" />
                        </div>
                        <div
                          className="rounded-xs border p-1.5 flex flex-col justify-between"
                          style={{
                            backgroundColor: option.preview.cardBg,
                            borderColor: option.preview.borderColor,
                          }}
                        >
                          <div
                            className="h-1.5 w-12 rounded-xs"
                            style={{ backgroundColor: option.preview.mutedBg }}
                          />
                          <div
                            className="h-2.5 w-9 rounded-xs"
                            style={{ backgroundColor: option.preview.headingBg }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Paleta de muestras */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200/80 dark:border-[#272732]">
                  {option.swatches.map((swatch) => (
                    <span
                      key={swatch.label}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-zinc-200 dark:border-[#2E2E3A] bg-white dark:bg-[#141419] text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-xs border border-black/20 dark:border-white/20"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      {swatch.label}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sección 2: Tamaño de Fuentes + Vista Previa */}
      <section className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-[#272732]">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Type size={15} className="text-[#DC2626] dark:text-red-400" />
              2. Tamaño de Fuentes y Legibilidad
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Ajusta la escala tipográfica base (`rem`) aplicada a tablas, formularios, menús y reportes.
            </p>
          </div>

          {/* Controles rápidos sincronizados */}
          <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-[#101014] border border-zinc-200 dark:border-[#2E2E3A] rounded-sm p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={decreaseFontScale}
              disabled={!canDecrease}
              title="Reducir tamaño de fuente"
              className="w-7 h-7 inline-flex items-center justify-center rounded-sm bg-white dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#2E2E3A] text-zinc-800 dark:text-zinc-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:border-[#DC2626]"
            >
              <Minus size={13} />
            </button>
            <button
              type="button"
              onClick={resetFontScale}
              title="Restablecer al 100%"
              className="px-2.5 h-7 inline-flex items-center justify-center rounded-sm text-xs font-extrabold text-zinc-900 dark:text-zinc-100 hover:text-[#DC2626] cursor-pointer"
            >
              {activeScale.label} · {activeScale.px}px
            </button>
            <button
              type="button"
              onClick={increaseFontScale}
              disabled={!canIncrease}
              title="Aumentar tamaño de fuente"
              className="w-7 h-7 inline-flex items-center justify-center rounded-sm bg-white dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#2E2E3A] text-zinc-800 dark:text-zinc-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:border-[#DC2626]"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* 4 Presets de Tamaño */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FONT_SCALE_ORDER.map((key) => {
            const scale = FONT_SCALES[key];
            const meta = FONT_METADATA[key];
            const isActive = fontScale === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectFont(key)}
                aria-pressed={isActive}
                className={`text-left p-3.5 rounded-sm border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'border-[#DC2626] dark:border-red-500 ring-1 ring-[#DC2626]/30 bg-red-50/35 dark:bg-red-950/15'
                    : 'border-zinc-200 dark:border-[#272732] bg-zinc-50/70 dark:bg-[#101014] hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                    {meta.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[11px] font-bold ${
                      isActive
                        ? 'bg-[#990000] text-white'
                        : 'bg-zinc-200/80 dark:bg-[#1A1A22] text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {scale.label}
                  </span>
                </div>

                <div
                  className="font-extrabold text-zinc-900 dark:text-zinc-50 leading-none py-1"
                  style={{ fontSize: `${scale.px * 1.15}px` }}
                >
                  Aa Bb 123
                </div>

                <div className="space-y-0.5">
                  <div className="text-tiny font-bold text-[#990000] dark:text-red-400">
                    Base: {scale.px}px
                  </div>
                  <p className="text-tiny text-zinc-500 dark:text-zinc-400 leading-snug">
                    {meta.usage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vista previa en vivo */}
        <div className="rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#0B0B0D] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Vista previa en tiempo real ({activeScale.label} · {activeScale.px}px)
            </span>
            <span className="px-2 py-0.5 rounded-sm text-tiny font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Escala aplicada al instante
            </span>
          </div>

          <div className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
                  Ejemplo de Encabezado y Registro del Gimnasio
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Así se visualizarán los títulos, descripciones, badges y celdas de las tablas en todo el sistema.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-sm bg-[#990000] text-white text-xs font-bold uppercase tracking-wide">
                Acción Principal
              </span>
            </div>

            <div className="overflow-x-auto border border-zinc-200 dark:border-[#272732] rounded-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-[#1A1A22] border-b border-zinc-200 dark:border-[#272732]">
                    <th className="px-3 py-2 text-tiny font-bold uppercase text-zinc-600 dark:text-zinc-400">
                      Socio Universitario
                    </th>
                    <th className="px-3 py-2 text-tiny font-bold uppercase text-zinc-600 dark:text-zinc-400">
                      Disciplina
                    </th>
                    <th className="px-3 py-2 text-tiny font-bold uppercase text-zinc-600 dark:text-zinc-400">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-sm text-zinc-800 dark:text-zinc-200">
                    <td className="px-3 py-2 font-semibold">Carlos Mendoza · Reg. 220145890</td>
                    <td className="px-3 py-2">Musculación y Fuerza</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded-sm text-tiny font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        Vigente
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pie informativo */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#101014] text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Preferencias guardadas localmente: <strong className="text-zinc-900 dark:text-zinc-100">Tema {theme === 'dark' ? 'Oscuro' : 'Claro'}</strong> · Fuente <strong className="text-zinc-900 dark:text-zinc-100">{activeScale.label} ({activeScale.px}px)</strong>
        </span>
        <span className="text-tiny uppercase font-bold tracking-wider text-zinc-500">
          Sincronizado con la barra superior
        </span>
      </div>
    </div>
  );
};

export default ConfiguracionSistemaPage;
