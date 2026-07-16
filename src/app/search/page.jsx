import Component from '@/old_pages/SearchPage';
import MainLayout from '@/layouts/MainLayout';

export const metadata = {
    title: 'Search Page | Pbtadka',
};

import { Suspense } from 'react';

export default function Page() {
    return (
        <MainLayout>
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading search...</div>}>
                <Component />
            </Suspense>
        </MainLayout>
    );
}
