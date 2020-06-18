export const routes = [{
        path: '/',
        name: 'BookShelf',
        component: () => import('../views/BookShelf.vue')
    },
    {
        path: '/bookCity',
        name: 'BookCity',
        component: () => import('../views/BookCity.vue')
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/bookDetail/:id',
        name: 'BookDetail',
        component: () => import('../views/BookDetail.vue')
    },
    {
        path: '/book',
        name: 'Book',
        component: () => import('../views/Book.vue'),
        children: [{
                path: 'catalog',
                name: 'Catalog',
                component: () => import('../views/Catalog.vue'),
            },
            {
                path: 'bookRead/:url',
                name: 'BookRead',
                component: () => import('../views/BookRead.vue')
            }
        ]
    },
]