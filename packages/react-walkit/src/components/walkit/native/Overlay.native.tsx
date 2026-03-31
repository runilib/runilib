import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import type { OverlayProps, SpotlightRect } from '../../../types/Walkit.types';
import { easeOut, lerp } from '../../../utils/helpers';
import { getSpotlightRect } from '../../../utils/positioning.shared';
import { computeWalkitStepPosition } from '../../../utils/Walkit.positioning';
import { NativeWalkitContent } from './Walkit.native';

const { width: SW, height: SH } = Dimensions.get('window');

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
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [spot, setSpot] = useState<SpotlightRect | null>(null);
  const [walkitStepSize, setWalkitStepSize] = useState({ width: 290, height: 180 });
  const prevRef = useRef<SpotlightRect | null>(null);
  const rafRef = useRef<number>(0);

  const effectiveSpotlightPadding =
    currentWalkitStep?.spotlightPaddingOverride ?? spotlightPadding;

  const effectiveSpotlightBorderRadius =
    currentWalkitStep?.spotlightBorderRadiusOverride ?? spotlightBorderRadius;

  const walkitStepPosition = useMemo(() => {
    if (!currentRect || !currentWalkitStep) {
      return null;
    }

    return computeWalkitStepPosition({
      target: getSpotlightRect(
        currentRect,
        effectiveSpotlightPadding,
        effectiveSpotlightBorderRadius,
      ),
      walkitStepSize,
      preferredPlacement: currentWalkitStep.placement ?? 'auto',
      screenWidth: SW,
      screenHeight: SH,
    });
  }, [
    currentRect,
    currentWalkitStep,
    walkitStepSize,
    effectiveSpotlightPadding,
    effectiveSpotlightBorderRadius,
  ]);

  const onMesure = useCallback((layout: { width: number; height: number }) => {
    const nextWidth = Math.ceil(layout?.width);
    const nextHeight = Math.ceil(layout.height);

    setWalkitStepSize((previousSize) => {
      if (previousSize.width === nextWidth && previousSize.height === nextHeight) {
        return previousSize;
      }

      return {
        width: nextWidth,
        height: nextHeight,
      };
    });
  }, []);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: visible ? 1 : 0,
      duration: Platform.OS === 'android' ? 100 : 280,
      useNativeDriver: true,
    }).start();
  }, [visible, overlayOpacity]);

  useEffect(() => {
    if (!visible || !currentRect) {
      return;
    }

    const target = getSpotlightRect(currentRect, spotlightPadding, spotlightBorderRadius);

    cancelAnimationFrame(rafRef.current);

    if (Platform.OS === 'android') {
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

  const fill = overlayColor ?? 'rgba(15,15,25,0.75)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onStop}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
      />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        <TouchableWithoutFeedback onPress={stopOnOutsideClick ? onStop : undefined}>
          <Svg
            width={SW}
            height={SH}
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              <Mask id="uc-native-mask">
                <Rect
                  x={0}
                  y={0}
                  width={SW}
                  height={SH}
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
              width={SW}
              height={SH}
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
          />
        )}
      </Animated.View>
    </Modal>
  );
};
