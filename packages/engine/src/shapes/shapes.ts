import type { BaseShape } from "./core";

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  radius: number;
}

export interface SquareShape extends BaseShape {
  type: "square";
  radius: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
}

export interface EllipseShape extends BaseShape {
  type: "ellipse";
}

export interface TriangleShape extends BaseShape {
  type: "triangle";
}

export interface DiamondShape extends BaseShape {
  type: "diamond";
}

export interface PentagonShape extends BaseShape {
  type: "pentagon";
}

export interface HexagonShape extends BaseShape {
  type: "hexagon";
}

export interface OctagonShape extends BaseShape {
  type: "octagon";
}

export interface StarShape extends BaseShape {
  type: "star";
  points: number;
  innerRadius: number;
}

export interface LineShape extends BaseShape {
  type: "line";
  x2: number;
  y2: number;
}

export interface ArrowShape extends BaseShape {
  type: "arrow";
  x2: number;
  y2: number;
  startArrow?: boolean;
  endArrow?: boolean;
}

export interface ConnectorShape extends BaseShape {
  type: "connector";
  points: Array<{
    x: number;
    y: number;
  }>;
  startArrow?: boolean;
  endArrow?: boolean;
}

export interface PathShape extends BaseShape {
  type: "path";
  points: Array<{
    x: number;
    y: number;
  }>;
}

export interface TextShape extends BaseShape {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
}

export interface ImageShape extends BaseShape {
  type: "image";
  src: string;
  alt?: string;
}

export interface StickyShape extends BaseShape {
  type: "sticky";
  text: string;
  color: string;
}

export interface FrameShape extends BaseShape {
  type: "frame";
  title?: string;
}

export interface GroupShape extends BaseShape {
  type: "group";
  children: string[];
}

export interface ContainerShape extends BaseShape {
  type: "container";
  children: string[];
}