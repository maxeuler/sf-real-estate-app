import { LightningElement, api } from 'lwc';

export default class PaginationControls extends LightningElement {
    @api pageNumber;
    @api pageSize;
    @api totalItemCount;

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    get currentPageNumber() {
        return this.totalItemCount != 0 ? this.pageNumber : 0;
    }

    get totalPages() {
        return Math.ceil(this.totalItemCount / this.pageSize);
    }

    get isFirstPage() {
        return this.pageNumber == 1;
    }

    get isLastPage() {
        return this.pageNumber >= this.totalPages;
    }

}