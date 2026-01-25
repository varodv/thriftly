import type { LucideProps } from 'lucide-react';
import { icons } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props extends LucideProps {
  name: string;
}

export function Icon({ className, name, ...props }: Props) {
  const iconName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const Icon = (icons as Record<string, React.ComponentType<LucideProps>>)[iconName];
  return Icon && <Icon className={cn('size-5', className)} {...props} />;
}
