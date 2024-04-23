import React from 'react';

interface LegendProps {
  modeColors: { [key: string]: string };
}

const MapLegend: React.FC<LegendProps> = ({ modeColors }) => {
  return (
    <div className="flex flex-col">
      <div className="font-bold text-md mb-2">Legend</div>
      <div className="flex flex-wrap">
        {Object.entries(modeColors).map(([mode, color]) => (
          <div key={mode} className="flex items-center mb-2 mr-4">
            <div
              className="w-4 h-4 mr-2 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <div>{mode}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
