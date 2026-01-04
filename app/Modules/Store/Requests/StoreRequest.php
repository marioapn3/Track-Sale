<?php

namespace App\Modules\Store\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            // created_by_sales_id akan diisi dari auth, tapi tetap divalidasi jika dikirim
            'created_by_sales_id' => 'nullable|exists:users,id',
            'image' => 'nullable|string|max:255',
        ];
    }
}
