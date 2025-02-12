<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Expense;
use App\Models\Category;
use App\Models\Method;
use Inertia\Inertia;
use App\Http\Requests\ExpenseRequest;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // ログインユーザーの支出データのみ取得
        $query = Expense::with(['category', 'method'])
            ->where('user_id', Auth::id());  // ユーザーIDで絞り込み

        // 検索文字列がある場合のみフィルタリング
        if (!empty($request->input('search_str'))) {
            $search_str = $request->input('search_str');
            $expenses = $query->where(function ($query) use ($search_str) {
                $query->whereRaw("DATE_FORMAT(date, '%c/%e') LIKE ?", ["%{$search_str}%"])
                    ->orWhereHas('category', function ($q) use ($search_str) {
                        $q->where('category', 'LIKE', "%{$search_str}%");
                    })
                    ->orWhereHas('method', function ($q) use ($search_str) {
                        $q->where('method', 'LIKE', "%{$search_str}%");
                    });
            })->get();
        } else {
            $expenses = $query->get();  // 検索文字列がない場合はユーザーの全ての支出データ
            $search_str = null;
        }
        
        $categories = Category::all();
        $methods = Method::all();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'methods' => $methods,
            'search_str' => $search_str,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        $methods = Method::all();
        
        $expenses = Expense::with(['category', 'method'])->get();
        return Inertia::render('Expenses/Create', [
            'categories' => $categories,
            'methods' => $methods,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExpenseRequest $request)
    {
        $expense = new Expense($request->input());
        $expense->user_id = Auth::id();
        $expense->save();
        return redirect('expenses')->with('success_str', '登録が完了しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $categories = Category::all();
        $methods = Method::all();

        $expense = Expense::with(['category', 'method'])->findOrFail($id);

        $expense->formatted_date = Carbon::parse($expense->date)->format('Y-m-d');

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
            'categories' => $categories,
            'methods' => $methods,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $expense = Expense::findOrFail($id);
        $expense->update($request->only(['date', 'method_id', 'category_id', 'detail', 'payment']));
        return redirect()->route('expenses.index')->with('success_str', '更新が完了しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return redirect('expenses');
    }
}

