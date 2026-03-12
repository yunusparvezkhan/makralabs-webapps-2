import type { SVGProps } from "react";
import { cn } from "@makralabs/utils";

export interface HorizontalBarChartDatum {
  primaryLabel: string;
  secondaryLabel?: string;
  value: number;
  bgColor?: string;
  strokeColor?: string;
  textColor?: string;
  id?: string;
}

export interface BarHorizontalProps
  extends Omit<SVGProps<SVGSVGElement>, "viewBox" | "width" | "height"> {
  data: HorizontalBarChartDatum[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
  minBarLength?: number;
  emptyStateLabel?: string;
  formatSecondaryLabel?: (
    datum: HorizontalBarChartDatum,
    index: number
  ) => string | undefined;
}

type Point = {
  x: number;
  y: number;
};

const VIEWBOX_WIDTH = 369;
const VIEWBOX_HEIGHT = 208;

const AXIS_ORIGIN_X = 40;
const AXIS_ORIGIN_Y = 167;
const X_AXIS_END_X = 353.63;
const Y_AXIS_END_Y = 13.37;

const PLOT_TOP_Y = 37;
const PLOT_BOTTOM_Y = 137;
const BAR_START_X = 60;
const BAR_MAX_WIDTH = 270;

const FONT_FAMILY = "var(--font-open-sans, ui-sans-serif, system-ui, sans-serif)";
const AXIS_STROKE = "#606060";
const DEFAULT_BAR_FILL = "#d5e8d4";
const EMPTY_LABEL = "No data";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function pointsToPath(points: Point[], closed = false) {
  if (points.length === 0) {
    return "";
  }

  const first = points[0]!;
  const rest = points.slice(1);
  const path = [`M ${first.x} ${first.y}`];

  for (const point of rest) {
    path.push(`L ${point.x} ${point.y}`);
  }

  if (closed) {
    path.push("Z");
  }

  return path.join(" ");
}

function estimateTextWidth(text: string, fontSize = 12) {
  return text.length * fontSize * 0.56;
}

function normalizeHexColor(color: string) {
  const value = color.trim();

  if (!value.startsWith("#")) {
    return null;
  }

  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }

  if (value.length === 7) {
    return value.toLowerCase();
  }

  return null;
}

function hexToRgb(color: string) {
  const normalized = normalizeHexColor(color);

  if (!normalized) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function darkenColor(color: string, amount = 0.22) {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return color;
  }

  return rgbToHex(
    rgb.r * (1 - amount),
    rgb.g * (1 - amount),
    rgb.b * (1 - amount)
  );
}

function getContrastingTextColor(color: string) {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return "#111111";
  }

  const luminance =
    (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;

  return luminance > 0.6 ? "#111111" : "#ffffff";
}

function buildBarPolygon(
  x: number,
  y: number,
  width: number,
  height: number,
  index: number
) {
  const tilt = index % 2 === 0 ? 0.8 : -0.5;
  const points = [
    { x: x, y: y + 0.8 },
    { x: x + width, y: y + tilt },
    { x: x + width - 1, y: y + height - 0.4 },
    { x: x + 0.4, y: y + height + 0.8 },
  ];

  const overlay = [
    { x: x + 0.8, y: y + 0.3 },
    { x: x + width - 0.6, y: y + tilt + 0.5 },
    { x: x + width - 0.2, y: y + height - 0.8 },
    { x: x + 0.7, y: y + height + 0.2 },
  ];

  return {
    fillPath: buildSketchPath(points, index * 1.7 + 1, 1.15, true),
    strokePath: buildSketchPath(overlay, index * 1.7 + 7, 0.9, true),
  };
}

function buildSketchPath(
  points: Point[],
  seed: number,
  amplitude: number,
  closed = false
) {
  if (points.length === 0) {
    return "";
  }

  const pathPoints = [...points];

  if (closed) {
    pathPoints.push(points[0]!);
  }

  const commands: string[] = [];
  const first = pathPoints[0]!;
  commands.push(`M ${first.x} ${first.y}`);

  for (let edgeIndex = 0; edgeIndex < pathPoints.length - 1; edgeIndex += 1) {
    const start = pathPoints[edgeIndex]!;
    const end = pathPoints[edgeIndex + 1]!;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const steps = Math.max(3, Math.ceil(length / 28));

    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const x = start.x + dx * t;
      const y = start.y + dy * t;
      const wave =
        Math.sin(seed * 0.83 + edgeIndex * 1.91 + t * Math.PI * 2) * amplitude +
        Math.cos(seed * 1.27 + edgeIndex * 0.67 + t * Math.PI * 4) *
          amplitude *
          0.32;

      commands.push(`L ${x + nx * wave} ${y + ny * wave}`);
    }
  }

  if (closed) {
    commands.push("Z");
  }

  return commands.join(" ");
}

