import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "./customer/customer-address-changed.event";
import CustomerCreatedEvent from "./customer/customer-created.event";
import EventDispatcher from "./event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "./product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "./product/product-created.event";
import EnviaConsoleLog3Handler from "./customer/handler/envia-console-log-3.handler";
import EnviaConsoleLog1Handler from "./customer/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./customer/handler/envia-console-log-2.handler";

describe("Domain event tests", () => {

    it("should register product created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should register customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
    });

    it("should register customer address changend event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog3Handler();

        eventDispatcher.register("CustomerAddressChanged", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"][0]).toMatchObject(eventHandler);
    });

    it("should unregister product created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
    
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
    
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    
        eventDispatcher.unregister("CustomerCreatedEvent", firstEventHandler);
    
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    });

    it("should unregister customer address changend event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog3Handler();

        eventDispatcher.register("CustomerAddressChanged", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerAddressChanged", eventHandler);
    
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"].length).toBe(0);
    });
    
    it("should notify product created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify all customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstMessageEventHandler = new EnviaConsoleLog1Handler();
        const secondMessageEventHandler = new EnviaConsoleLog2Handler();

        const firstMessageSpyEventHandler = jest.spyOn(firstMessageEventHandler, "handle");
        const secondMessageSpyEventHandler = jest.spyOn(secondMessageEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstMessageEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondMessageEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstMessageEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondMessageEventHandler);

        const customer = new Customer('123', 'Customer 1');
        const customerCreatedEvent = new CustomerCreatedEvent({ customer });
        
        eventDispatcher.notify(customerCreatedEvent);

        expect(firstMessageSpyEventHandler).toHaveBeenCalled();
        expect(secondMessageSpyEventHandler).toHaveBeenCalled();
    });

    it("should notify customer address changed event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const firstMessageCustomerCreatedEventHandler = new EnviaConsoleLog1Handler();
        const secondMessageCustomerCreatedEventHandler = new EnviaConsoleLog2Handler();
        const addressChangedEventHandler = new EnviaConsoleLog3Handler();

        const firstMessageCustomerCreatedSpyEventHandler = jest.spyOn(firstMessageCustomerCreatedEventHandler, "handle");
        const secondMessageCustomerCreatedSpyEventHandler = jest.spyOn(secondMessageCustomerCreatedEventHandler, "handle");
        const addressChangedSpyEventHandler = jest.spyOn(addressChangedEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstMessageCustomerCreatedEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondMessageCustomerCreatedEventHandler);
        eventDispatcher.register("CustomerAddressChangedEvent", addressChangedEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstMessageCustomerCreatedEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondMessageCustomerCreatedEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(addressChangedEventHandler);
    
        const customer = new Customer('123', 'Customer 1');
        const customerCreatedEvent = new CustomerCreatedEvent({
            customer
        });
        eventDispatcher.notify(customerCreatedEvent);

        const address = new Address('Rua 1', 2, '12345-678', 'São Paulo');
        customer.changeAddress(address);

        const addressChangedEvent = new CustomerAddressChangedEvent({ 
            id: customer.id,
            name: customer.name
        });

        eventDispatcher.notify(addressChangedEvent);

        expect(firstMessageCustomerCreatedSpyEventHandler).toHaveBeenCalled();
        expect(secondMessageCustomerCreatedSpyEventHandler).toHaveBeenCalled();
        expect(addressChangedSpyEventHandler).toHaveBeenCalled();
    });
})