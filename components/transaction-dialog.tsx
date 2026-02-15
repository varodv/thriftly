import type { Transaction } from '@/hooks/use-transaction';
import { EuroIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { CategoryInput } from './category-input';
import { DateInput } from './date-input';
import { TagsInput } from './tags-input';
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
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface Props {
  open: boolean;
  transaction?: Transaction;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (transaction: Omit<Transaction, 'id'> & Partial<Pick<Transaction, 'id'>>) => void;
}

enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export function TransactionDialog({ open, transaction, onOpenChange, onSubmit }: Props) {
  const { $t } = useIntl();

  const [type, setType] = useState<string>();

  const [amount, setAmount] = useState<number>();

  const [timestamp, setTimestamp] = useState<number>();

  const [category, setCategory] = useState<string>();

  const [tags, setTags] = useState<Array<string>>([]);

  const amountDirty = useMemo(() => {
    if (amount === undefined) {
      return amount !== transaction?.amount;
    }
    return (type === TransactionType.EXPENSE ? -amount : amount) !== transaction?.amount;
  }, [transaction, type, amount]);

  const timestampDirty = useMemo(
    () => timestamp !== transaction?.timestamp,
    [transaction, timestamp],
  );

  const categoryDirty = useMemo(() => category !== transaction?.category, [transaction, category]);

  const tagsDirty = useMemo(
    () =>
      tags.length !== (transaction?.tags.length ?? 0)
      || tags.some(tag => !transaction?.tags.includes(tag)),
    [transaction, tags],
  );

  const dirty = useMemo(
    () => amountDirty || timestampDirty || categoryDirty || tagsDirty,
    [amountDirty, timestampDirty, categoryDirty, tagsDirty],
  );

  const amountErrors = useMemo(() => {
    const amountZero = !amount || amount < 0;
    return [
      amountZero
        ? { message: $t({ id: 'transaction.dialog.fields.amount.errors.zero' }) }
        : undefined,
    ].filter(Boolean);
  }, [amount]);

  const timestampErrors = useMemo(() => {
    return [
      !timestamp
        ? { message: $t({ id: 'transaction.dialog.fields.timestamp.errors.empty' }) }
        : undefined,
    ].filter(Boolean);
  }, [timestamp]);

  const categoryErrors = useMemo(() => {
    return [
      !category
        ? { message: $t({ id: 'transaction.dialog.fields.category.errors.empty' }) }
        : undefined,
    ].filter(Boolean);
  }, [category]);

  const amountInvalid = useMemo(
    () => amountDirty && !!amountErrors.length,
    [amountDirty, amountErrors],
  );

  const timestampInvalid = useMemo(
    () => timestampDirty && !!timestampErrors.length,
    [timestampDirty, timestampErrors],
  );

  const categoryInvalid = useMemo(
    () => categoryDirty && !!categoryErrors.length,
    [categoryDirty, categoryErrors],
  );

  const valid = useMemo(
    () => !amountErrors.length && !timestampErrors.length && !categoryErrors.length,
    [amountErrors, timestampErrors, categoryErrors],
  );

  useEffect(() => {
    if (open) {
      setType((transaction?.amount ?? -1) < 0 ? TransactionType.EXPENSE : TransactionType.INCOME);
      setAmount(transaction?.amount ? Math.abs(transaction.amount) : undefined);
      setTimestamp(transaction?.timestamp ?? new Date().setHours(0, 0, 0, 0));
      setCategory(transaction?.category);
      setTags(transaction?.tags ?? []);
    }
  }, [open, transaction]);

  function handleSubmit() {
    if (valid) {
      onSubmit({
        id: transaction?.id,
        amount: type === TransactionType.EXPENSE ? -amount! : amount!,
        timestamp: timestamp!,
        category: category!,
        tags,
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95dvh] max-h-screen!">
        <DrawerHeader>
          <DrawerTitle>
            {transaction?.id
              ? $t({ id: 'transaction.dialog.title.update' })
              : $t({ id: 'transaction.dialog.title.create' })}
          </DrawerTitle>
          <DrawerDescription>
            {transaction?.id
              ? $t({ id: 'transaction.dialog.description.update' })
              : $t({ id: 'transaction.dialog.description.create' })}
          </DrawerDescription>
        </DrawerHeader>
        <FieldGroup className="overflow-y-auto p-4">
          <Tabs value={type} onValueChange={setType}>
            <TabsList className="w-full">
              <TabsTrigger value={TransactionType.EXPENSE}>
                {$t({ id: 'transaction.dialog.type.expense' })}
              </TabsTrigger>
              <TabsTrigger value={TransactionType.INCOME}>
                {$t({ id: 'transaction.dialog.type.income' })}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Field data-invalid={amountInvalid}>
            <FieldLabel htmlFor="transaction-amount">
              {$t({ id: 'transaction.dialog.fields.amount.label' })}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="transaction-amount"
                type="number"
                value={amount ?? ''}
                placeholder={$t({ id: 'transaction.dialog.fields.amount.placeholder' })}
                required
                aria-invalid={amountInvalid}
                onChange={(event) => {
                  const newValue = event.target.value;
                  setAmount(newValue !== '' ? Number(newValue) : undefined);
                }}
              />
              <InputGroupAddon>
                <EuroIcon className="size-5" />
              </InputGroupAddon>
            </InputGroup>
            <FieldError errors={amountDirty ? amountErrors : []} />
          </Field>
          <Field data-invalid={timestampInvalid}>
            <FieldLabel htmlFor="transaction-timestamp">
              {$t({ id: 'transaction.dialog.fields.timestamp.label' })}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <DateInput
              id="transaction-timestamp"
              value={timestamp ? new Date(timestamp) : undefined}
              placeholder={$t({ id: 'transaction.dialog.fields.timestamp.placeholder' })}
              required
              ariaInvalid={timestampInvalid}
              onChange={date => setTimestamp(date?.getTime())}
            />
            <FieldError errors={timestampDirty ? timestampErrors : []} />
          </Field>
          <Field data-invalid={categoryInvalid}>
            <FieldLabel htmlFor="transaction-category">
              {$t({ id: 'transaction.dialog.fields.category.label' })}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <CategoryInput
              id="transaction-category"
              value={category}
              placeholder={$t({ id: 'transaction.dialog.fields.category.placeholder' })}
              required
              ariaInvalid={categoryInvalid}
              onChange={setCategory}
            />
            <FieldError errors={categoryDirty ? categoryErrors : []} />
          </Field>
          <Field>
            <FieldLabel htmlFor="transaction-tags">
              {$t({ id: 'transaction.dialog.fields.tags.label' })}
            </FieldLabel>
            <TagsInput
              id="transaction-tags"
              value={tags}
              placeholder={$t({ id: 'transaction.dialog.fields.tags.placeholder' })}
              required
              onChange={setTags}
            />
          </Field>
        </FieldGroup>
        <DrawerFooter>
          <Button disabled={!dirty || !valid} onClick={handleSubmit}>
            {transaction?.id
              ? $t({ id: 'transaction.dialog.actions.update' })
              : $t({ id: 'transaction.dialog.actions.create' })}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">{$t({ id: 'transaction.dialog.actions.cancel' })}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
