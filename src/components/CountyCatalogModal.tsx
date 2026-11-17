import React, { useState, useMemo } from 'react';
import { X, ArrowUpDown, Search, MapPin } from 'lucide-react';
import {
  ALL_COUNTIES_LIST,
  CountyRecord,
  HistoricalEra,
  PA_REGIONS,
  RegionId,
} from '../data/paCountiesData';

interface CountyCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCounty: (county: CountyRecord) => void;
  activeEra: HistoricalEra;
}

type SortField = 'name' | 'founded' | 'areaSqMi' | 'countySeat';

export const CountyCatalogModal: React.FC<CountyCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectCounty,
  activeEra,
}) => {
  const [filterText, setFilterText] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionId | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('founded');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedCounties = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return ALL_COUNTIES_LIST.filter((c) => {
      if (regionFilter !== 'all' && c.region !== regionFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.countySeat.toLowerCase().includes(q) ||
        String(c.founded).includes(q) ||
        c.etymology.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'countySeat')
        cmp = a.countySeat.localeCompare(b.countySeat);
      else if (sortField === 'founded')
        cmp = a.founded - b.founded || a.name.localeCompare(b.name);
      else if (sortField === 'areaSqMi') cmp = a.areaSqMi - b.areaSqMi;
      return sortAsc ? cmp : -cmp;
    });
  }, [filterText, regionFilter, sortField, sortAsc]);

  if (!isOpen) return null;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D0F12]/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Catálogo Histórico de los 67 Condados de Pensilvania"
    >
      <div className="w-full max-w-5xl max-h-[85vh] bg-[#161920]/95 border border-[#C5A059]/40 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#C5A059]/25 flex items-center justify-between gap-4 bg-[#0D0F12]/60">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              REGISTRO ARCHIVÍSTICO DE LA MANCOMUNIDAD · 1682–1878
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F4F1EA]">
              Índice Cartográfico de los 67 Condados de Pensilvania
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar índice"
            className="p-2 rounded-lg bg-[#0D0F12] border border-[#C5A059]/30 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Sort Controls */}
        <div className="px-6 py-3 border-b border-[#C5A059]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#161920]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#A39E93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar por condado, sede, año o etimología..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0D0F12] border border-[#C5A059]/30 rounded-lg text-[#F4F1EA] placeholder-[#A39E93]/70 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setRegionFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer ${
                regionFilter === 'all'
                  ? 'bg-[#D4AF37] text-[#0D0F12] font-semibold'
                  : 'bg-[#0D0F12]/70 text-[#A39E93] hover:text-[#F4F1EA]'
              }`}
            >
              Todas ({ALL_COUNTIES_LIST.length})
            </button>
            {Object.values(PA_REGIONS).map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setRegionFilter(reg.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  regionFilter === reg.id
                    ? 'bg-[#1D3557] text-[#F4F1EA] border border-[#D4AF37]'
                    : 'bg-[#0D0F12]/70 text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-xs"
                  style={{ backgroundColor: reg.badgeColor }}
                />
                <span>{reg.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0D0F12] border-b border-[#C5A059]/30 text-[11px] uppercase tracking-[0.15em] text-[#A39E93] z-10">
              <tr>
                <th className="py-3 px-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>Condado</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('founded')}
                    className="flex items-center gap-1 hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>Fundación</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('countySeat')}
                    className="flex items-center gap-1 hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>Sede (County Seat)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold hidden md:table-cell">
                  Región Histórica
                </th>
                <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort('areaSqMi')}
                    className="inline-flex items-center gap-1 hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>Superficie</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/15 text-xs">
              {sortedCounties.map((county) => {
                const reg = PA_REGIONS[county.region];
                const inEra = county.founded <= activeEra.cutoffYear;
                return (
                  <tr
                    key={county.fips}
                    onClick={() => {
                      onSelectCounty(county);
                      onClose();
                    }}
                    className="hover:bg-[#1D3557]/35 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-serif text-sm font-semibold text-[#F4F1EA] group-hover:text-[#D4AF37]">
                      {county.name}
                      <span className="ml-2 font-mono text-[10px] text-[#A39E93] font-normal tabular-nums">
                        #{county.fips}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs tabular-nums">
                      <span
                        className={
                          inEra
                            ? 'text-[#D4AF37] font-semibold'
                            : 'text-[#A39E93]'
                        }
                      >
                        {county.founded}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F4F1EA]/90">
                      {county.countySeat}
                    </td>
                    <td className="py-3 px-4 text-[#A39E93] hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-xs"
                          style={{ backgroundColor: reg.badgeColor }}
                        />
                        <span>{reg.spanishTitle}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#A39E93] tabular-nums hidden sm:table-cell">
                      {county.areaSqMi.toLocaleString('es-ES')} mi²
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[#D4AF37] group-hover:underline font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>Encuadrar</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CountyCatalogModal;
