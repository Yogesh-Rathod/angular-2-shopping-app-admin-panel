
const menus = [
  {
    path: 'home',
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
        path: 'orders',
        data: {
          menu: {
            title: 'Orders',
            pathMatch: 'partial'
          }
        }
      },
      {
        path: 'returns',
        data: {
          menu: {
            title: 'Returns',
            pathMatch: 'partial'
          }
        }
      }
    ]
  },
  {
    path: 'merchandise',
    data: {
      menu: {
        title: 'Product Management',
        icon: 'ion-bag',
        selected: true,
        expanded: true,
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
            title: 'Vendors',
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
      }
    ]
  },
  {
    path: 'orders',
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
        path: '',
        data: {
          menu: {
            title: 'Orders',
            pathMatch: 'partial'
          }
        }
      },
      {
        path: 'rto',
        data: {
          menu: {
            title: 'RTO',
            pathMatch: 'partial'
          }
        }
      },
      {
        path: 'reports',
        data: {
          menu: {
            title: 'Reports',
            pathMatch: 'partial'
          }
        }
      }
    ]
  },
  {
    path: 'movie-management',
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
