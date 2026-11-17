import React from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  Mail,
  AlertTriangle,
  Map,
  BookOpen,
  Cookie,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Footer } from './Footer';

export type LegalModalType = 'terms' | 'privacy' | null;

export { Footer as LegalFooter };

interface LegalModalProps {
  activeModal: LegalModalType;
  onClose: () => void;
  onSwitchModal: (type: 'terms' | 'privacy') => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  activeModal,
  onClose,
  onSwitchModal,
}) => {
  const { language, t } = useTranslation();

  if (!activeModal) return null;

  const isTerms = activeModal === 'terms';
  const isEn = language === 'en';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-[#0F1C30] border-2 border-[#D4AF37]/70 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-[#F8FAFC] overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#09111E] via-[#0F1C30] to-[#1E3A8A]/40 border-b border-slate-700/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#09111E] border border-[#D4AF37]/70 flex items-center justify-center shrink-0">
              {isTerms ? (
                <Scale className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              )}
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
                {isEn
                  ? 'KEYSTONE CHRONOMAP · OFFICIAL LEGAL & INSTITUTIONAL NOTICE'
                  : 'KEYSTONE CHRONOMAP · AVISO LEGAL E INSTITUCIONAL'}
              </div>
              <h2
                id="legal-modal-title"
                className="font-serif text-lg sm:text-xl font-bold text-[#F8FAFC] leading-snug"
              >
                {isTerms
                  ? isEn
                    ? 'Terms of Use & Official Disclaimer'
                    : 'Términos de Uso y Descargo Oficial'
                  : isEn
                    ? 'Privacy Policy'
                    : 'Política de Privacidad'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close modal window' : 'Cerrar ventana modal'}
            className="p-2 rounded-xl bg-[#09111E] hover:bg-[#B22234] border border-slate-700 hover:border-[#D4AF37] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tab Switcher between Terms and Privacy */}
        <div className="px-5 py-2 bg-[#09111E]/90 border-b border-slate-800 flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => onSwitchModal('terms')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              isTerms
                ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC]'
                : 'bg-[#0F1C30] border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {isEn
                ? 'Terms of Use & Official Disclaimer'
                : 'Términos de Uso y Descargo Oficial'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onSwitchModal('privacy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              !isTerms
                ? 'bg-[#1D4ED8] border-[#D4AF37] text-[#F8FAFC]'
                : 'bg-[#0F1C30] border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isEn ? 'Privacy Policy' : 'Política de Privacidad'}</span>
          </button>
        </div>

        {/* Scrollable Legal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm leading-relaxed text-slate-200">
          {isTerms ? (
            isEn ? (
              <>
                <section className="p-4 rounded-xl bg-[#09111E]/90 border border-[#D4AF37]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <h3>1. Official Institutional Disclaimer</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Keystone ChronoMap — Historical Cartographic Atlas of Pennsylvania</strong> is a <strong>100% independent</strong> historical, cartographic, and educational outreach platform. This application is <strong>NOT affiliated with, endorsed by, or sponsored by</strong> the <em>Commonwealth of Pennsylvania</em>, the Pennsylvania Department of Transportation (<em>PennDOT</em>), the <em>Pennsylvania Historical and Museum Commission (PHMC)</em>, or any federal, state, or municipal government agency.
                  </p>
                </section>

                <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                    <Map className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <h3>2. Cartographic & Historical Accuracy</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    All historical maps, colonial boundaries, territorial evolutions (1681–Present), routes, markers, and demographic time series are presented for <strong>educational, cultural, and visual reference purposes only</strong>. Due to the nature of historical surveys and archival records, boundary lines may contain generalizations and <strong>must not be used under any circumstances for legal land surveying, property boundary determination, or real-time navigation</strong>.
                  </p>
                </section>

                <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                    <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <h3>3. Intellectual Property & Public Domain Sources</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    The interface design, software architecture, original 2D/3D illustrations, and interactive visualizations belong to <strong>Keystone ChronoMap</strong>. Base maps, public-domain historical cartography, geographic datasets, and archival citations belong to their respective authors or institutional repositories (including the <em>Library of Congress</em>, <em>National Archives</em>, <em>David Rumsey Map Collection</em>, <em>U.S. Census Bureau</em>, and <em>Wikimedia Commons</em>).
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="p-4 rounded-xl bg-[#09111E]/90 border border-[#D4AF37]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <h3>1. Descargo de Responsabilidad Oficial</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Keystone ChronoMap — Atlas Cartográfico Histórico de Pensilvania</strong> es una plataforma de divulgación histórica, cartográfica y educativa <strong>100% independiente</strong>. Esta aplicación <strong>NO está afiliada, asociada, autorizada ni respaldada</strong> por la Mancomunidad de Pensilvania (<em>Commonwealth of Pennsylvania</em>), el Departamento de Transporte de Pensilvania (<em>PennDOT</em>), la Comisión Histórica y de Museos de Pensilvania (<em>Pennsylvania Historical and Museum Commission — PHMC</em>), ni por ninguna otra agencia gubernamental federal, estatal o municipal.
                  </p>
                </section>

                <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                    <Map className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <h3>2. Precisión Cartográfica e Histórica</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Todos los mapas históricos, fronteras antiguas, evolución territorial (1681–Presente), rutas históricas, marcadores y datos cronológicos o demográficos se presentan con fines <strong>exclusivamente educativos, culturales y de referencia visual</strong>. Debido a la naturaleza de las fuentes coloniales y registros históricos, los trazados pueden contener generalizaciones o imprecisiones propias de los mapas de época y <strong>no deben utilizarse bajo ninguna circunstancia para agrimensura legal, determinación de límites de propiedad actuales, peritajes jurídicos ni navegación en tiempo real</strong>.
                  </p>
                </section>

                <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                  <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                    <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <h3>3. Propiedad Intelectual y Fuentes de Dominio Público</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    El diseño de la interfaz, la arquitectura de software, las ilustraciones originales en 2D/3D y la visualización interactiva pertenecen a <strong>Keystone ChronoMap</strong>. Por su parte, los mapas base, cartografía histórica de dominio público, datos geográficos y registros documentales citados pertenecen a sus respectivos autores, cartógrafos o repositorios institucionales (incluyendo archivos públicos de la <em>Library of Congress</em>, <em>National Archives</em>, <em>David Rumsey Map Collection</em>, <em>U.S. Census Bureau</em> y <em>Wikimedia Commons</em>).
                  </p>
                </section>
              </>
            )
          ) : isEn ? (
            <>
              <section className="p-4 rounded-xl bg-[#09111E]/90 border border-[#D4AF37]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
                  <Database className="w-4 h-4 shrink-0" />
                  <h3>1. Data Usage & Anonymous Browsing</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Exploring <strong>Keystone ChronoMap</strong> is free and <strong>requires no user account registration or collection of sensitive personal data</strong>. Solely to optimize the technical performance of the interactive atlas, 2D/3D rendering stability, and educational experience, the system may store local preferences (such as active language or field trip stops in browser storage).
                </p>
              </section>

              <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                  <Cookie className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <h3>2. Cookies & Third-Party Map Services</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This site uses base map providers (cartographic APIs such as Google Maps Platform) and public encyclopedic repositories (Wikipedia / Open-Meteo). Users can manage, block, or disable cookies at any time directly from their web browser privacy settings, or manage ad preferences via{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] underline hover:text-[#F8FAFC] inline-flex items-center gap-1"
                  >
                    <span>Google Ad Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </p>
              </section>

              <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <h3>3. Contact for Privacy & Historical Reports</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  For any inquiry regarding this Privacy Policy or to submit historical accuracy suggestions, you may reach us directly at:
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <a
                    href="mailto:contacto@keystonechronomap.com"
                    className="px-3 py-1.5 rounded-lg bg-[#1E3A8A]/60 hover:bg-[#1E3A8A] border border-[#D4AF37]/60 text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>contacto@keystonechronomap.com</span>
                  </a>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="p-4 rounded-xl bg-[#09111E]/90 border border-[#D4AF37]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
                  <Database className="w-4 h-4 shrink-0" />
                  <h3>1. Uso de Datos y Exploración Anónima</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  La exploración de <strong>Keystone ChronoMap</strong> es libre y <strong>no requiere registro de cuentas de usuario ni recopilación de datos personales sensibles</strong>. Con el único propósito de optimizar el rendimiento técnico del atlas interactivo, la estabilidad del renderizado 2D/3D y la experiencia educativa, el sistema guarda preferencias locales en el navegador (como idioma activo o paradas de excursión).
                </p>
              </section>

              <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                  <Cookie className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <h3>2. Cookies y Servicios Cartográficos de Terceros</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Este sitio utiliza proveedores de mapas base (APIs cartográficas como Google Maps Platform) y fuentes enciclopédicas públicas (Wikipedia / Open-Meteo). Los usuarios pueden gestionar, bloquear o desactivar las cookies en cualquier momento desde la configuración de privacidad de su navegador web, o administrar sus preferencias en la{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] underline hover:text-[#F8FAFC] inline-flex items-center gap-1"
                  >
                    <span>Configuración de Anuncios de Google</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </p>
              </section>

              <section className="p-4 rounded-xl bg-[#09111E]/75 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-[#F8FAFC] font-serif font-bold text-base">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <h3>3. Contacto para Privacidad y Reportes Históricos</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Para cualquier consulta relacionada con esta Política de Privacidad o envío de sugerencias y reportes de precisión histórica, puedes comunicarte directamente a través de:
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <a
                    href="mailto:contacto@keystonechronomap.com"
                    className="px-3 py-1.5 rounded-lg bg-[#1E3A8A]/60 hover:bg-[#1E3A8A] border border-[#D4AF37]/60 text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>contacto@keystonechronomap.com</span>
                  </a>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Bottom Modal Footer with Clear Close Button */}
        <div className="px-5 py-3.5 bg-[#09111E] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[#94A3B8] text-center sm:text-left">
            {t.footer.copyrightLine}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E3A8A] border border-[#D4AF37] text-xs font-bold text-[#F8FAFC] transition-all cursor-pointer"
          >
            {isEn ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

