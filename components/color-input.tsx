import type { Category } from '@/hooks/use-category';
import { Fragment, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { Color } from './color';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Props {
  id?: string;
  className?: string;
  value: string | undefined;
  placeholder?: string;
  required?: boolean;
  ariaInvalid?: boolean;
  onChange?: (value: string | undefined) => void;
}

interface Option {
  value: string;
  label: string;
  categories: Array<Category>;
}

interface OptionGroup {
  label?: string;
  items: Array<Option>;
}

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
];

export function ColorInput({
  id,
  className,
  value,
  placeholder,
  required,
  ariaInvalid,
  onChange,
}: Props) {
  const { $t } = useIntl();

  const { categories } = useCategory();

  const options = useMemo(
    () =>
      colors.map<Option>(color => ({
        value: color,
        label: color,
        categories: categories.filter(category => category.color === color),
      })),
    [categories],
  );

  const groupedOptions = useMemo(
    () =>
      options.reduce<Array<OptionGroup>>(
        (result, option) => {
          if (!option.categories.length) {
            result[0].items.push(option);
          }
          else {
            result[1].items.push(option);
          }
          return result;
        },
        [
          {
            items: [],
          },
          {
            label: $t({ id: 'category.dialog.fields.color.options.used' }),
            items: [],
          },
        ],
      ),
    [options],
  );

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
              <Color name={value} />
              <span className="capitalize">{label ?? value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {groupedOptions.map((group, index) => (
          <Fragment key={index}>
            <SelectGroup>
              {group.label && <SelectLabel>{group.label}</SelectLabel>}
              {group.items.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <Color name={option.value} />
                  <div className="flex flex-col">
                    <span className="capitalize">{option.label}</span>
                    {!!option.categories.length && (
                      <span className="text-muted-foreground text-xs">
                        {option.categories.map(category => category.name).join(', ')}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            {index < groupedOptions.length - 1 && <SelectSeparator />}
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
