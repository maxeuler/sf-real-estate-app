import { LightningElement, wire } from 'lwc';
import { publish, MessageContext, releaseMessageContext } from 'lightning/messageService';
import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';

const DELAY = 350;
const MAX_PRICE = 1200000;

export default class PropertyFilter extends LightningElement {
    searchKey = '';
    maxPrice = MAX_PRICE;
    minBedrooms = 0;
    minBathrooms = 0;

    @wire(MessageContext)
    messageContext;

    handleReset() {
        this.searchKey = '';
        this.maxPrice = MAX_PRICE;
        this.minBedrooms = 0;
        this.minBathrooms = 0;
        this.fireChangeEvent();
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.detail.value;
        this.fireChangeEvent();
    }

    handleMaxPriceChange(event) {
        this.maxPrice = event.detail.value;
        this.fireChangeEvent();
    }

    handleMinBedroomsChange(event) {
        this.minBedrooms = event.detail.value;
        this.fireChangeEvent();
    }

    handleMinBathroomsChange(event) {
        this.minBathrooms = event.detail.value;
        this.fireChangeEvent();
    }

    fireChangeEvent() {
        window.clearTimeout(this.delayTimeout);

        this.delayTimeout = setTimeout(() => {
            const filters = {
                searchKey: this.searchKey,
                maxPrice: this.maxPrice,
                minBedrooms: this.minBedrooms,
                minBathrooms: this.minBathrooms
            };
            publish(this.messageContext, FILTERSCHANGEMC, filters);
        }, DELAY);
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }
}