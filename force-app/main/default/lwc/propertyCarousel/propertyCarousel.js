import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import ADDRESS_FIELD from '@salesforce/schema/Property__c.Address__c';
import CITY_FIELD from '@salesforce/schema/Property__c.City__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Property__c.Description__c';

const FIELDS = [ADDRESS_FIELD, CITY_FIELD, DESCRIPTION_FIELD];

export default class PropertyCarousel extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    property

    get address() {
        return getFieldValue(this.property.data, ADDRESS_FIELD);
    }

    get description() {
        return getFieldValue(this.property.data, DESCRIPTION_FIELD);
    }
}