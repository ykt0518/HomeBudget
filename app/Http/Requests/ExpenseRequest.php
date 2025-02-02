<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'method_id' => 'required|integer',
            'category_id' => 'required|integer',
            'detail' => 'required|string|max:50|min:0',
            'payment' => 'required|integer|max:10000000|min:10',
        ];
    }
    public function attributes()
    {
        return [
            'method_id' => '支払い方法',
            'category_id' => '種類',
            'detail' => '詳細',
            'payment' => '金額',
        ];
    }
    public function messages()
    {
        return [
            'method_id.required' => ':attributeを入力してください。',
            'category_id.required' => ':attributeを入力してください。',
            'detail.required' => ':attributeを入力してください。',
            'detail.min' => ':attributeは:min文字以上で入力してください。',
            'detail.max' => ':attributeは:max文字以内で入力してください。',
            'payment.required' => ':attributeを入力してください。',
            'payment.min' => ':attributeは:min円以上で入力してください。',
            'payment.max' => ':attributeは:max円以下で入力してください。',
            'payment.integer' => ':attributeは:数値で入力してください。',
        ];
    }
}
