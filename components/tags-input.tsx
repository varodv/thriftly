import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useTransaction } from '@/hooks/use-transaction';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from './ui/combobox';

interface Props {
  id?: string;
  className?: string;
  value: Array<string>;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: Array<string>) => void;
}

export function TagsInput({ id, className, value, placeholder, required, onChange }: Props) {
  const { $t } = useIntl();
  const anchor = useComboboxAnchor();

  const { transactions } = useTransaction();

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

  function isOptionNew(option: string) {
    const trimmedInputValue = inputValue.trim();
    return option === trimmedInputValue && !existingTags.includes(trimmedInputValue);
  }

  return (
    <Combobox
      value={value}
      multiple
      items={options}
      inputValue={inputValue}
      autoHighlight
      onValueChange={onChange}
      onInputValueChange={setInputValue}
    >
      <ComboboxChips ref={anchor} className={className}>
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
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
}
