export const fetcher = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('access_token');

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Network error');
    }

    return res.json();
};
