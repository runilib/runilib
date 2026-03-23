import { type FC, useEffect, useRef } from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NATIVE_ANIMATIONS } from '../../../animations';
import type {
  Placement,
  WalkitPopoverProps,
  WalkitTheme,
} from '../../../types/Walkit.types';

const DEFAULT_THEME: Required<WalkitTheme> = {
  primaryButtonColor: '#6366f1',
  primaryButtonTextColor: '#ffffff',
  background: '#ffffff',
  titleColor: '#1e1e2e',
  subTitleColor: '#6b7280',
  border: '#e5e7eb',
  shadow: '',
  borderRadius: '14px',
};

export const NativeTooltip = ({
  walkitStep,
  walkitStepIndex,
  totalWalkitSteps,
  walkitStepPos,
  animationType = 'slide',
  theme,
  walkitStyle,
  renderPopover,
  labels = {},
  onNext,
  onPrev,
  onStop,
  onMeasure,
}: WalkitPopoverProps) => {
  const t = { ...DEFAULT_THEME, ...theme };
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const cfg = NATIVE_ANIMATIONS[animationType] ?? NATIVE_ANIMATIONS.fade;

    if (cfg.useSpring && cfg.spring) {
      Animated.spring(progress, {
        toValue: 1,
        useNativeDriver: true,
        ...cfg.spring,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 1,
        duration: cfg.duration ?? 300,
        useNativeDriver: true,
      }).start();
    }
  }, [animationType, progress]);

  const isFirst = walkitStepIndex === 0;
  const isLast = walkitStepIndex === totalWalkitSteps - 1;
  const cfg = NATIVE_ANIMATIONS[animationType] ?? NATIVE_ANIMATIONS.fade;
  const animStyle = buildAnimatedStyle(progress, cfg);

  const containerStyle = [
    styles.container,
    {
      top: walkitStepPos.top,
      left: walkitStepPos.left,
      backgroundColor: t.background,
      borderColor: t.border,
    },
    walkitStyle,
  ];

  const handleLayout = (event: LayoutChangeEvent) => {
    onMeasure?.(event.nativeEvent.layout);
  };

  if (renderPopover) {
    return (
      <Animated.View
        onLayout={handleLayout}
        style={[containerStyle, animStyle]}
      >
        {renderPopover({
          walkitStep,
          walkitStepIndex,
          totalWalkitSteps,
          onNext,
          onPrev,
          onStop,
        })}
        <Arrow
          placement={walkitStepPos.placement}
          color={t.background}
          offset={walkitStepPos.arrowOffset}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[containerStyle, animStyle]}
    >
      <View style={styles.header}>
        {walkitStep.title ? (
          <Text
            style={[styles.title, { color: t.titleColor }]}
            numberOfLines={2}
          >
            {walkitStep.title}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={onStop}
          style={styles.closeBtn}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={[styles.closeText, { color: t.subTitleColor }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {walkitStep.content ? (
        <Text style={[styles.body, { color: t.subTitleColor }]}>
          {walkitStep.content}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.dots}>
          {Array.from({ length: totalWalkitSteps }).map((item, i) => (
            <View
              key={`${item}-${i.toString()}`}
              style={[
                styles.dot,
                {
                  width: i === walkitStepIndex ? 18 : 6,
                  backgroundColor:
                    i === walkitStepIndex ? t.primaryButtonColor : t.border,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {!isFirst && (
            <TouchableOpacity
              onPress={onPrev}
              style={[styles.btnSecondary, { borderColor: t.border }]}
            >
              <Text style={[styles.btnSecondaryText, { color: t.subTitleColor }]}>
                {labels.prev ?? '← Back'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onNext}
            style={[styles.btnPrimary, { backgroundColor: t.primaryButtonColor }]}
          >
            <Text style={[styles.btnPrimaryText, { color: t.primaryButtonTextColor }]}>
              {isLast ? (labels.finish ?? 'Finish 🎉') : (labels.next ?? 'Next →')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Arrow
        placement={walkitStepPos.placement}
        color={t.background}
        offset={walkitStepPos.arrowOffset}
      />
    </Animated.View>
  );
};

const Arrow: FC<{ placement: Placement; color: string; offset: number }> = ({
  placement,
  color,
  offset,
}) => {
  const size = 10;

  const isVertical = placement === 'top' || placement === 'bottom';
  const containerStyle = isVertical
    ? {
        position: 'absolute' as const,
        left: offset - size,
        [placement === 'bottom' ? 'top' : 'bottom']: -size,
      }
    : {
        position: 'absolute' as const,
        top: offset - size,
        [placement === 'right' ? 'left' : 'right']: -size,
      };

  const triangleStyle: Record<string, number | string | undefined> = (() => {
    switch (placement) {
      case 'bottom':
        return {
          width: 0,
          height: 0,
          borderLeftWidth: size,
          borderLeftColor: 'transparent',
          borderRightWidth: size,
          borderRightColor: 'transparent',
          borderBottomWidth: size,
          borderBottomColor: color,
        };
      case 'top':
        return {
          width: 0,
          height: 0,
          borderLeftWidth: size,
          borderLeftColor: 'transparent',
          borderRightWidth: size,
          borderRightColor: 'transparent',
          borderTopWidth: size,
          borderTopColor: color,
        };
      case 'right':
        return {
          width: 0,
          height: 0,
          borderTopWidth: size,
          borderTopColor: 'transparent',
          borderBottomWidth: size,
          borderBottomColor: 'transparent',
          borderRightWidth: size,
          borderRightColor: color,
        };
      case 'left':
        return {
          width: 0,
          height: 0,
          borderTopWidth: size,
          borderTopColor: 'transparent',
          borderBottomWidth: size,
          borderBottomColor: 'transparent',
          borderLeftWidth: size,
          borderLeftColor: color,
        };
      default:
        return {};
    }
  })();

  return (
    <View style={containerStyle}>
      <View style={triangleStyle} />
    </View>
  );
};

type AnimCfg = (typeof NATIVE_ANIMATIONS)[keyof typeof NATIVE_ANIMATIONS];

function buildAnimatedStyle(progress: Animated.Value, cfg: AnimCfg) {
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if ('scale' in cfg && cfg.scale) {
    return {
      opacity,
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [cfg.scale.from, cfg.scale.to],
          }),
        },
      ],
    };
  }

  if ('translateY' in cfg && cfg.translateY) {
    return {
      opacity,
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [cfg.translateY.from, cfg.translateY.to],
          }),
        },
      ],
    };
  }

  if ('rotateX' in cfg && cfg.rotateX) {
    return {
      opacity,
      transform: [
        { perspective: 400 },
        {
          rotateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [cfg.rotateX.from, cfg.rotateX.to],
          }),
        },
      ],
    };
  }

  return { opacity };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 290,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: { fontSize: 15, fontWeight: '700', flex: 1, lineHeight: 20 },
  closeBtn: { marginLeft: 8, marginTop: -2 },
  closeText: { fontSize: 13 },
  body: { fontSize: 13.5, lineHeight: 20, marginBottom: 16 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { height: 6, borderRadius: 3 },
  buttons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btnPrimary: { borderRadius: 8, paddingVertical: 7, paddingHorizontal: 14 },
  btnPrimaryText: { fontSize: 13, fontWeight: '600' },
  btnSecondary: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  btnSecondaryText: { fontSize: 13, fontWeight: '500' },
});
