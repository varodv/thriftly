import { icons } from 'lucide-react';
import { useIntl } from 'react-intl';
import { Icon } from './icon';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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

  const options = Object.keys(icons);

  return (
    <Combobox
      value={value ?? ''}
      items={options}
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
          {(option: string) => (
            <ComboboxItem key={option} className="gap-2" value={option}>
              <Icon name={option} />
              {option}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
