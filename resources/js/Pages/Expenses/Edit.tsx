import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import SelectInput from '@/Components/SelectInput';

interface ExpenseFormData {
  date: string;
  method_id: number | null;
  category_id: number | null;
  detail: string;
  payment: number;

  [key: string]: any;
}

interface Category {
  id: number;
  category: string;
}

interface Method {
  id: number;
  method: string;
}

interface Expense {
  id: number;
  date: string;
  formatted_date: string;
  method_id: number;
  category_id: number;
  detail: string;
  payment: number;
}

interface EditExpenseProps {
  expense: Expense;
  methods: Method[];
  categories: Category[];
}

export default function EditExpense({ expense, methods, categories }: EditExpenseProps) {

  const { data, setData, patch, processing, errors, reset } = useForm<ExpenseFormData>({
    date: expense?.formatted_date || '',
    method_id: expense?.method_id ?? null,
    category_id: expense?.category_id ?? null,
    detail: expense?.detail || '',
    payment: expense?.payment ?? 0,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('expenses.update', expense.id), {
      onSuccess: () => reset('date', 'method_id', 'category_id', 'detail', 'payment'),
    });
  };

  const methodOptions = methods.map((method) => {
    return {
      id: method.id,
      name: method.method,
    };
  });

  const categoryOptions = categories.map((category) => {
    return {
      id: category.id,
      name: category.category,
    };
  });

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          家計簿
        </h2>
      }
    >
      <Head title="Edit Expense" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold leading-tight text-gray-800">
              編集
            </h3>
            <div className="mt-3 mb-3 flex">
              <Link
                href={route('expenses.index')}
                className="px-4 py-2 bg-indigo-500 text-white border rounded-md font-semibold text-xs hover:opacity-80 transition duration-150"
              >
                <i className="fa-solid fa-plus-circle"></i> 戻る
              </Link>
            </div>

            <form onSubmit={submit}>
              <div className="mt-4">
                <InputLabel htmlFor="date" value="日付" />
                <TextInput
                  id="date"
                  type="date"
                  name="date"
                  value={data.date}
                  className="mt-1 block w-full"
                  autoComplete="date"
                  onChange={(e) => setData('date', e.target.value)}
                  required
                />
                <InputError message={errors.date} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="method_id" value="支払い方法" />
                <SelectInput
                  id="method_id"
                  name="method_id"
                  options={methodOptions}
                  value={data.method_id ?? ''}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('method_id', Number(e.target.value))}
                  required
                />
                <InputError message={errors.method_id} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="category_id" value="種類" />
                <SelectInput
                  id="category_id"
                  name="category_id"
                  options={categoryOptions}
                  value={data.category_id ?? ''}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('category_id', Number(e.target.value))}
                  required
                />
                <InputError message={errors.category_id} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="detail" value="詳細" />
                <TextInput
                  id="detail"
                  type="text"
                  name="detail"
                  value={data.detail}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('detail', e.target.value)}
                  required
                />
                <InputError message={errors.detail} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="payment" value="金額" />
                <TextInput
                  id="payment"
                  type="number"
                  name="payment"
                  value={data.payment || ''}
                  className="mt-1 block w-full"
                  onChange={(e) => {
                    const value = e.target.value;
                    const numericValue = value === '' ? 0 : Number(value);
                    setData('payment', isNaN(numericValue) ? 0 : numericValue);
                  }}
                  required
                />
                <InputError message={errors.payment} className="mt-2" />
              </div>

              <div className="mt-4 flex items-center justify-end">
                <PrimaryButton className="ms-4" disabled={processing}>
                  更新
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
