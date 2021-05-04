import { LightningElement, api } from 'lwc';

export default class PropertyTile extends LightningElement {
    @api property;

    handlePropertySelected() {
        const selectEvent = new CustomEvent('selected', {
            detail: this.property.Id
        });
        this.dispatchEvent(selectEvent);
    }

    get backgroundImageStyle() {
        return `background-image:url(${this.property.Thumbnail__c})`;
    }
}