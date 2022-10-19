/**
 *
 * @param {JidaCalendar} calendar The Calendar Object
 * @param {int} current indice of the current year
 * @constructor
 */
function Years(calendar, base, current) {

    Object.defineProperty(this, 'index', {'get': () => current});
    const items = new Map();
    Object.defineProperty(this, 'items', {'get': () => items});
    let active;
    Object.defineProperty(this, 'active', {'get': () => active});

    /**
     * The current year
     */
    Object.defineProperty(this, 'current', {get: () => current});
    /**
     * The active year in the calendar by default is the same that the year where the calendar is initialised
     */
    let activeIndex = current;
    Object.defineProperty(this, 'activeIndex', {get: () => activeIndex});

    const changeActive = (action) => {

        action === 'prev' ? activeIndex-- : activeIndex++;

        base.month = action === 'prev' ? 11 : 0;

        if (!items.has(activeIndex)) {
            createYear(activeIndex, base.month);
        }

        const week = action === 'prev' ? 'last' : 'first';
        active = items.get(activeIndex);
        active.months.goTo(base.month, week);

        base.triggerEvent('change')
        base.triggerEvent('year.changed');

    };

    this.next = () => changeActive('next');
    this.prev = () => changeActive('prev');

    const createYear = (index, month = 0) => {
        // TODO: the month could be selected in a future view.
        // make support to it.
        const year = new Year(calendar, base, index, month, true)
        items.set(index, year);
        return year;
    };

    this.goTo = (day) => {
        if (!items.has(day.year())) createYear(day.year(), day.month());
        const year = items.get(day.year());
        const week = year.months.active.weeks.getWeek(day.date());
        /**
         * TODO: @julio check goToNumber function
         */

        year.months.goToNumber(day.month(), week.index);
        base.triggerEvent();
    };

    this.initialise = () => {
        createYear(current, base.month);
        active = items.get(current);
    };

}
