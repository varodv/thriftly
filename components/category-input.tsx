import type { Category } from '@/hooks/use-category';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { CategoryDialog } from './category-dialog';
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

export function CategoryInput({
  id,
  className,
  value,
  placeholder,
  required,
  ariaInvalid,
  onChange,
}: Props) {
  const { $t } = useIntl();

  const { categories, createCategory } = useCategory();

  const [dialogOpen, setDialogOpen] = useState(false);

  const valueCategory = useMemo(() => {
    if (value) {
      return categories.find(category => category.id === value);
    }
  }, [value, categories]);

  const CREATE_OPTION_VALUE = 'create';

  function handleChange(newValue: string) {
    if (newValue === CREATE_OPTION_VALUE) {
      setDialogOpen(true);
      onChange?.('');
    }
    else {
      onChange?.(newValue);
    }
  }

  function handleDialogSubmit(category: Omit<Category, 'id'>) {
    const { id: newCategoryId } = createCategory(category);
    onChange?.(newCategoryId);
    setDialogOpen(false);
    toast.success($t({ id: 'category.toast.create.success' }));
  }

  return (
    <>
      <Select value={value ?? ''} required={required} onValueChange={handleChange}>
        <SelectTrigger id={id} className={cn('w-full', className)} aria-invalid={ariaInvalid}>
          <SelectValue placeholder={placeholder}>
            {value && (
              <div className="flex items-center gap-2">
                {valueCategory && (
                  <Icon className={`text-${valueCategory.color}-500`} name={valueCategory.icon} />
                )}
                <span>{valueCategory?.name ?? value}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {categories
            .sort((categoryA, categoryB) => categoryA.name.localeCompare(categoryB.name))
            .map(category => (
              <SelectItem key={category.id} value={category.id}>
                <Icon className={`text-${category.color}-500`} name={category.icon} />
                <span>{category.name}</span>
              </SelectItem>
            ))}
          <SelectItem value={CREATE_OPTION_VALUE}>
            <Icon name="plus" />
            <span>{$t({ id: 'category.input.actions.create' })}</span>
          </SelectItem>
        </SelectContent>
      </Select>
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
}
