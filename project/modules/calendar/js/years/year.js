/**
 * m
 * @param {JidaCalendar} calendar
 * @param {BaseCalendar} base
 * @param {number} year Index of the month
 * @param {boolean} active
 * @constructor
 */
function Year(calendar, base, year, month, active) {

    Object.defineProperty(this, 'index', {get: () => year});

    Object.defineProperty(this, 'current', {get: () => active});
    Object.defineProperty(this, 'active', {get: () => active});

    const date = dayjs(new Date(year, 1));
    /**
     * @property {dayjs} year The dayjs object of the month
     */
    Object.defineProperty(this, 'date', {get: () => date});

    let months = new Months(year, calendar, base, month);
    months.initialise();
    Object.defineProperty(this, 'months', {get: () => months});

}

