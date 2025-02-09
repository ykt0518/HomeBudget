import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';

interface Expense {
  id: number;
  date: string;
  method_id: number;
  category_id: number;
  detail: string;
  payment: number;
  category: { category: string } | null;
  method: { method: string } | null;
}

interface Category {
  id: number;
  category: string;
};

interface Method {
  id: number;
  method: string;
};

interface ExpensesProps {
  expenses: Expense[];
  categories: Category[];
  methods: Method[];
  search_str: string;
  successMessage?: string;
}

export default function Expenses({ expenses, search_str, successMessage }: ExpensesProps) {

  const [searchStr, setSearchStr] = useState<string>(search_str || '');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);

  const form = useForm<{ id: number; search_str: string }>({
    id: 0,
    search_str: searchStr,
  });

  useEffect(() => {
    const filtered = expenses.filter(expense => new Date(expense.date).getMonth() + 1 === selectedMonth);
    setFilteredExpenses(filtered);
  }, [expenses, selectedMonth]);

  const deleteExpense = (id: number) => {
    if (confirm(`${id}を削除してもいいですか？`)) {
      form.delete(route('expenses.destroy', id));
    }
  };

  const searchGo = () => {
    const params: Record<string, any> = {};
    if (searchStr) {
      params.search_str = searchStr;
    }
    form.get(route('expenses.index'), params);
  };

  const currentMonth = new Date().getMonth() + 1;

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;

  const [message, setMessage] = useState<string | null>(successMessage || null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          家計簿
        </h2>
      }
    >
      <Head title="Expenses" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
            <div className="flex gap-10 items-center mb-5">
              <p
                className={`text-gray-900 cursor-pointer hover:text-indigo-500 transition duration-150 ${selectedMonth === prevMonth && 'font-semibold'}`}
                onClick={() => setSelectedMonth(prevMonth)}
              >
                {months[(prevMonth - 1) % 12]}
              </p>
              <p className="text-xl font-semibold leading-tight text-gray-800">
                {months[selectedMonth - 1]}
              </p>
              <p
                className={`text-gray-900 cursor-pointer hover:text-indigo-500 transition duration-150 ${selectedMonth === nextMonth && 'font-semibold'}`}
                onClick={() => setSelectedMonth(nextMonth)}
              >
                {months[nextMonth - 1]}
              </p>
            </div>
            <div className="mt-3 mb-3 ml-3 flex">
              <Link
                href={route('expenses.create')}
                className="px-4 py-2 bg-indigo-500 text-white border rounded-md font-semibold text-xs flex items-center justify-center gap-1 hover:opacity-80 transition duration-150"
              >
                <i className="fa-solid fa-plus-circle"></i> 登録
              </Link>
              <TextInput
                id="search_str"
                type="text"
                className="block w-52 ml-3"
                value={searchStr}
                onChange={(e) => {
                  setSearchStr(e.target.value);
                  form.setData('search_str', e.target.value);
                }}
                autoComplete="search_str"
                onBlur={searchGo}
              />
            </div>
            <div>
              {message && (
                <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded m-3">
                  {message}
                </div>
              )}
              <table className="table-auto border border-gray-400 w-10/12 m-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 px-4 py-2 w-12 text-center">ID</th>
                    <th className="border border-gray-400 px-4 py-2 w-28 text-center">日付</th>
                    <th className="border border-gray-400 px-4 py-2 w-48 text-center">支払い方法</th>
                    <th className="border border-gray-400 px-4 py-2 w-28 text-center">種類</th>
                    <th className="border border-gray-400 px-4 py-2 w-48 text-center">詳細</th>
                    <th className="border border-gray-400 px-4 py-2 w-28 text-center">金額</th>
                    <th className="border border-gray-400 px-4 py-2 w-28 text-center">編集</th>
                    <th className="border border-gray-400 px-4 py-2 w-28 text-center">削除</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses
                    .sort(
                      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((expense) => {
                      const date = new Date(expense.date);

                      return (
                        <tr key={expense.id}>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            {expense.id}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            {date.toLocaleDateString()}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            {expense.method && expense.method.method ? expense.method.method : "未分類"}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            {expense.category && expense.category.category ? expense.category.category : "未分類"}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            {expense.detail}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            {expense.payment.toLocaleString()}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            <Link
                              href={route('expenses.edit', expense.id)}
                              className="px-4 py-2 bg-indigo-500 text-white border rounded-md font-semibold text-xs hover:opacity-80 transition duration-150"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </Link>
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center">
                            <DangerButton onClick={() => deleteExpense(expense.id)}>
                              <i className="fa-solid fa-trash"></i>
                            </DangerButton>
                          </td>
                        </tr>
                      );
                    })}
                  <tr className='bg-gray-100'>
                    <td colSpan={5} className="border border-gray-400 px-4 py-2 text-right font-semibold">
                      合計金額
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center font-semibold">
                      {filteredExpenses.reduce((sum, expense) => sum + expense.payment, 0).toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
