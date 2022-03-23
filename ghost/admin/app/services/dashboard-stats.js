import Service, {inject as service} from '@ember/service';
import moment from 'moment';
import {tracked} from '@glimmer/tracking';

/**
 * @typedef MrrStat
 * @type {Object}
 * @property {string} date The date (YYYY-MM-DD) on which this MRR was recorded
 * @property {number} mrr The MRR on this date
 */

/**
 * @typedef MemberCountStat
 * @type {Object}
 * @property {string} date The date (YYYY-MM-DD) on which these counts were recorded
 * @property {number} paid Amount of paid members
 * @property {number} free Amount of free members
 * @property {number} comped Amount of comped members
 * @property {number} newPaid Amount of new paid members
 * @property {number} canceledPaid Amount of canceled paid members
 */

/**
 * @typedef MemberCounts
 * @type {Object}
 * @property {number} total Total amount of members
 * @property {number} paid Amount of paid members
 * @property {number} free Amount of free members
 */

/**
 * @todo: THIS ONE IS TEMPORARY
 * @typedef EmailOpenRateStat (Will be the same as post model probably)
 * @type {Object}
 * @property {string} id Post id
 * @property {string} title Post title
 * @property {?Object} Email model
 */

/**
 * @typedef PaidMembersByCadence
 * @type {Object}
 * @property {number} annual Paid memebrs on annual plan
 * @property {number} monthly Paid memebrs on monthly plan
 */

/**
 * @typedef PaidMembersForTier
 * @type {Object}
 * @property {Object} tier Tier object
 * @property {number} members Paid members on this tier
 */

export default class DashboardStatsService extends Service {
    @service dashboardMocks;

    /**
     * @type {?MemberCounts} memberCounts
     */
    @tracked
        memberCounts = null;

    /**
     * @type {?MemberCountStat[]}
     */
    @tracked
        memberCountStats = null;

    /**
     * @type {?MrrStat[]}
     */
    @tracked
        mrrStats = null;

    /**
     * @type {PaidMembersByCadence} Number of members for annual and monthly plans
     */
    @tracked
        paidMembersByCadence = null;

    /**
     * @type {PaidMembersForTier[]} Number of members for each tier
     */
    @tracked
        paidMembersByTier = null;

    /**
     * @type {?number} Number of members last seen in last 30 days (could differ if filtered by member status)
     */
    @tracked
        membersLastSeen30d = null;

    /**
     * @type {?number} Number of members last seen in last 7 days (could differ if filtered by member status)
     */
    @tracked
        membersLastSeen7d = null;

    /**
     * @type {?MemberCounts} Number of members that are subscribed (grouped by status)
     */
    @tracked
        newsletterSubscribers = null;

    /**
     * @type {?number} Number of emails sent in last 30 days
     */
    @tracked
        emailsSent30d = null;

    /**
     * @type {?EmailOpenRateStat[]}
     */
    @tracked
        emailOpenRateStats = null;

    loadMembersCounts() {
        if (this.dashboardMocks.enabled) {
            this.memberCounts = {...this.dashboardMocks.memberCounts};
            return;
        }
        // Normal implementation
        // @todo
    }

    /**
     * Loads the members graphs
     * - total paid
     * - total members
     * for each day in the last {{days}} days
     * @param {number} days The number of days to fetch data for
     */
    loadMemberCountStats(days) {
        if (this.dashboardMocks.enabled) {
            if (this.dashboardMocks.memberCountStats === null) {
                return null;
            }
            this.memberCountStats = this.fillMissingDates(this.dashboardMocks.memberCountStats.slice(-days), {paid: 0, free: 0, comped: 0}, days);
            return;
        }

        // Normal implementation
        // @todo
    }

    /**
     * Loads the mrr graphs
     * @param {number} days The number of days to fetch data for
     */
    loadMrrStats(days) {
        if (this.dashboardMocks.enabled) {
            if (this.dashboardMocks.mrrStats === null) {
                return null;
            }
            this.mrrStats = this.fillMissingDates(this.dashboardMocks.mrrStats.slice(-days), {mrr: 0}, days);
            return;
        }

        // Normal implementation
        // @todo
    }

