import { useIntl } from 'react-intl';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Props {
  id?: string;
  className?: string;
  value: Date | undefined;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: Date | undefined) => void;
}

export function DateInput({ id, className, value, placeholder, required, onChange }: Props) {
  const { formatDate } = useIntl();

  return (
    <Popover>
      <PopoverTrigger>
        <Input
          id={id}
          className={cn('focus-visible:border-input focus-visible:ring-0', className)}
          placeholder={placeholder}
          required={required}
          value={value ? formatDate(value, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} defaultMonth={value} />
      </PopoverContent>
    </Popover>
  );
}
