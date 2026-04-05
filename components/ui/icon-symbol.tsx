import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'lightbulb.fill': 'lightbulb',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.crop.circle.fill': 'account-circle',
  'puzzlepiece.fill': 'extension',
  'grid.fill': 'grid-on',
  'dice.fill': 'casino',
  'checkerboard.rectangle': 'view-module',
} as const;

type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color as any} size={size} name={MAPPING[name]} style={style} />;
}
