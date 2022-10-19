/**
 *
 * @param year
 * @param {JidaCalendar} calendar
 * @param {BaseCalendar} base
 * @param {int} index The number of the month
 * @param {boolean} active indicates if the month is the current or active month
 * @constructor
 */
function Month(year, calendar, base, index, active) {

    Object.defineProperty(this, 'index', {get: () => index});

    Object.defineProperty(this, 'current', {get: () => active});
    Object.defineProperty(this, 'active', {get: () => active});

    const date = dayjs(new Date(year, index));
    /**
     * @property {dayjs} Month.date The dayjs object of the month
     */
    Object.defineProperty(this, 'date', {get: () => date});

    // the total days in the month
    const days = 32 - new Date(year, index, 32).getDate();

    Object.defineProperty(this, 'firstDate', {get: () => date.startOf('month').format(calendar.format)});
    Object.defineProperty(this, 'lastDate', {get: () => date.endOf('month').format(calendar.format)});
    const weeks = new Weeks(calendar, base, this);

    Object.defineProperty(this, 'weeks', {get: () => weeks});
    Object.defineProperty(this, 'name', {
        get: () => date.toDate().toLocaleString(calendar.locale, {'month': 'long'})

    });
    Object.defineProperty(this, 'shortName', {
        get: () => date.toDate().toLocaleString(calendar.locale, {'month': 'short'})

    });

    this.changeWeek = action => {
        const total = weeks.length;
    };

    this.toggleActive = () => active = !active;
}

