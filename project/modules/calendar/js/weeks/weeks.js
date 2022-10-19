/**
 *
 * @param {JidaCalendar} parent. The Calendar Object
 * @param {Month} month. The month container of the weeks
 * @constructor
 */
function Weeks(calendar, base, month) {

    const dateMonth = month.date;
    let configured;

    // the number of the day of the week that the month start
    let weekDay = month.date;
    let current, active;
    Object.defineProperty(this, 'current', {'get': () => current});
    Object.defineProperty(this, 'active', {'get': () => active});

    const items = new Map();
    this.items = items;

    let i = 1;

    while (!configured) {

        const week = new Week(calendar, base, month, weekDay, i);

        if (week.active) {
            active = week;
            current = week;
        }

        weekDay = week.lastDate;
        items.set(i, week);
        if (i > 6 || weekDay.month() !== month.date.month()) configured = true;
        i++;

    }

    const changeCurrent = (index) => {

        if (active) active.toggleActive();
        active = items.get(index);

        if (!active) {
            throw  Error(`the week with index ${index} could not be found`);
        }

        active.toggleActive();
        base.triggerEvent('week.changed');

    }

    this.prev = () => changeCurrent(active.index - 1);

    this.next = () => changeCurrent(active.index + 1);
    this.goTo = index => changeCurrent(index);

    this.getWeek = day => {

        let found = undefined;
        const actualMonth = month.index;
        this.items.forEach((item, index) => {
            const {firstDate, lastDate} = item;

            const firstMonth = firstDate.month();
            const lastMonth = lastDate.month();
            const sameFirstMonth = firstMonth === actualMonth;
            const sameLastMonth = lastMonth === actualMonth;
            const firstDay = firstDate.date();
            const lastDay = lastDate.date();

            let inFirstDay = (sameFirstMonth && day >= firstDay || !sameFirstMonth && day <= firstDay);
            let inLastDay = (sameLastMonth && day <= lastDay || !sameLastMonth && day >= lastDay);
            if (inFirstDay && inLastDay) found = item;
        });

        return found;
    }
}
