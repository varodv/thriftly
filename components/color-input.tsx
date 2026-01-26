import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Color } from './color';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Props {
  id?: string;
  className?: string;
  value: string | undefined;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string | undefined) => void;
}

const colors = {
  red: {},
  orange: {},
  amber: {},
  yellow: {},
  lime: {},
  green: {},
  emerald: {},
  teal: {},
  cyan: {},
  sky: {},
  blue: {},
  indigo: {},
  violet: {},
  purple: {},
  fuchsia: {},
  pink: {},
  rose: {},
  slate: {},
  gray: {},
  zinc: {},
  neutral: {},
  stone: {},
};

export function ColorInput({ id, className, value, placeholder, required, onChange }: Props) {
  const options = Object.entries(colors).map(([colorName, colorProps]) => ({
    value: colorName,
    label: colorName,
    ...colorProps,
  }));

  const label = useMemo(() => {
    if (value) {
      return options.find(option => option.value === value)?.label;
    }
  }, [value, options]);

  return (
    <Select value={value} required={required} onValueChange={onChange}>
      <SelectTrigger id={id} className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center gap-2">
              <Color name={value} />
              <span>{label ?? value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            <Color name={option.value} />
            <span>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
