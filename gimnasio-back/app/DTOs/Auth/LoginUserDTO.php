<?php

namespace App\DTOs\Auth;

use App\Http\Requests\Auth\AuthLoginRequest;

readonly class LoginUserDTO
{
    public function __construct(
        public string $email,
        public string $password
    ) {}

    public static function fromRequest(AuthLoginRequest $request): self
    {
        return new self(
            email: $request->validated('email'),
            password: $request->validated('password')
        );
    }
}
