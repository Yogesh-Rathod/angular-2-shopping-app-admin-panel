
const menus = [
    {
        path: 'home',
        MenuCode: 'HOM',
        data: {
            menu: {
                title: 'Home',
                icon: 'ion-home',
                selected: false,
                expanded: false,
                order: 1
            }
        }
    },
    {
        path: 'seller',
        MenuCode: 'SLR',
        data: {
            menu: {
                title: 'Seller',
                icon: 'ion-pricetags',
                selected: false,
                expanded: false,
                order: 1
            }
        },
        children: [
            {
                path: 'profile',
                data: {
                    menu: {
                        title: 'Profile',
                        pathMatch: 'partial'
                    }
                }
            },
            {
                path: 'seller-products',
                data: {
                    menu: {
                        title: 'Products',
                        pathMatch: 'partial'
                    }
                }
            },
            {
                path: 'orders',
                data: {
                    menu: {
                        title: 'Orders',
                        pathMatch: 'partial'
                    }
                }
            },
            // {
            //     path: 'returns',
            //     data: {
            //         menu: {
            //             title: 'Returns',
            //             pathMatch: 'partial'
            //         }
            //     }
            // }
        ]
    },
    {
        path: 'merchandise',
        MenuCode: 'PRD',
        data: {
            menu: {
                title: 'Product Management',
                icon: 'ion-bag',
                selected: false,
                expanded: false,
                order: 0
            }
        },
        children: [
            {
                path: 'categories',
                data: {
                    menu: {
                        title: 'Categories',
                        pathMatch: 'partial'
                    }
                }
            },
            {
                path: 'vendors',
                data: {
                    menu: {
                        title: 'Sellers',
                        pathMatch: 'partial'
                    }
                }
            },
            {
                path: 'products',
                data: {
                    menu: {
                        title: 'Products',
                        pathMatch: 'partial'
                    }
                }
            },
            {
                path: 'catalog-management',
                data: {
                    menu: {
                        title: 'Catalog Management',
                        pathMatch: 'partial'
                    }
                }
            },
            {
                path: 'approvals',
                data: {
                    menu: {
                        title: 'My Tasks',
                        pathMatch: 'partial'
                    }
                }
            },
        ]
    },
    {
        path: 'order-management',
        MenuCode: 'ORD',
        data: {
            menu: {
                title: 'Order Management',
                icon: 'ion-briefcase',
                selected: false,
                expanded: false,
                order: 1
            }
        },
        children: [
            {
                path: 'orders',
                data: {
                    menu: {
                        title: 'Orders',
                        pathMatch: 'partial'
                    }
                }
            },
            // {
            //     path: 'rto',
            //     data: {
            //         menu: {
            //             title: 'RTO',
            //             pathMatch: 'partial'
            //         }
            //     }
            // },
            {
                path: 'reports',
                data: {
                    menu: {
                        title: 'SLA Reports',
                        pathMatch: 'partial'
                    }
                }
            },
            // {
            //     path: 'order-reports',
            //     data: {
            //         menu: {
            //             title: 'Order Reports',
            //             pathMatch: 'partial'
            //         }
            //     }
            // }
        ]
    },
    {
        path: 'movie-management',
        MenuCode: 'MOV',
        data: {
            menu: {
                title: 'Movie Management',
                icon: 'ion-videocamera',
                selected: false,
                expanded: false,
                order: 1
            }
        }
    },
    {
        path: 'user-management',
        MenuCode: 'SYS',
        data: {
            menu: {
                title: 'User Management',
                icon: 'ion-person-stalker',
                selected: false,
                expanded: false,
                order: 1
            }
        }
    }
];


export const PAGES_MENU = [
    {
        path: '',
        children: menus
    }
];
