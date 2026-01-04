export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to login");
    }

    return response.data;
};

