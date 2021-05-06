import { LightningElement, wire, api } from 'lwc';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

import DATE_LISTED_FIELD from '@salesforce/schema/Property__c.Date_Listed__c';
import DAYS_ON_MARKET_FIELD from '@salesforce/schema/Property__c.Days_On_Market__c';

const FIELDS = [DATE_LISTED_FIELD, DAYS_ON_MARKET_FIELD];

const MAX_DAYS_CHART = 90;
const MAX_DAYS_NORMAL_STATUS = 30;
const MAX_DAYS_WARNING_STATUS = 60;

export default class DaysOnMarket extends LightningElement {
    daysOnMarket;
    propertyId;
    status;
    dateListed;
    error;

    @wire(getRecord, { recordId: '$propertyId', fields: FIELDS })
    wiredRecord({ data, error }) {
        if (data) {
            this.error = undefined;
            this.dateListed = getFieldValue(data, DATE_LISTED_FIELD);
            this.daysOnMarket = getFieldValue(data, DAYS_ON_MARKET_FIELD);
            if (this.daysOnMarket < MAX_DAYS_NORMAL_STATUS) {
                this.status = 'normal';
            } else if (this.daysOnMarket < MAX_DAYS_WARNING_STATUS) {
                this.status = 'warning';
            } else {
                this.status = 'alert';
            }
        } else if (error) {
            this.daysOnMarket = undefined;
            this.dateListed = undefined;
            this.status = undefined;
            this.error = error;
        }
    }

    @api
    get recordId() {
        return this.propertyId;
    }

    set recordId(propertyId) {
        this.propertyId = propertyId;
    }

    get badgeClass() {
        return 'badge ' + this.status;
    }
    
    get barClass() {
        return 'bar ' + this.status;
    }

    get barStyle() {
        const value = (this.daysOnMarket / MAX_DAYS_CHART) * 100;
        return 'width:' + value + '%';
    }
}