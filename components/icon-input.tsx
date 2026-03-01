import type { Category } from '@/hooks/use-category';
import { icons } from 'lucide-react';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { Icon } from './icon';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  useComboboxAnchor,
} from './ui/combobox';
import { InputGroupAddon } from './ui/input-group';

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

export function IconInput({
  id,
  className,
  value,
  placeholder,
  required,
  ariaInvalid,
  onChange,
}: Props) {
  const { $t } = useIntl();
  const anchor = useComboboxAnchor();

  const { categories } = useCategory();

  const options = useMemo(
    () =>
      Object.keys(icons).map<Option>(icon => ({
        value: icon,
        label: icon,
        categories: categories.filter(category => category.icon === icon),
      })),
    [categories],
  );

  const groupedOptions = useMemo(
    () =>
      options
        .reduce<Array<OptionGroup>>(
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
              label: $t({ id: 'category.dialog.fields.icon.options.used' }),
              items: [],
            },
          ],
        )
        .filter(group => group.items.length),
    [options],
  );

  return (
    <Combobox
      value={value ?? ''}
      items={groupedOptions}
      autoHighlight
      onValueChange={newValue => onChange?.(newValue || undefined)}
    >
      <div ref={anchor} className={className}>
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          required={required}
          aria-invalid={ariaInvalid}
        >
          {value && (
            <InputGroupAddon>
              <Icon name={value} />
            </InputGroupAddon>
          )}
        </ComboboxInput>
      </div>
      <ComboboxContent anchor={anchor} container={anchor}>
        <ComboboxEmpty>{$t({ id: 'icon.input.options.empty' })}</ComboboxEmpty>
        <ComboboxList>
          {(group: OptionGroup, index) => (
            <ComboboxGroup key={index} items={group.items}>
              {group.label && <ComboboxLabel>{group.label}</ComboboxLabel>}
              <ComboboxCollection>
                {(option: Option) => (
                  <ComboboxItem key={option.value} className="gap-2" value={option.value}>
                    <Icon name={option.value} />
                    <div className="flex flex-col">
                      {option.label}
                      {!!option.categories.length && (
                        <span className="text-muted-foreground text-xs">
                          {option.categories.map(category => category.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              {index < groupedOptions.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
