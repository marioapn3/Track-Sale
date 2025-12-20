import './bootstrap';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import AppLayout from './layout/AppLayout';
import { Toaster } from 'sonner';


createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}', { eager: true });
        const page = pages[`./Pages/${name}.tsx`] || pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        const PageComponent = page.default;

        // Wrap Dashboard pages with AppLayout
        if (name.startsWith('Dashboard/')) {
            return {
                default: (props) => (
                    <AppLayout>
                        <PageComponent {...props} />
                    </AppLayout>
                ),
            };
        }

        return page;
    },
    defaults: {
        form: {
            recentlySuccessfulDuration: 5000,
        },
        prefetch: {
            cacheFor: '1m',
            hoverDelay: 150,
        },
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <Toaster
                    position="top-right"
                    duration={3000}
                    richColors
                    theme="dark"
                    className="z-99999"
                    visibleToasts={3}
                    gap={50}
                />
                <ScrollToTop />
                <App {...props} />
            </ThemeProvider>
        )
    },
})
