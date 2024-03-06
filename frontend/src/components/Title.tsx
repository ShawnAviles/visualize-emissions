import { useEffect, useRef } from "react";
import { select } from "d3";

interface TitleProps {
  height: number;
  width: number;
  text: string;
}

const Title = ({ height, width, text }: TitleProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current)
        .append("text")
        .attr("x", width / 2)
        .attr("y", (height / 15) - 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .attr("font-weight", "bold")
        .text(text);
    }
  }, [ref.current]);

  return <g ref={ref} />;
};

export default Title