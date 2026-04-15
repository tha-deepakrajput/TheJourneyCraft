import { useTheme } from '@/lib/theme-context';

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
