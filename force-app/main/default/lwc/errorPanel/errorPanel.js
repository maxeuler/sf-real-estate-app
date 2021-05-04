import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import noDataIllustration from './templates/noDataIllustration.html';

export default class ErrorPanel extends LightningElement {
    @api type;
    @api errors;
    @api friendlyMessage = 'Error retrieving data';

    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors); 
    }

    render() {
        return noDataIllustration;
    }
}