import Order from "./order";
import OrderItem from "./order-item";

describe('Order unit tests', () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            const order = new Order('', '123', []);
        }).toThrowError("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            const order = new Order('1', '', []);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when items is empty", () => {
        expect(() => {
            const order = new Order('1', '123', []);
        }).toThrowError("Items are required");
    });

    it("should calculate total", () => {
        const item1 = new OrderItem('i1', 'p1', 'Item 1', 100, 2);
        const item2 = new OrderItem('2', 'p2', 'Item 2', 50, 2);

        const order1 = new Order('o1', 'c1', [item1]);
        let total = order1.total();

        expect(total).toBe(200);

        const order2 = new Order('o2', 'c1', [item1, item2]);
        total = order2.total();

        expect(total).toBe(300);
    });

    it("should throw error if the item quantity is less or equal zero", () => {
        expect(() => {
            const item = new OrderItem('i1', 'p1', 'Item 1', 100, 0);
            const order = new Order('o1', 'c1', [item]);
        }).toThrowError("Quantity must be greater than zero");
    });
});