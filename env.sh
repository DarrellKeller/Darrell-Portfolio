#!/bin/sh

# Recreate config.js
echo "window.env = {" > /usr/share/nginx/html/config.js
echo "  VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> /usr/share/nginx/html/config.js
echo "  VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> /usr/share/nginx/html/config.js
echo "  VITE_PUBLIC_POSTHOG_KEY: \"$VITE_PUBLIC_POSTHOG_KEY\"," >> /usr/share/nginx/html/config.js
echo "  VITE_PUBLIC_POSTHOG_HOST: \"$VITE_PUBLIC_POSTHOG_HOST\"" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js

# Start Nginx
exec "$@"
