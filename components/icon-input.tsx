import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Props {
  id?: string;
  className?: string;
  value: string | undefined;
  placeholder?: string;
  required?: boolean;
  ariaInvalid?: boolean;
  onChange?: (value: string | undefined) => void;
}

const icons = {
  'badge-cent': { category: 'finance' },
  'badge-dollar-sign': { category: 'finance' },
  'badge-euro': { category: 'finance' },
  'badge-indian-rupee': { category: 'finance' },
  'badge-japanese-yen': { category: 'finance' },
  'badge-percent': { category: 'finance' },
  'badge-pound-sterling': { category: 'finance' },
  'badge-russian-ruble': { category: 'finance' },
  'badge-swiss-franc': { category: 'finance' },
  'badge-turkish-lira': { category: 'finance' },
  'banknote': { category: 'finance' },
  'banknote-arrow-down': { category: 'finance' },
  'banknote-arrow-up': { category: 'finance' },
  'banknote-x': { category: 'finance' },
  'bitcoin': { category: 'finance' },
  'chart-candlestick': { category: 'finance' },
  'circle-dollar-sign': { category: 'finance' },
  'circle-percent': { category: 'finance' },
  'circle-pound-sterling': { category: 'finance' },
  'credit-card': { category: 'finance' },
  'currency': { category: 'finance' },
  'diamond-percent': { category: 'finance' },
  'dollar-sign': { category: 'finance' },
  'euro': { category: 'finance' },
  'gem': { category: 'finance' },
  'georgian-lari': { category: 'finance' },
  'hand-coins': { category: 'finance' },
  'handshake': { category: 'finance' },
  'indian-rupee': { category: 'finance' },
  'japanese-yen': { category: 'finance' },
  'landmark': { category: 'finance' },
  'nfc': { category: 'finance' },
  'percent': { category: 'finance' },
  'philippine-peso': { category: 'finance' },
  'piggy-bank': { category: 'finance' },
  'pound-sterling': { category: 'finance' },
  'receipt': { category: 'finance' },
  'receipt-cent': { category: 'finance' },
  'receipt-euro': { category: 'finance' },
  'receipt-indian-rupee': { category: 'finance' },
  'receipt-japanese-yen': { category: 'finance' },
  'receipt-pound-sterling': { category: 'finance' },
  'receipt-russian-ruble': { category: 'finance' },
  'receipt-swiss-franc': { category: 'finance' },
  'receipt-text': { category: 'finance' },
  'receipt-turkish-lira': { category: 'finance' },
  'russian-ruble': { category: 'finance' },
  'saudi-riyal': { category: 'finance' },
  'scale': { category: 'finance' },
  'smartphone-nfc': { category: 'finance' },
  'square-percent': { category: 'finance' },
  'swiss-franc': { category: 'finance' },
  'turkish-lira': { category: 'finance' },
  'wallet': { category: 'finance' },
  'wallet-cards': { category: 'finance' },
  'wallet-minimal': { category: 'finance' },
};

export function IconInput({
  id,
  className,
  value,
  placeholder,
  required,
  ariaInvalid,
  onChange,
}: Props) {
  const options = Object.entries(icons).map(([iconName, iconProps]) => ({
    value: iconName,
    label: iconName,
    ...iconProps,
  }));

  const label = useMemo(() => {
    if (value) {
      return options.find(option => option.value === value)?.label;
    }
  }, [value, options]);

  return (
    <Select value={value} required={required} onValueChange={onChange}>
      <SelectTrigger id={id} className={cn('w-full', className)} aria-invalid={ariaInvalid}>
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center gap-2">
              <Icon name={value} />
              <span>{label ?? value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            <Icon name={option.value} />
            <span>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
