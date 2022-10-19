/**
 *
 * @param {JidaCalendar} calendar
 * @param {BaseCalendar} base
 * @param {Month} month The month that contains the week
 * @param {dayjs} firstDay  Represents the first day of the week. When is the first week of the month, represents
 * the first day of the month and allow to calculate which is the first day in that week.
 * @param index Number of the week in month
 *
 * @constructor
 */
function Week(calendar, base, month, firstDay, index) {

    //TODO: add support to locale language
    Object.defineProperty(this, 'index', {get: () => index})
    const defaultStart = 0;

    Object.defineProperty(this, 'month', {get: () => month});
    let active = false;

    /**
     * indicates if the week is active and showed
     * @type {boolean}
     */
    Object.defineProperty(this, 'active', {get: () => active});

    /**
     * mark the difference between the first day of the week and the first day of the month
     * @type {number}
     * TODO: check if is necessary
     */
    let startDifference = firstDay.day() - defaultStart;

    let difference = 0;
    if (firstDay.day() > 0) {
        firstDay =  firstDay.subtract(firstDay.day(), 'd');

    }
    this.firstDate = firstDay;
    this.lastDate = firstDay.add(7, 'd');


    const key = `${firstDay.format('YYYYMMDD')}.${this.lastDate.format('YYYYMMDD')}`;
    Object.defineProperty(this, 'identifier', {get: () => key});

    const dates = new Map();
    Object.defineProperty(this, 'dates', {get: () => dates});
    const days = new Map();
    Object.defineProperty(this, 'days', {get: () => days});

    const firstWeekDay = firstDay;

    for (let i = defaultStart; i < 7; ++i) {

        let current = firstWeekDay;

        current = current.add(difference, 'day')
        difference++;

        days.set(i, current);

        //TODO: check validation
        if (base.activeMonth === current.month() && current.date() === base.activeDay) {

            /**
             * is the current day
             */
            active = true;
        }

        const day = new Day(calendar, month, this, current, i);
        new Intl.DateTimeFormat('en');
        days.set(i, day);

    }

    this.toggleActive = () => active = !active;

}

Week.getDays = function () {

    const days = {
        Mon: new Date('2020-01-06'),
        Tue: new Date('2020-01-07'),
        Wed: new Date('2020-01-08'),
        Thu: new Date('2020-01-09'),
        Fri: new Date('2020-01-10'),
        Sat: new Date('2020-01-11'),
        Sun: new Date('2020-01-12')
    };

    const config = {
        locale: 'es-ES'
    };

    const shortWeekdays = Object.keys(days);

    const getDayOfWeek = (shortName, locale = config.locale, length = 'short') =>
        new Intl.DateTimeFormat(locale, {weekday: length}).format(days[shortName]);

    const shortNames = shortWeekdays.map(shortName => getDayOfWeek(shortName));
    const longNames = shortWeekdays.map(shortName => getDayOfWeek(shortName, config.locale, 'long'));
    return shortNames;

}
