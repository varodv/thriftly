import type { Category } from '@/hooks/use-category';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
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
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';

interface Props {
  open: boolean;
  category?: Category;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (category: Omit<Category, 'id'> & Partial<Pick<Category, 'id'>>) => void;
}

export function CategoryDialog({ open, category, onOpenChange, onSubmit }: Props) {
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
    const nameEmpty = !name?.trim().length;
    const nameRepeated
      = !nameEmpty
        && categories.some(
          currentCategory => currentCategory.name.toLowerCase() === name.trim().toLowerCase(),
        );
    return [
      nameEmpty ? { message: $t({ id: 'category.dialog.fields.name.errors.empty' }) } : undefined,
      nameRepeated
        ? { message: $t({ id: 'category.dialog.fields.name.errors.repeated' }) }
        : undefined,
    ].filter(Boolean);
  }, [categories, name]);

  const iconErrors = useMemo(() => {
    const iconEmpty = !icon?.trim().length;
    return [
      iconEmpty ? { message: $t({ id: 'category.dialog.fields.icon.errors.empty' }) } : undefined,
    ].filter(Boolean);
  }, [icon]);

  const colorErrors = useMemo(() => {
    const colorEmpty = !color?.trim().length;
    return [
      colorEmpty ? { message: $t({ id: 'category.dialog.fields.color.errors.empty' }) } : undefined,
    ].filter(Boolean);
  }, [color]);

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
        icon: icon!.trim(),
        color: color!.trim(),
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
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
        <FieldGroup className="p-4">
          <Field data-invalid={nameDirty && !!nameErrors.length}>
            <FieldLabel htmlFor="category-name">
              {$t({ id: 'category.dialog.fields.name.label' })}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="category-name"
              value={name ?? ''}
              placeholder={$t({ id: 'category.dialog.fields.name.placeholder' })}
              required
              onChange={event => setName(event.target.value)}
            />
            <FieldError errors={nameDirty ? nameErrors : []} />
          </Field>
          <Field data-invalid={iconDirty && !!iconErrors.length}>
            <FieldLabel htmlFor="category-icon">
              {$t({ id: 'category.dialog.fields.icon.label' })}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <IconInput
              id="category-icon"
              value={icon}
              placeholder={$t({ id: 'category.dialog.fields.icon.placeholder' })}
              required
              onChange={setIcon}
            />
            <FieldError errors={iconDirty ? iconErrors : []} />
          </Field>
          <Field data-invalid={colorDirty && !!colorErrors.length}>
            <FieldLabel htmlFor="category-color">
              {$t({ id: 'category.dialog.fields.color.label' })}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <ColorInput
              id="category-color"
              value={color}
              placeholder={$t({ id: 'category.dialog.fields.color.placeholder' })}
              required
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
      </DrawerContent>
    </Drawer>
  );
}
