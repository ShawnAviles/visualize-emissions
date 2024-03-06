import {
  axisBottom,
  axisLeft,
  ScaleBand,
  scaleBand,
  ScaleLinear,
  scaleLinear,
  select
} from "d3";
import { useEffect, useRef } from "react";
import Title from "./Title";
import YAxisTitle from "./YAxisTitle";
import XAxisTitle from "./XAxisTitle";

const MARGIN = { top: 25, right: 25, bottom: 100, left: 100 };

type BarplotProps = {
  data: { name: string; value: number }[];
};

interface AxisBottomProps {
  scale: ScaleBand<string>;
  transform: string;
};

interface AxisLeftProps {
  scale: ScaleLinear<number, number, never>;
};

interface BarsProps {
  data: BarplotProps["data"];
  height: number;
  scaleX: AxisBottomProps["scale"];
  scaleY: AxisLeftProps["scale"];
};

function AxisBottom({ scale, transform }: AxisBottomProps) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
};

function AxisLeft({ scale }: AxisLeftProps) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisLeft(scale));
    }
  }, [scale]);

  return <g ref={ref} />;
};

function Bars({ data, height, scaleX, scaleY }: BarsProps) {
  return (
    <>
      {data.map(({ value, name }) => (
        <rect
          key={`bar-${name}`}
          x={scaleX(name)}
          y={scaleY(value)}
          width={scaleX.bandwidth()}
          height={height - scaleY(value)}
          fill= {name == "Cars" ? "#FF0000" : name == "Bus" ? "#FFA500" : name == "Trains" ? "#272B2E" : name == "Light Rail" ? "#C4A484" : name == "Subway" ? "#7B5343" : "#FFFFF" }
        />
      ))}
    </>
  );
};

const Barplot = ({ data }: BarplotProps) => {
  if (Object.keys(data).length == 0) return;
  const width =  700 - MARGIN.right - MARGIN.left;
  const height = 500 - MARGIN.top - MARGIN.bottom;

  const scaleX = scaleBand()
    .domain(data.map(({ name }) => name))
    .range([0, width])
    .padding(0.5);
  const scaleY = scaleLinear()
    .domain([0, Math.max(...data.map(({ value }) => value))])
    .range([height, 0]);

  return (
    <svg
      width={width + MARGIN.left + MARGIN.right}
      height={height + MARGIN.top + MARGIN.bottom}
      className="m-4"
    >
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        <Title height={height} width={width} text="Yearly CO2(g) Emissions From Each Mode of Transportation" />
        <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
        <XAxisTitle height={height} width={width} text="Modes of Transportation" />
        <YAxisTitle height={height} width={-60} text="Total Yearly Emission of CO2 (kg)" />
        <AxisLeft scale={scaleY} />
        <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
      </g>
    </svg>
  )
};

export default Barplot