import { Injectable } from '@angular/core';

@Injectable()
export class ProductsService {

  // Vendor Products
  private products = [
    {
      id: 12345,
      picture: [
        {
          url: 'assets/images/products/home-office-336373_640.jpg',
          alt: 'some text',
          title: 'some text',
          displayOrder: 1
        }
      ],
      name: 'Apple MacBook Air',
      shortDescription: 'some short description',
      fullDescription: 'Full Description',
      sku: 'PG_CR_100',
      currency: '₹ (INR)',
      netPrice: 1000,
      netShipping: 100,
      MrpPrice: 156300,
      oldPrice: null,
      retailPrice: 155300,
      retailShipping: 1000,
      rpi: 1000,
      stockQuantity: 2,
      categories: '',
      vendor: 'vendor 1',
      productType: 'Simple',
      type: 'Type of product',
      status: 'Active',
      brand: 'Spykar',
      approvalStatus: 'Approved'
    },
    {
      id: 12346,
      picture: [
        {
          url: 'assets/images/products/laptop-154091_640.png',
          alt: 'some text',
          title: 'some text',
          displayOrder: 1
        }
      ],
      name: 'Dell Inspiron Core',
      shortDescription: '',
      fullDescription: '',
      sku: 'Dell_Inspiron_Core_20',
      MrpPrice: 27990,
      retailPrice: 26990,
      stockQuantity: 20,
      productType: 'Simple',
      status: 'Inactive',
      categories: '',
      approvalStatus: 'Rejected'
    },
    {
      id: 12347,
      picture: [
        {
          url: 'assets/images/products/laptop-images.jpeg',
          alt: 'some text',
          title: 'some text',
          displayOrder: 1
        }
      ],
      name: 'HP 15 Core i3',
      shortDescription: '',
      fullDescription: '',
      sku: 'HP_15_Core_i3',
      MrpPrice: 32990,
      retailPrice: 26990,
      stockQuantity: 20,
      productType: 'Simple',
      status: 'Active',
      categories: '',
      approvalStatus: 'Pending'
    }
  ];

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    this.products.push(product);
    return this.products;
  }

  editProduct(products) {
    this.products = products;
    return this.products;
  }


}