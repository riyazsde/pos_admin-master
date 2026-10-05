// src/Components/Dashboard/HeatMapCities.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setHeatmapData,
  setHeatmapLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';
import { getCityName, SLICE_COLORS } from '../../utils/dashboardMaps';

const HeatMapCities = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { heatmap, heatmapLoading } = useAppSelector((state) => state.dashboard);

  // ✅ Fetch on mount
  useEffect(() => {
    if (heatmap) return;

    const fetchHeatmap = async () => {
      dispatch(setHeatmapLoading(true));
      try {
        const data = await dashboardService.getHeatmap();
        dispatch(setHeatmapData(data));
      } catch (err) {
        console.error('Heatmap fetch error:', err);
        dispatch(setHeatmapLoading(false));
      }
    };

    fetchHeatmap();
  }, [dispatch, heatmap]);

  // ✅ Transform API data → pie slices
  const rawData = heatmap?.data || [];
  const total = rawData.reduce(
    (sum, item) => sum + (item.restaurant_count || 0),
    0
  );

  let currentAngle = 0;
  const data = rawData.map((item, idx) => {
    const value = item.restaurant_count || 0;
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    const sweep = total > 0 ? (value / total) * 360 : 0;

    const slice = {
      name: getCityName(item.City_id),
      value: percentage,
      rawCount: value,
      color: SLICE_COLORS[idx % SLICE_COLORS.length],
      startAngle: currentAngle,
      endAngle: currentAngle + sweep,
    };

    currentAngle += sweep;
    return slice;
  });

  // ✅ Loading skeleton
  if (heatmapLoading && !heatmap) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center w-full h-full">
        <h2 className="text-lg font-bold mb-4 self-start text-black">
          {t('heatMap.title')}
        </h2>
        <div className="w-full aspect-square max-w-[280px] mt-2 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // ✅ Empty state
  if (data.length === 0 || total === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center w-full h-full">
        <h2 className="text-lg font-bold mb-4 self-start text-black">
          {t('heatMap.title')}
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          {t('heatMap.noData')}
        </div>
      </div>
    );
  }

  const createPath = (cx, cy, r, startAngle, endAngle, isHovered) => {
    const rad = isHovered ? r + 5 : r;
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + rad * Math.cos(start);
    const y1 = cy + rad * Math.sin(start);
    const x2 = cx + rad * Math.cos(end);
    const y2 = cy + rad * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${rad} ${rad} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (cx, cy, r, startAngle, endAngle) => {
    const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
    const tr = r * 0.65;
    return {
      x: cx + tr * Math.cos(midAngle),
      y: cy + tr * Math.sin(midAngle),
    };
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center w-full h-full">
      {/* ✅ Always translated title */}
      <h2 className="text-lg font-bold mb-4 self-start text-black">
        {t('heatMap.title')}
      </h2>

      <div className="relative w-full aspect-square max-w-[280px] mt-2">
        <svg width="100%" height="100%" viewBox="0 0 320 320">
          {data.map((slice, i) => {
            const cx = 160;
            const cy = 160;
            const r = 120;
            const isHovered = hoveredIndex === i;
            const textPos = getTextPosition(
              cx,
              cy,
              r,
              slice.startAngle,
              slice.endAngle
            );

            const sliceAngle = slice.endAngle - slice.startAngle;
            const showText = sliceAngle > 15;

            return (
              <g key={i}>
                <path
                  d={createPath(
                    cx,
                    cy,
                    r,
                    slice.startAngle,
                    slice.endAngle,
                    isHovered
                  )}
                  fill={slice.color}
                  stroke="#fff"
                  strokeWidth="4"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {showText && (
                  <>
                    <text
                      x={textPos.x}
                      y={textPos.y - 6}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="14"
                      fontWeight="700"
                    >
                      {slice.value}%
                    </text>
                    <text
                      x={textPos.x}
                      y={textPos.y + 12}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {slice.name}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">
            {data[hoveredIndex].name}: {data[hoveredIndex].rawCount} (
            {data[hoveredIndex].value}%)
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 w-full flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {data.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: slice.color }}
            />
            <span className="text-[10px] font-medium text-gray-700">
              {slice.name} ({slice.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatMapCities;