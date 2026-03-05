import type { Category } from '@/hooks/use-category';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { ColorInput } from './color-input';
import { IconInput } from './icon-input';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { Field, FieldDescription, FieldError, FieldGroup } from './ui/field';
import { Input } from './ui/input';

interface Props {
  open: boolean;
  category?: Category;
  nested?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (category: Omit<Category, 'id'> & Partial<Pick<Category, 'id'>>) => void;
}

export function CategoryDialog({ open, category, nested, onOpenChange, onSubmit }: Props) {
  const { $t } = useIntl();

  const { categories } = useCategory();

  const [name, setName] = useState<string>();

  const [icon, setIcon] = useState<string>();

  const [color, setColor] = useState<string>();

  const nameDirty = useMemo(() => name !== category?.name, [category, name]);

  const iconDirty = useMemo(() => icon !== category?.icon, [category, icon]);

  const colorDirty = useMemo(() => color !== category?.color, [category, color]);

  const dirty = useMemo(
    () => nameDirty || iconDirty || colorDirty,
    [nameDirty, iconDirty, colorDirty],
  );

  const nameErrors = useMemo(() => {
    const trimmedName = name?.trim();
    const nameEmpty = !trimmedName;
    const nameRepeated
      = !nameEmpty
        && categories.some(
          currentCategory =>
            currentCategory.id !== category?.id
            && currentCategory.name.toLowerCase() === trimmedName.toLowerCase(),
        );
    return [
      nameEmpty ? { message: $t({ id: 'category.dialog.fields.name.errors.empty' }) } : undefined,
      nameRepeated
        ? { message: $t({ id: 'category.dialog.fields.name.errors.repeated' }) }
        : undefined,
    ].filter(Boolean);
  }, [categories, name]);

  const iconErrors = useMemo(() => {
    const iconEmpty = !icon;
    return [
      iconEmpty ? { message: $t({ id: 'category.dialog.fields.icon.errors.empty' }) } : undefined,
    ].filter(Boolean);
  }, [icon]);

  const colorErrors = useMemo(() => {
    const colorEmpty = !color;
    return [
      colorEmpty ? { message: $t({ id: 'category.dialog.fields.color.errors.empty' }) } : undefined,
    ].filter(Boolean);
  }, [color]);

  const nameInvalid = useMemo(() => nameDirty && !!nameErrors.length, [nameDirty, nameErrors]);

  const iconInvalid = useMemo(() => iconDirty && !!iconErrors.length, [iconDirty, iconErrors]);

  const colorInvalid = useMemo(() => colorDirty && !!colorErrors.length, [colorDirty, colorErrors]);

  const valid = useMemo(
    () => !nameErrors.length && !iconErrors.length && !colorErrors.length,
    [nameErrors, iconErrors, colorErrors],
  );

  useEffect(() => {
    if (open) {
      setName(category?.name);
      setIcon(category?.icon);
      setColor(category?.color);
    }
  }, [open, category]);

  function handleSubmit() {
    if (valid) {
      onSubmit({
        id: category?.id,
        name: name!.trim(),
        icon: icon!,
        color: color!,
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn('max-h-screen!', nested ? 'h-[90dvh]' : 'h-[95dvh]')}>
        <DrawerHeader>
          <DrawerTitle>
            {category?.id
              ? $t({ id: 'category.dialog.title.update' })
              : $t({ id: 'category.dialog.title.create' })}
          </DrawerTitle>
          <DrawerDescription>
            {category?.id
              ? $t({ id: 'category.dialog.description.update' })
              : $t({ id: 'category.dialog.description.create' })}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col flex-1 overflow-auto">
          <FieldGroup className="p-4">
            <Field data-invalid={nameInvalid}>
              <Input
                value={name ?? ''}
                placeholder={$t({ id: 'category.dialog.fields.name.placeholder' })}
                required
                aria-invalid={nameInvalid}
                onChange={event => setName(event.target.value)}
              />
              <FieldError errors={nameDirty ? nameErrors : []} />
              <FieldDescription>
                {$t({ id: 'category.dialog.fields.name.description' })}
              </FieldDescription>
            </Field>
            <Field data-invalid={iconInvalid}>
              <IconInput
                value={icon}
                placeholder={$t({ id: 'category.dialog.fields.icon.placeholder' })}
                required
                ariaInvalid={iconInvalid}
                onChange={setIcon}
              />
              <FieldError errors={iconDirty ? iconErrors : []} />
            </Field>
            <Field data-invalid={colorInvalid}>
              <ColorInput
                value={color}
                placeholder={$t({ id: 'category.dialog.fields.color.placeholder' })}
                required
                ariaInvalid={colorInvalid}
                onChange={setColor}
              />
              <FieldError errors={colorDirty ? colorErrors : []} />
            </Field>
          </FieldGroup>
          <DrawerFooter>
            <Button disabled={!dirty || !valid} onClick={handleSubmit}>
              {category?.id
                ? $t({ id: 'category.dialog.actions.update' })
                : $t({ id: 'category.dialog.actions.create' })}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">{$t({ id: 'category.dialog.actions.cancel' })}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
