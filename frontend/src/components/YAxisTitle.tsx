import { useEffect, useRef } from "react";
import { select } from "d3";

interface YAxisTitleProps {
  height: number;
  width: number;
  text: string;
};


const YAxisTitle = ({ height, width, text }: YAxisTitleProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current)
        .append("text")
        .attr("x", - height / 2)
        .attr("y", width)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text(text);
    }
  }, [ref.current]);

  return <g ref={ref} />;
}

export default YAxisTitle