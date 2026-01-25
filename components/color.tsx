import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  name: string;
}

export function Color({ className, name }: Props) {
  return <span className={cn('size-5 rounded-full', `bg-${name}-500`, className)} />;
}
