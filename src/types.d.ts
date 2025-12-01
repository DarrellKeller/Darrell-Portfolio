export { };

declare global {
    interface Window {
        env: {
            VITE_SUPABASE_URL: string;
            VITE_SUPABASE_ANON_KEY: string;
        };
    }
}
