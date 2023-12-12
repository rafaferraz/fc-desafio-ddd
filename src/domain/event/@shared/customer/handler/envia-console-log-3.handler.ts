import EventHandlerInterface from "../../event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";


export default class EnviaConsoleLog3Handler implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: CustomerAddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }
}