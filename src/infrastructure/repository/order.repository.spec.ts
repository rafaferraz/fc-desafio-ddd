import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import ProductModel from '../db/sequelize/model/product.model';
import CustomerRepository from './customer.repository';
import Customer from '../../domain/entity/customer';
import Address from '../../domain/entity/address';
import ProductRepository from './product.repository';
import Product from '../../domain/entity/product';
import OrderItem from '../../domain/entity/order-item';
import Order from '../../domain/entity/order';
import OrderRepository from './order.repository';

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem('1', product.id, product.name, product.price, 2);
        const order = new Order('123', customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        });
    });

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem('1', product.id, product.name, product.price, 2);
        const order = new Order('123', customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
    
        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        });

        const product2 = new Product('456', 'Product 2', 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem('2', product2.id, product2.name, product2.price, 3);
        
        order.changeItems([orderItem, orderItem2]);
    
        await orderRepository.update(order);

        const orderModel2 = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel2.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        });
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem('1', product.id, product.name, product.price, 2);
        const order = new Order('123', customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }});
        const foundOrder = await orderRepository.find("123");

        expect(orderModel.toJSON()).toStrictEqual({
            id: foundOrder.id,
            customer_id: foundOrder.customerId,
            total: foundOrder.total()
        });
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);
        const product2 = new Product('456', 'Product 2', 20);
        await productRepository.create(product2);

        const orderItem = new OrderItem('1', product.id, product.name, product.price, 2);
        const orderItem2 = new OrderItem('2', product2.id, product2.name, product2.price, 3);

        const orderRepository = new OrderRepository();
        const order = new Order('123', customer.id, [orderItem]);
        await orderRepository.create(order);
        const order2 = new Order('456', customer.id, [orderItem2]);
        await orderRepository.create(order2);

        const orderModels = await orderRepository.findAll();
        const orders = [order, order2];

        expect(orderModels).toHaveLength(2);
        expect(orderModels).toEqual(orders);
    });
});