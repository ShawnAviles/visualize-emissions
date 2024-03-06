import { useEffect, useRef } from "react";
import { select } from "d3";

interface XAxisTitleProps {
  height: number;
  width: number;
  text: string;
};

const xAxisTitle = ({ height, width, text }: XAxisTitleProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current)
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text(text);
    }
  }, [ref.current]);

  return <g ref={ref} />;
}

export default xAxisTitle