export type ShapeId = string
export type ShapeType =
  | "rectangle"
  | "square"
  | "circle"
  | "ellipse"
  | "triangle"
  | "diamond"
  | "pentagon"
  | "hexagon"
  | "octagon"
  | "star"
  | "line"
  | "arrow"
  | "connector"
  | "path"
  | "text"
  | "image"
  | "sticky"
  | "frame"
  | "group"
  | "container";

export type ShapeColor = {
    fill: string | null;
    stroke: string | null;
    text: string | null;
  };

export type ShapeStyle = {
  color: ShapeColor;

  strokeWidth: number;
  strokeStyle: "solid" | "dashed" | "dotted";

  opacity: number;
  fillOpacity: number;

  borderRadius: number;

  shadow: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  roughness?: number;

  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
};

export interface BaseShape{
  id: ShapeId,
  type: ShapeType,
  x: number,
  y: number,
  radius:number,
  width: number,
  height: number,
  rotation: number,
  zIndex: number,
  opacity: number,
  shapestyle:ShapeStyle
}
