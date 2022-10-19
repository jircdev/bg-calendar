/**
 * Calendar months manager
 *
 * @param {int} year Year of the months to instance
 * @param {BaseCalendar} base
 * @param {JidaCalendar} calendar
 * @param {int} activeIndex The index of the active month.
 * @constructor
 */
function Months(year, calendar, base, activeIndex) {

    function getMonthsForLocale(locale = 'ES') {

        const months = []

        for (let month = 0; month < 12; month++) {
            const testDate = new Date(2000, month, 1, 0, 0, 0);
            months.push(testDate.toLocaleString(locale, {'month': 'long'}))
        }

        return months;

    }

    //TODO: add support locale language configure
    const months = getMonthsForLocale();

    Object.defineProperty(this, 'index', {'get': () => activeIndex});
    const items = new Map();
    Object.defineProperty(this, 'items', {'get': () => items});
    let active;
    Object.defineProperty(this, 'active', {'get': () => active});

    const changeActive = (action) => {

        action === 'prev' ? activeIndex-- : activeIndex++;
        if (active) active.toggleActive();
        if (!items.has(activeIndex)) {
            throw Error(`The request month does not exist: ${activeIndex}`);
        }
        active = items.get(activeIndex);
        active.toggleActive();
        active.weeks.goTo(action === 'prev' ? active.weeks.items.size - 1 : 1);
        base.triggerEvent('change')
        base.triggerEvent('month.changed');

    };

    this.next = () => changeActive('next');
    this.prev = () => changeActive('prev');
    this.goTo = (index, week = 'first') => {

        if (active) active.toggleActive();

        if (!items.has(index)) {
            throw Error(`The request month does not exist: ${index}`);
        }

        active = items.get(index);
        active.toggleActive();
        /**
         * the keys of the week items start in 1 and are autonumeric, so
         * the last item is equal to the size of the map
         * @type {number|*}
         */
        let weekToGo = week === 'first' ? 1 : active.weeks.items.size;
        active.weeks.goTo(weekToGo);

    }
    /**
     * TODO: @julio Validar si se puede usar el metodo goTo, hay un comportamiento extranio con
     * la variable weekToGo que por tiempo para este momento no pudo validarse.
     *
     *
     * @param index
     */
    this.goToNumber = (index, weekNumber) => {
        if (active) active.toggleActive();

        if (!items.has(index)) {
            throw Error(`The request month does not exist: ${index}`);
        }

        active = items.get(index);
        active.toggleActive();
        active.weeks.goTo(weekNumber);
    }
    this.initialise = () => {

        for (let i = 0; i < months.length; ++i) {

            const month = new Month(year, calendar, base, i, activeIndex === i);

            if (i === activeIndex) active = month;

            items.set(i, month);
        }

    };

}