export function BarHorizontal({
  data,
  xAxisLabel = "",
  yAxisLabel = "",
  title = "Horizontal bar chart",
  minValue,
  maxValue,
  minBarLength = 8,
  emptyStateLabel = EMPTY_LABEL,
  formatSecondaryLabel,
  className,
  width = 400,
  height = 400,
  ...props
}: BarHorizontalProps) {
  const values = data.map((datum) => datum.value);
  const resolvedMinValue =
    minValue ?? (values.length > 0 ? Math.min(0, ...values) : 0);
  const resolvedMaxValue =
    maxValue ?? (values.length > 0 ? Math.max(0, ...values, 1) : 1);

  const domainSpan = resolvedMaxValue - resolvedMinValue || 1;
  const zeroX =
    BAR_START_X + ((0 - resolvedMinValue) / domainSpan) * BAR_MAX_WIDTH;

  const chartTitle = `${title}${xAxisLabel ? `, x-axis ${xAxisLabel}` : ""}${
    yAxisLabel ? `, y-axis ${yAxisLabel}` : ""
  }`;

  const plotHeight = PLOT_BOTTOM_Y - PLOT_TOP_Y;
  const preferredGap = data.length > 3 ? 14 : 25;
  const gap = data.length <= 1 ? 0 : preferredGap;
  const rawBarHeight =
    data.length === 0
      ? 32
      : (plotHeight - gap * Math.max(data.length - 1, 0)) / data.length;
  const barHeight = clamp(rawBarHeight, 18, 40);
  const usedHeight = data.length * barHeight + Math.max(data.length - 1, 0) * gap;
  const topOffset = PLOT_TOP_Y + Math.max((plotHeight - usedHeight) / 2, 0);

  const hasData = data.length > 0;

  return (
    <svg
      aria-label={chartTitle}
      className={cn("block", className)}
      height={height}
      role="img"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{chartTitle}</title>

      <g fill="none" stroke={AXIS_STROKE} strokeLinecap="round" strokeLinejoin="round">
        <path d={pointsToPath([
          { x: AXIS_ORIGIN_X, y: AXIS_ORIGIN_Y },
          { x: 114.69, y: 165.83 },
          { x: 191.81, y: 167.64 },
          { x: X_AXIS_END_X, y: AXIS_ORIGIN_Y },
        ])} />
        <path d={pointsToPath([
          { x: AXIS_ORIGIN_X, y: AXIS_ORIGIN_Y },
          { x: 149.78, y: 164.9 },
          { x: 260.82, y: 163.89 },
          { x: X_AXIS_END_X, y: AXIS_ORIGIN_Y },
        ])} />
        <path d={pointsToPath([
          { x: AXIS_ORIGIN_X, y: AXIS_ORIGIN_Y },
          { x: 45.14, y: 128.39 },
          { x: 43.39, y: 93.77 },
          { x: AXIS_ORIGIN_X, y: Y_AXIS_END_Y },
        ])} />
        <path d={pointsToPath([
          { x: AXIS_ORIGIN_X, y: AXIS_ORIGIN_Y },
          { x: 38.78, y: 133.09 },
          { x: 38.89, y: 99.71 },
          { x: AXIS_ORIGIN_X, y: Y_AXIS_END_Y },
        ])} />
        <path d={pointsToPath([
          { x: 351.88, y: 163.5 },
          { x: 358.88, y: AXIS_ORIGIN_Y },
          { x: 351.88, y: 170.5 },
        ])} />
        <path d={pointsToPath([
          { x: 36.5, y: 15.12 },
          { x: AXIS_ORIGIN_X, y: 8.12 },
          { x: 43.5, y: 15.12 },
        ])} />
      </g>

      {hasData ? (
        <g>
          {data.map((datum, index) => {
            const scaledStart =
              BAR_START_X +
              ((Math.min(datum.value, 0) - resolvedMinValue) / domainSpan) *
                BAR_MAX_WIDTH;
            const scaledEnd =
              BAR_START_X +
              ((Math.max(datum.value, 0) - resolvedMinValue) / domainSpan) *
                BAR_MAX_WIDTH;

            const naturalWidth = Math.abs(scaledEnd - scaledStart);
            const barWidth =
              datum.value === 0 ? minBarLength : Math.max(naturalWidth, minBarLength);
            const barX =
              datum.value >= 0
                ? scaledStart
                : clamp(scaledEnd - barWidth, BAR_START_X, BAR_START_X + BAR_MAX_WIDTH);
            const barY = topOffset + index * (barHeight + gap);

            const { fillPath, strokePath } = buildBarPolygon(
              barX,
              barY,
              barWidth,
              barHeight,
              index
            );

            const fill = datum.bgColor ?? DEFAULT_BAR_FILL;
            const stroke = datum.strokeColor ?? darkenColor(fill);
            const textColor = datum.textColor ?? getContrastingTextColor(fill);
            const secondaryLabel =
              formatSecondaryLabel?.(datum, index) ?? datum.secondaryLabel ?? "";
            const primaryWidth = estimateTextWidth(datum.primaryLabel);
            const secondaryWidth = estimateTextWidth(secondaryLabel);
            const insidePadding = 12;
            const gapBetweenLabels = secondaryLabel ? 16 : 0;
            const availableInsideWidth = Math.max(barWidth - insidePadding * 2, 0);
            const canFitBothInside =
              availableInsideWidth >= primaryWidth + secondaryWidth + gapBetweenLabels;
            const canFitPrimaryInside =
              availableInsideWidth >= primaryWidth + 2;
            const textY = barY + barHeight / 2 + 4;

            const insideLeftX = barX + insidePadding;
            const insideRightX = barX + barWidth - insidePadding;
            const outsideRightX = barX + barWidth + 8;
            const outsideLeftX = barX - 8;
            const primaryOutsideX = datum.value >= 0 ? outsideRightX : outsideLeftX;
            const secondaryOutsideX = datum.value >= 0 ? outsideRightX : outsideLeftX;
            const outsideAnchor = datum.value >= 0 ? "start" : "end";

            return (
              <g key={datum.id ?? `${datum.primaryLabel}-${datum.value}-${index}`}>
                <path d={fillPath} fill={fill} opacity="0.95" />
                <path
                  d={strokePath}
                  fill="none"
                  stroke={stroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {canFitBothInside ? (
                  <>
                    <text
                      fill={textColor}
                      fontFamily={FONT_FAMILY}
                      fontSize="12"
                      textAnchor="start"
                      x={insideLeftX}
                      y={textY}
                    >
                      {datum.primaryLabel}
                    </text>
                    {secondaryLabel ? (
                      <text
                        fill={textColor}
                        fontFamily={FONT_FAMILY}
                        fontSize="12"
                        textAnchor="end"
                        x={insideRightX}
                        y={textY}
                      >
                        {secondaryLabel}
                      </text>
                    ) : null}
                  </>
                ) : canFitPrimaryInside ? (
                  <>
                    <text
                      fill={textColor}
                      fontFamily={FONT_FAMILY}
                      fontSize="12"
                      textAnchor="start"
                      x={insideLeftX}
                      y={textY}
                    >
                      {datum.primaryLabel}
                    </text>
                    {secondaryLabel ? (
                      <text
                        fill="#4d4d4d"
                        fontFamily={FONT_FAMILY}
                        fontSize="12"
                        textAnchor={outsideAnchor}
                        x={secondaryOutsideX}
                        y={textY}
                      >
                        {secondaryLabel}
                      </text>
                    ) : null}
                  </>
                ) : (
                  <>
                    <text
                      fill="#1f1f1f"
                      fontFamily={FONT_FAMILY}
                      fontSize="12"
                      textAnchor={outsideAnchor}
                      x={primaryOutsideX}
                      y={textY - (secondaryLabel ? 6 : 0)}
                    >
                      {datum.primaryLabel}
                    </text>
                    {secondaryLabel ? (
                      <text
                        fill="#4d4d4d"
                        fontFamily={FONT_FAMILY}
                        fontSize="12"
                        textAnchor={outsideAnchor}
                        x={secondaryOutsideX}
                        y={textY + 9}
                      >
                        {secondaryLabel}
                      </text>
                    ) : null}
                  </>
                )}
              </g>
            );
          })}

          {resolvedMinValue < 0 && resolvedMaxValue > 0 ? (
            <path
              d={pointsToPath([
                { x: zeroX, y: PLOT_TOP_Y - 4 },
                { x: zeroX + 0.8, y: PLOT_BOTTOM_Y + 6 },
              ])}
              opacity="0.35"
              stroke={AXIS_STROKE}
              strokeDasharray="3 4"
            />
          ) : null}
        </g>
      ) : (
        <text
          fill="#5b5b5b"
          fontFamily={FONT_FAMILY}
          fontSize="12"
          textAnchor="middle"
          x={BAR_START_X + BAR_MAX_WIDTH / 2}
          y={PLOT_TOP_Y + plotHeight / 2}
        >
          {emptyStateLabel}
        </text>
      )}

      {xAxisLabel ? (
        <text
          fill="#111111"
          fontFamily={FONT_FAMILY}
          fontSize="12"
          textAnchor="middle"
          x={AXIS_ORIGIN_X + (X_AXIS_END_X - AXIS_ORIGIN_X) / 2}
          y={193}
        >
          {xAxisLabel}
        </text>
      ) : null}

      {yAxisLabel ? (
        <text
          fill="#111111"
          fontFamily={FONT_FAMILY}
          fontSize="12"
          textAnchor="middle"
          transform="rotate(-90 17 90)"
          x={17}
          y={90}
        >
          {yAxisLabel}
        </text>
      ) : null}
    </svg>
  );
}

export default BarHorizontal;
