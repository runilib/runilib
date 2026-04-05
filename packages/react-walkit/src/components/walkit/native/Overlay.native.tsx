import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';

import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import type { OverlayProps, SpotlightRect } from '../../../types/Walkit.types';
import { easeOut, lerp } from '../../../utils/helpers';
import { getSpotlightRect } from '../../../utils/positioning.shared';
import { computeWalkitStepPosition } from '../../../utils/Walkit.positioning';
import { NativeWalkitContent } from './Walkit.native';

export const NativeOverlay = ({
  visible,
  currentRect,
  currentWalkitStep,
  walkitStepIndex,
  totalWalkitSteps,
  animationType,
  overlayColor,
  spotlightPadding,
  spotlightBorderRadius,
  theme,
  walkitStyle,
  renderPopover,
  stopOnOutsideClick,
  labels,
  onNext,
  onPrev,
  onStop,
}: OverlayProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [spot, setSpot] = useState<SpotlightRect | null>(null);
  const [measuredWalkitStep, setMeasuredWalkitStep] = useState<{
    stepId: string;
    width: number;
    height: number;
  } | null>(null);
  const sizeCacheRef = useRef<Record<string, { width: number; height: number }>>({});
  const prevRef = useRef<SpotlightRect | null>(null);
  const rafRef = useRef<number>(0);

  const effectiveSpotlightPadding =
    currentWalkitStep?.spotlightPaddingOverride ?? spotlightPadding;

  const effectiveSpotlightBorderRadius =
    currentWalkitStep?.spotlightBorderRadiusOverride ?? spotlightBorderRadius;
  const currentStepId = currentWalkitStep?.id ?? null;
  const cachedWalkitStepSize = currentStepId ? sizeCacheRef.current[currentStepId] : null;
  const activeWalkitStepSize =
    measuredWalkitStep?.stepId === currentStepId
      ? {
          width: measuredWalkitStep.width,
          height: measuredWalkitStep.height,
        }
      : cachedWalkitStepSize;
  const hasMeasuredWalkitStep = activeWalkitStepSize != null;
  const positioningSize = activeWalkitStepSize ?? { width: 290, height: 180 };

  const spotlightTarget = useMemo(() => {
    if (!currentRect) {
      return null;
    }

    return getSpotlightRect(
      currentRect,
      effectiveSpotlightPadding,
      effectiveSpotlightBorderRadius,
    );
  }, [currentRect, effectiveSpotlightPadding, effectiveSpotlightBorderRadius]);

  const walkitStepPosition = useMemo(() => {
    if (!visible || !spot || !currentWalkitStep) {
      return null;
    }

    return computeWalkitStepPosition({
      target: spot,
      walkitStepSize: positioningSize,
      preferredPlacement: currentWalkitStep.placement ?? 'auto',
      screenWidth: screenWidth,
      screenHeight: screenHeight,
    });
  }, [visible, spot, currentWalkitStep, positioningSize, screenWidth, screenHeight]);

  const onMesure = useCallback(
    (layout: { width: number; height: number }) => {
      const nextWidth = Math.ceil(layout?.width);
      const nextHeight = Math.ceil(layout.height);

      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      const activeStepId = currentWalkitStep?.id;

      if (activeStepId) {
        sizeCacheRef.current[activeStepId] = {
          width: nextWidth,
          height: nextHeight,
        };
        setMeasuredWalkitStep((previousSize) => {
          if (
            previousSize &&
            previousSize.stepId === activeStepId &&
            previousSize.width === nextWidth &&
            previousSize.height === nextHeight
          ) {
            return previousSize;
          }

          return {
            stepId: activeStepId,
            width: nextWidth,
            height: nextHeight,
          };
        });
      }
    },
    [currentWalkitStep?.id],
  );

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: visible ? 1 : 0,
      duration: Platform.OS === 'android' ? 100 : 280,
      useNativeDriver: true,
    }).start();
  }, [visible, overlayOpacity]);

  useLayoutEffect(() => {
    if (!visible || !spotlightTarget) {
      setSpot(null);
      prevRef.current = null;
      return;
    }

    cancelAnimationFrame(rafRef.current);

    if (Platform.OS === 'android' || !prevRef.current) {
      setSpot(spotlightTarget);
      prevRef.current = spotlightTarget;
      return;
    }

    const from = prevRef.current ?? spotlightTarget;
    const startTime = Date.now();
    const duration = 280;
    const tick = (): void => {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      const eased = easeOut(t);

      setSpot({
        x: lerp(from.x, spotlightTarget.x, eased),
        y: lerp(from.y, spotlightTarget.y, eased),
        width: lerp(from.width, spotlightTarget.width, eased),
        height: lerp(from.height, spotlightTarget.height, eased),
        borderRadius: spotlightTarget.borderRadius,
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    prevRef.current = spotlightTarget;

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, spotlightTarget]);

  if (!visible) {
    return null;
  }

  const fill = overlayColor ?? 'rgba(15,15,25,0.75)';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, styles.overlayRoot, { opacity: overlayOpacity }]}
    >
      <TouchableWithoutFeedback onPress={stopOnOutsideClick ? onStop : undefined}>
        <Svg
          width={screenWidth}
          height={screenHeight}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <Mask id="uc-native-mask">
              <Rect
                x={0}
                y={0}
                width={screenWidth}
                height={screenHeight}
                fill="white"
              />
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

          <Rect
            x={0}
            y={0}
            width={screenWidth}
            height={screenHeight}
            fill={fill}
            mask="url(#uc-native-mask)"
          />

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

      {walkitStepPosition && currentWalkitStep && (
        <NativeWalkitContent
          key={`${currentStepId ?? 'unknown'}:${hasMeasuredWalkitStep ? 'ready' : 'measure'}`}
          walkitStep={currentWalkitStep}
          walkitStepIndex={walkitStepIndex}
          totalWalkitSteps={totalWalkitSteps}
          walkitStepPosition={walkitStepPosition}
          animationType={animationType}
          theme={theme}
          walkitStyle={walkitStyle}
          renderPopover={renderPopover}
          labels={labels}
          onNext={onNext}
          onPrev={onPrev}
          onStop={onStop}
          onMeasure={onMesure}
          hidden={!hasMeasuredWalkitStep}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlayRoot: {
    zIndex: 9999,
    elevation: 9999,
  },
});