    /**
     * Loads the mrr graphs
     * @param {'paid'|'free'|'total'} status filter by status
     */
    loadLastSeen(status) {
        if (this.dashboardMocks.enabled) {
            if (status === 'paid') {
                // @todo
            }
            this.membersLastSeen30d = this.dashboardMocks.membersLastSeen30d;
            this.membersLastSeen7d = this.dashboardMocks.membersLastSeen7d;
            return;
        }
        // Normal implementation
        // @todo
    }

    loadPaidMembersByCadence() {
        if (this.dashboardMocks.enabled) {
            this.paidMembersByCadence = this.dashboardMocks.paidMembersByCadence;
            return;
        }
        // Normal implementation
        // @todo
    }

    loadPaidMembersByTier() {
        if (this.dashboardMocks.enabled) {
            this.paidMembersByTier = this.dashboardMocks.paidMembersByTier;
            return;
        }
        // Normal implementation
        // @todo
    }

    loadNewsletterSubscribers() {
        if (this.dashboardMocks.enabled) {
            this.newsletterSubscribers = this.dashboardMocks.newsletterSubscribers;
            return;
        }
        // Normal implementation
        // @todo
    }

    loadEmailsSent() {
        if (this.dashboardMocks.enabled) {
            this.emailsSent30d = this.dashboardMocks.emailsSent30d;
            return;
        }
        // Normal implementation
        // @todo
    }

    loadEmailOpenRateStats() {
        if (this.dashboardMocks.enabled) {
            this.emailOpenRateStats = this.dashboardMocks.emailOpenRateStats;
            return;
        }
        // Normal implementation
        // @todo
    }

    /**
     * For now this is only used when reloading all the graphs after changing the mocked data
     * @todo: reload only data that we loaded earlier
     * @param {number} days Amount of days to load data for (used for member related graphs)
     */
    reloadAll(days) {
        this.loadMembersCounts();
        this.loadMrrStats(days);
        this.loadMemberCountStats(days);
        this.loadLastSeen('paid');
        this.loadPaidMembersByCadence();
        this.loadPaidMembersByTier();

        this.loadNewsletterSubscribers();
        this.loadEmailsSent();
        this.loadEmailOpenRateStats();
    }

    /**
     * Fill data to match a given amount of days
     * @param {MemberCountStat[]|MrrStat[]} data
     * @param {MemberCountStat|MrrStat} defaultData
     * @param {number} days Amount of days to fill the graph with
     */
    fillMissingDates(data, defaultData, days) {
        let currentRangeDate = moment().subtract(days, 'days');

        let endDate = moment().add(1, 'hour');
        const output = [];
        const firstDateInRangeIndex = data.findIndex((val) => {
            return moment(val.date).isAfter(currentRangeDate);
        });
        let initialDateInRangeVal = firstDateInRangeIndex > 0 ? data[firstDateInRangeIndex - 1] : null;
        if (firstDateInRangeIndex === 0 && !initialDateInRangeVal) {
            initialDateInRangeVal = data[firstDateInRangeIndex];
        }
        if (data.length > 0 && !initialDateInRangeVal && firstDateInRangeIndex !== 0) {
            initialDateInRangeVal = data[data.length - 1];
        }

        let lastVal = initialDateInRangeVal ? initialDateInRangeVal : defaultData;

        while (currentRangeDate.isBefore(endDate)) {
            let dateStr = currentRangeDate.format('YYYY-MM-DD');
            const dataOnDate = data.find(d => d.date === dateStr);
            lastVal = dataOnDate ? dataOnDate : lastVal;
            lastVal.date = dateStr;
            output.push(lastVal);
            currentRangeDate = currentRangeDate.add(1, 'day');
        }
        return output;
    }
}
