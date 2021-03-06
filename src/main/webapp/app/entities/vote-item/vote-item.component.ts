import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { VoteItem } from './vote-item.model';
import { VoteItemService } from './vote-item.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import {VoteService} from "../vote/vote.service";
import {Vote} from "../vote/vote.model";

@Component({
    selector: 'jhi-vote-item',
    templateUrl: './vote-item.component.html'
})
export class VoteItemComponent implements OnInit, OnDestroy {

currentAccount: any;
    voteItems: VoteItem[];
    votes: Vote[];
    voteId: any = null;
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private voteItemService: VoteItemService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private voteService: VoteService,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.voteItemService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            voteId: this.voteId?this.voteId: '',
            sort: this.sort()}).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/vote-item'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/vote-item', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInVoteItems();
        this.voteService.query()
            .subscribe((res: ResponseWrapper) => { this.votes = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: VoteItem) {
        return item.id;
    }
    registerChangeInVoteItems() {
        this.eventSubscriber = this.eventManager.subscribe('voteItemListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.voteItems = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
