
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
    path: 'merchandise',
    data: {
      menu: {
        title: 'Merchandise',
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
      //===== If Orders Should be Seperate option in Menu
      // {
      //   path: 'orders',
      //   data: {
      //     menu: {
      //       title: 'Orders',
      //       pathMatch: 'partial'
      //     }
      //   }
      // }
    ]
  },
  {
    path: 'catalog-management',
    data: {
      menu: {
        title: 'Catalog Management',
        icon: 'ion-document',
        selected: false,
        expanded: false,
        order: 1
      }
    }
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
    }
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
