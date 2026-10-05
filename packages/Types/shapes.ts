import type {
  RectangleShape,
  SquareShape,
  CircleShape,
  EllipseShape,
  TriangleShape,
  DiamondShape,
  PentagonShape,
  HexagonShape,
  OctagonShape,
  StarShape,
  LineShape,
  ArrowShape,
  ConnectorShape,
  PathShape,
  TextShape,
  ImageShape,
  StickyShape,
  FrameShape,
  GroupShape,
  ContainerShape,
} from "@engine/shapes";

export type Shape =
  | RectangleShape
  | SquareShape
  | CircleShape
  | EllipseShape
  | TriangleShape
  | DiamondShape
  | PentagonShape
  | HexagonShape
  | OctagonShape
  | StarShape
  | LineShape
  | ArrowShape
  | ConnectorShape
  | PathShape
  | TextShape
  | ImageShape
  | StickyShape
  | FrameShape
  | GroupShape
  | ContainerShape;

export const renderShape = (shape: Shape) => {
  switch (shape.type) {
    case "rectangle":
      // return renderRectangle(shape);

    case "square":
      // return renderSquare(shape);

    case "circle":
      // return renderCircle(shape);

    case "ellipse":
      // return renderEllipse(shape);

    case "triangle":
      // return renderTriangle(shape);

    case "diamond":
      // return renderDiamond(shape);

    case "pentagon":
      // return renderPentagon(shape);

    case "hexagon":
      // return renderHexagon(shape);

    case "octagon":
      // return renderOctagon(shape);

    case "star":
      // return renderStar(shape);

    case "line":
      // return renderLine(shape);

    case "arrow":
      // return renderArrow(shape);

    case "connector":
      // return renderConnector(shape);

    case "path":
      // return renderPath(shape);

    case "text":
      // return renderText(shape);

    case "image":
      // return renderImage(shape);

    case "sticky":
      // return renderSticky(shape);

    case "frame":
      // return renderFrame(shape);

    case "group":
      // return renderGroup(shape);

    case "container":
      // return renderContainer(shape);

    default:
      // return assertNever(shape);
  }
};

const assertNever = (shape: never): never => {
  throw new Error(`Unsupported shape type: ${(shape as Shape).type}`);
};