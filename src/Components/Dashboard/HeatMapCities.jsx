import React, { useState } from 'react';

const HeatMapCities = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = [
    { name: 'Johannesburg', value: 30, color: '#525B7A', startAngle: 0, endAngle: 108 },
    { name: 'Cairo', value: 15, color: '#FF7A1A', startAngle: 108, endAngle: 162 },
    { name: 'Cape Town', value: 35, color: '#2563EB', startAngle: 162, endAngle: 288 },
    { name: 'Nairobi', value: 20, color: '#FF00FF', startAngle: 288, endAngle: 360 }
  ];

  const createPath = (cx, cy, r, startAngle, endAngle, isHovered) => {
    // Reduced hover effect from 8 to 5 so it doesn't jump out of the container too much
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
    // Increased from 0.6 to 0.65 to push the text slightly outward like the Figma image
    const tr = r * 0.65; 
    return {
      x: cx + tr * Math.cos(midAngle),
      y: cy + tr * Math.sin(midAngle)
    };
  };

  return (
    // Wrapped in matching white card style, removed fixed height so it stretches to match the table
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center w-full h-full">
      <h2 className="text-lg font-bold mb-4 self-start text-black">
        Heat Map(<span className="font-bold">Cities</span>)
      </h2>
      <div className="relative w-full aspect-square max-w-[280px] mt-2">
        <svg width="100%" height="100%" viewBox="0 0 320 320">
          {data.map((slice, i) => {
            const cx = 160;
            const cy = 160;
            const r = 120;
            const isHovered = hoveredIndex === i;
            const textPos = getTextPosition(cx, cy, r, slice.startAngle, slice.endAngle);

            return (
              <g key={i}>
                <path
                  d={createPath(cx, cy, r, slice.startAngle, slice.endAngle, isHovered)}
                  fill={slice.color}
                  stroke="#fff"
                  // Reduced stroke width from 6 to 4 to match the thinner lines in the image
                  strokeWidth="4" 
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
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
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default HeatMapCities;