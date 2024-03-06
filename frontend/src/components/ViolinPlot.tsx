import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import ViolinShape  from "./ViolinShape";
import Title from "./Title";
import XAxisTitle from "./XAxisTitle";
import YAxisTitle from "./YAxisTitle";

const MARGIN = { top: 30, right: 100, bottom: 50, left: 100 };

type ViolinProps = {
  width: number;
  height: number;
  data: { name: string; value: number }[];
};

const ViolinPlot = ({ width, height, data }: ViolinProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Compute everything derived from the dataset:
  const { min, max, groups } = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.value)) as [number, number];
    const groups = data
      .map((d) => d.name)
      .filter((x, i, a) => a.indexOf(x) == i);
    return { min, max, groups };
  }, [data]);

  // Compute scales
  const yScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([boundsHeight, 0])
    .nice();

  const xScale = d3
    .scaleBand()
    .range([0, boundsWidth])
    .domain(groups)
    .padding(0.25);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const allShapes = groups.map((group, i) => {
    const groupData = data.filter((d) => d.name === group).map((d) => d.value);
    return (
      <g key={i} transform={`translate(${xScale(group)},0)`}>
        <ViolinShape
          data={groupData}
          yScale={yScale}
          width={xScale.bandwidth()}
          binNumber={20}
        />
      </g>
    );
  });
  return (
    <div>
      <svg className="ml-4" width={width} height={height} style={{ display: "inline-block" }}>
        {/* first group is for the violin and box shapes */}
        <Title height={height + 250 } width={width} text="ViolIn Plot for Emissions of Top 5 Zip Codes" />
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allShapes}
        </g>
        {/* Second is for the axes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
        <YAxisTitle height={height} width={50} text="Frequency of Emissions" />
        <XAxisTitle height={height - 50} width={width} text="Zip Codes" />
      </svg>
    </div>
  )
}

export default ViolinPlot