import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Property__c.Name';
import BED_FIELD from '@salesforce/schema/Property__c.Beds__c';
import BATH_FIELD from '@salesforce/schema/Property__c.Baths__c';
import PRICE_FIELD from '@salesforce/schema/Property__c.Price__c';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__c';
import PICTURE_FIELD from '@salesforce/schema/Property__c.Picture__c';

export default class PropertySummary extends LightningElement {
    propertyId = 'a017R00003ljNgkQAE';
    propertyFields = [BED_FIELD, BATH_FIELD, PRICE_FIELD, BROKER_FIELD];

    @wire(getRecord, {
        recordId: '$propertyId',
        fields: [NAME_FIELD, PICTURE_FIELD]
    })
    property;

    @api
    get recordId() {
        return this.propertyId;
    }

    get propertyName() {
        return getFieldValue(this.property.data, NAME_FIELD);
    }

    get pictureURL() {
        return getFieldValue(this.property.data, PICTURE_FIELD);
    }
}