export interface Post {
    id: string;
    title: string;
    content: string;
    created_at: string;
    media_url?: string;
    video_url?: string;
    external_url?: string;
    new_tab?: boolean;
    x: number;
    y: number;
}
