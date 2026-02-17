import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Props {
  id?: string;
  className?: string;
  value: Date | undefined;
  placeholder?: string;
  required?: boolean;
  ariaInvalid?: boolean;
  onChange?: (value: Date | undefined) => void;
}

export function DateInput({
  id,
  className,
  value,
  placeholder,
  required,
  ariaInvalid,
  onChange,
}: Props) {
  const { formatDate } = useDate();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <InputGroup>
          <InputGroupInput
            id={id}
            className={cn('focus-visible:border-input focus-visible:ring-0', className)}
            value={value ? formatDate(value) : ''}
            placeholder={placeholder}
            required={required}
            aria-invalid={ariaInvalid}
            readOnly
          />
          <InputGroupAddon>
            <CalendarIcon className="size-5" />
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          selected={value}
          mode="single"
          defaultMonth={value}
          required={required}
          weekStartsOn={1}
          onSelect={(newValue: Date | undefined) => {
            onChange?.(newValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
