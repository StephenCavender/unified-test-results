import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReport } from '../test-report-view/test-report';
import TestCaseResult from '../test-report-view/test-case-result';
import { JiraService } from '../jira/jira.service';
import { JiraIssue } from '../jira/jira-issue';
import * as _ from 'lodash';

@Component({
    selector: 'test-report-table',
    templateUrl: './test-report-table.component.html',
    styleUrls: ['./test-report-table.component.less'],
    providers: [JiraService]
})
export class TestReportTableComponent implements OnInit {
    @ViewChild('testReportTable') table: any;

    @Input()
    testReport: TestReport;

    columns: any[] = [
        { name: 'Test Case', prop: 'displayName' },
        { name: 'QA Status', prop: 'qaStatus', cellClass: this.statusCellClass },
        { name: 'QA Age', prop: 'qaAge' },
        { name: 'Main Status', prop: 'mainStatus', cellClass: this.statusCellClass },
        { name: 'Main Age', prop: 'mainAge' },
        { name: 'Team' }];

    constructor(private jiraService: JiraService) { }

    ngOnInit() {

    }

    statusCellClass({ row, column, value }): any {
        return {
            'status-failed': value === 'FAILED'
        }
    }

    scrCellClass({ row, column, value }): any {
        return {
            'needs-scr': row.needsJiraIssue
        }
    }

    scrComparator(valueA: JiraIssue, valueB: JiraIssue, rowA: TestCaseResult, rowB: TestCaseResult, sortDirection: string): number {
        if (valueA && valueB) {
            if (valueA.key < valueB.key) {
                return -1;
            } else if (valueA.key > valueB.key) {
                return 1;
            }

        } else if (valueA) {
            return 1;
        } else if (valueB) {
            return -1;
        } else { //valueA and valueB are null
            let rowAHasButton = rowA.needsJiraIssue;
            let rowBHasButton = rowB.needsJiraIssue;

            if (rowAHasButton && !rowBHasButton) {
                return 1;
            } else if (rowBHasButton && !rowAHasButton) {
                return -1;
            }
        }
    }

    createScr(row: TestCaseResult): void {
        row.isCreatingJiraIssue = true;
        this.jiraService.postNewIssue(row)
            .then((issue: JiraIssue) => {
                row.jiraIssue = issue;
                return;
            }).then(() => { row.isCreatingJiraIssue = false; })
            .catch(() => { row.isCreatingJiraIssue = false; });
    }

    onActivate(event) {
        if(event.type === 'click' && event.value === 'FAILED') {
            this.table.rowDetail.toggleExpandRow(event.row);
        }

    }


}
