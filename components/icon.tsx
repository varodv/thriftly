import type { LucideProps } from 'lucide-react';
import { icons } from 'lucide-react';

interface Props extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: Props) {
  const iconName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const Icon = (icons as Record<string, React.ComponentType<LucideProps>>)[iconName];
  return Icon !== undefined ? <Icon {...props} /> : null;
}
