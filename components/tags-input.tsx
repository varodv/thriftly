import { TagsIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { useTransaction } from '@/hooks/use-transaction';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from './ui/combobox';

interface Props {
  id?: string;
  className?: string;
  value: Array<string>;
  category?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: Array<string>) => void;
}

interface OptionGroup {
  label?: string;
  items: Array<string>;
}

export function TagsInput({
  id,
  className,
  value,
  category,
  placeholder,
  required,
  onChange,
}: Props) {
  const { $t } = useIntl();
  const anchor = useComboboxAnchor();

  const { transactions } = useTransaction();

  const { categories } = useCategory();

  const [inputValue, setInputValue] = useState('');

  const existingTags = useMemo(() => {
    const tags = new Set(value);
    transactions.forEach(transaction => transaction.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [value, transactions]);

  const options = useMemo(() => {
    const result = [...existingTags].sort();
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue && !existingTags.includes(trimmedInputValue)) {
      result.unshift(trimmedInputValue);
    }
    return result;
  }, [inputValue, existingTags]);

  const groupedOptions = useMemo(
    () =>
      options.reduce<Array<OptionGroup>>(
        (result, option) => {
          if (
            category
            && transactions.some(
              transaction =>
                transaction.category === category && transaction.tags.includes(option),
            )
          ) {
            result[0].items.push(option);
            if (!result[1].label) {
              result[1].label = $t({ id: 'tags.input.options.other' });
            }
          }
          else {
            result[1].items.push(option);
          }
          return result;
        },
        [
          {
            label: category
              ? (categories.find(currentCategory => currentCategory.id === category)?.name
                ?? category)
              : undefined,
            items: [],
          },
          {
            items: [],
          },
        ],
      ),
    [category, transactions, categories, options],
  );

  function isOptionNew(option: string) {
    const trimmedInputValue = inputValue.trim();
    return option === trimmedInputValue && !existingTags.includes(trimmedInputValue);
  }

  return (
    <Combobox
      value={value}
      multiple
      items={groupedOptions}
      inputValue={inputValue}
      autoHighlight
      onValueChange={onChange}
      onInputValueChange={setInputValue}
    >
      <ComboboxChips ref={anchor} className={className}>
        <TagsIcon className="size-5" />
        <ComboboxValue>
          {value.map(tag => (
            <ComboboxChip key={tag}>{tag}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput
          id={id}
          placeholder={!value.length ? placeholder : undefined}
          required={required}
        />
      </ComboboxChips>
      {!!options.length && (
        <ComboboxContent anchor={anchor} container={anchor}>
          <ComboboxList>
            {(group: OptionGroup, index) => (
              <ComboboxGroup key={index} items={group.items}>
                {group.label && <ComboboxLabel>{group.label}</ComboboxLabel>}
                <ComboboxCollection>
                  {(option: string) => (
                    <ComboboxItem key={option} className="gap-1" value={option}>
                      {option}
                      {isOptionNew(option) && (
                        <span className="text-muted-foreground">
                          {$t({ id: 'tags.input.options.new' })}
                        </span>
                      )}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                {index < groupedOptions.length - 1 && <ComboboxSeparator />}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
}
