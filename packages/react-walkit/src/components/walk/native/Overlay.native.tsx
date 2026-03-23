import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";
import { getSpotlightRect } from "src/utils/positioning.shared";
import { computeTooltipPosition } from "src/utils/Walk.positioning";
import type { OverlayProps, SpotlightRect } from "../../../types/Walk.types";
import { NativeTooltip } from "./Walk.native";

const { width: SW, height: SH } = Dimensions.get("window");

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

export const NativeOverlay = ({
  visible,
  currentRect,
  currentWalkStep,
  walkStepIndex,
  totalWalkSteps,
  animationType,
  overlayColor,
  spotlightPadding,
  spotlightBorderRadius,
  theme,
  walkStyle,
  renderPopover,
  stopOnOutsideClick,
  labels,
  onNext,
  onPrev,
  onStop,
}: OverlayProps) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [spot, setSpot] = useState<SpotlightRect | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 290, height: 180 });
  const prevRef = useRef<SpotlightRect | null>(null);
  const rafRef = useRef<number>(0);

  const walkStepPos = useMemo(() => {
    if (!currentRect || !currentWalkStep) {
      return null;
    }

    return computeTooltipPosition(
      getSpotlightRect(currentRect, spotlightPadding, spotlightBorderRadius),
      tooltipSize,
      currentWalkStep.placement ?? "auto",
      SW,
      SH
    );
  }, [currentRect, currentWalkStep, spotlightPadding, spotlightBorderRadius, tooltipSize]);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: visible ? 1 : 0,
      duration: Platform.OS === "android" ? 100 : 280,
      useNativeDriver: true,
    }).start();
  }, [visible, overlayOpacity]);

  useEffect(() => {
    if (!visible || !currentRect) {
      return;
    }

    const target = getSpotlightRect(currentRect, spotlightPadding, spotlightBorderRadius);

    cancelAnimationFrame(rafRef.current);

    if (Platform.OS === "android") {
      setSpot(target);
      prevRef.current = target;
      return;
    }

    const from = prevRef.current ?? target;
    const startTime = Date.now();
    const duration = 280;
    const tick = (): void => {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      const eased = easeOut(t);

      setSpot({
        x: lerp(from.x, target.x, eased),
        y: lerp(from.y, target.y, eased),
        width: lerp(from.width, target.width, eased),
        height: lerp(from.height, target.height, eased),
        borderRadius: target.borderRadius,
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    prevRef.current = target;

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, currentRect, spotlightPadding, spotlightBorderRadius]);

  if (!visible) {
    return null;
  }

  const fill = overlayColor ?? "rgba(15,15,25,0.75)";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onStop}
    >
      <StatusBar translucent backgroundColor="transparent" />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        <TouchableWithoutFeedback onPress={stopOnOutsideClick ? onStop : undefined}>
          <Svg width={SW} height={SH} style={StyleSheet.absoluteFill}>
            <Defs>
              <Mask id="uc-native-mask">
                <Rect x={0} y={0} width={SW} height={SH} fill="white" />
                {spot && (
                  <Rect
                    x={spot.x}
                    y={spot.y}
                    width={spot.width}
                    height={spot.height}
                    rx={spot.borderRadius}
                    fill="black"
                  />
                )}
              </Mask>
            </Defs>

            <Rect x={0} y={0} width={SW} height={SH} fill={fill} mask="url(#uc-native-mask)" />

            {spot && (
              <Rect
                x={spot.x - 1}
                y={spot.y - 1}
                width={spot.width + 2}
                height={spot.height + 2}
                rx={(spot.borderRadius ?? 8) + 1}
                fill="none"
                stroke="rgba(99,102,241,0.7)"
                strokeWidth={2}
              />
            )}
          </Svg>
        </TouchableWithoutFeedback>

        {walkStepPos && currentWalkStep && (
          <NativeTooltip
            walkStep={currentWalkStep}
            walkStepIndex={walkStepIndex}
            totalWalkSteps={totalWalkSteps}
            walkStepPos={walkStepPos}
            animationType={animationType}
            theme={theme}
            walkStyle={walkStyle}
            renderPopover={renderPopover}
            labels={labels}
            onNext={onNext}
            onPrev={onPrev}
            onStop={onStop}
            onMeasure={(layout) => {
              const nextWidth = Math.ceil(layout.width);
              const nextHeight = Math.ceil(layout.height);

              setTooltipSize((previousSize) => {
                if (previousSize.width === nextWidth && previousSize.height === nextHeight) {
                  return previousSize;
                }

                return {
                  width: nextWidth,
                  height: nextHeight,
                };
              });
            }}
          />
        )}
      </Animated.View>
    </Modal>
  );
};
