function BaseCalendar(parent, specs) {

    let DEFAULT_SPECS = {
        view: 'WEEK',
        format: 'YYYY-MM-DD'
    };

    specs = Object.assign(DEFAULT_SPECS, specs);

    let {year, month, date, view} = specs;

    let current = dayjs(date);

    this.actualDate = dayjs(new Date());

    if (!year) year = current.year();
    if (!month) month = current.month();

    this.month = month;
    this.year = year;
    this.date = date;

    const events = new Events({bind: parent});
    const triggerEvent = (event = 'change') => events.trigger(event);
    this.triggerEvent = triggerEvent;
    Object.defineProperty(parent, 'format', {get: () => specs.format});
    Object.defineProperty(parent, 'currentDate', {get: () => current});
    let day = current.date();

    Object.defineProperty(parent, 'day', {'get': () => day});
    // this variables is used by week object.
    //TODO: optimize.
    this.activeDay = day;
    this.activeMonth = month;
    this.activeWeek = undefined;
    this.activeYear = year;
    Object.defineProperty(this, 'current', {get: () => current});

    const VIEWS = Object.freeze({
        MONTH: 'MONTH',
        WEEK: 'WEEK',
        YEAR: 'YEAR',
        DAY: 'DAY',
        YEARS: 'YEARS'
    });

    this.VIEWS = VIEWS;

    Object.defineProperty(parent, 'view', {'get': () => view});
    Object.defineProperty(this, 'view', {
        get: () => view,
        set: (value) => {
            if (view === value || !VIEWS.hasOwnProperty(view)) return;
            view = value;
            triggerEvent();
        }
    });

    if (date instanceof Date && !isNaN(date.valueOf())) {
        current = new Date();
    }

    let months, weeks;
    let years = new Years(parent, this, year);
    this.years = years;

    Object.defineProperty(parent, 'months', {get: () => years.active?.months});
    Object.defineProperty(parent, 'month', {get: () => years.active?.months?.active});
    Object.defineProperty(parent, 'year', {get: () => year});
    Object.defineProperty(parent, 'actualMonth', {get: () => month + 1});
    Object.defineProperty(parent, 'actualDate', {
        get: () => {
            return `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${day < 10 ? `0${day}` : day}`;
        }
    });

    this.initialise = () => {
        years.initialise();
        months = years.active.months;
        triggerEvent('calendar.initialised');
    };

}

/*****************
 base\properties.js
 *****************/

function CalendarProperties(parent) {

    Object.defineProperty(parent, 'year', {'get': () => year});
    const VIEWS = Object.freeze({
        'MONTH': 'MONTH',
        'WEEK': 'WEEK',
        'YEAR': 'YEAR',
        'DAY': 'DAY',
        'YEARS': 'YEARS'
    });

    let view = VIEWS.MONTH;
    Object.defineProperty(parent, 'view', {
        'get': () => view,
        'set': (value) => {
            if (view === value || !VIEWS.hasOwnProperty(view)) return;
            view = value;
            triggerEvent();
        }
    });

}

/**********
 calendar.js
 **********/

export function BGCalendar(specs = {}) {

    const m1 = 'jc1';
    const m2 = 'jc2';
    const m3 = 'jc3';
    performance.mark(m1);
    // console.trace("instanciamos calendario...", specs)
    specs = (typeof specs === 'string') ? {date: specs} : specs;

    const base = new BaseCalendar(this, specs);

    let ready;
    Object.defineProperty(this, 'ready', {get: () => ready});

    Object.defineProperty(this, 'locale', {get: () => 'es-ES'});

    let dayjs;
    Object.defineProperty(this, 'dayjs', {get: () => dayjs});

    Object.defineProperty(this, 'daysNames', {get: () => Week.getDays()});
    window.c = this;

    let initialised;
    const initialise = async () => {

        if (initialised) return ready;
        base.initialise();
        initialised = true;
        ready = true;
        performance.mark(m2);
        performance.measure('calendar load', m1, m2)
        base.triggerEvent('change');
        //TODO: remove loaded event if isn't used
        base.triggerEvent('loaded');
        base.triggerEvent('ready');

        return ready;

    };
    this.init = initialise;

    initialise();

    this.setView = newView => {
        if (!base.VIEWS.hasOwnProperty(newView)) return;
        base.view = base.VIEWS[newView];
        base.triggerEvent('change');
    };

    new CalendarManager(this, base);

}

/*****
 day.js
 *****/

/**
 *
 * @param {JidaCalendar} calendar
 * @param {Month} month
 * @param {Week} week the week that contains the day
 * @param {dayjs} date The dayjs object with current day set
 * @param index
 * @constructor
 */
function Day(calendar, month, week, date, index) {

    Object.defineProperty(this, 'index', {get: () => index});
    const id = `${month.date.year()}.${month.date.month()}.${week.index}.${index}`;
    Object.defineProperty(this, 'id', {get: () => id});
    Object.defineProperty(this, 'week', {get: () => week});
    Object.defineProperty(this, 'month', {get: () => month});

    //TODO revisar los valores de las propiedades day y date estan retornando el mismo valor
    Object.defineProperty(this, 'day', {get: () => date.date()});
    Object.defineProperty(this, 'date', {get: () => date.format(calendar.format)});

    Object.defineProperty(this, 'object', {get: () => date});

    Object.defineProperty(this, 'name', {
        get: () => date.toDate().toLocaleString('es-ES', {weekday: 'long'})
    });
    Object.defineProperty(this, 'shortName', {
        get: () => date.toDate().toLocaleString('es-ES', {weekday: 'short'})
    });

    Object.defineProperty(this, 'dayjs', {get: () => date});

}

/*********
 factory.js
 *********/

const calendars = new Map();

export function calendarFactory(specs) {

    specs = (typeof specs === 'string') ? {date: specs} : specs;
    let DEFAULT_SPECS = {
        view: 'WEEK',
        format: 'YYYY-MM-DD'
    };

    specs = Object.assign(DEFAULT_SPECS, specs);
    let {year, month, date, view} = specs;
    if (calendars.has(date)) {
        return calendars.get(date);
    }
    const calendar = new JidaCalendar(specs);
    calendars.set(date, calendar);
    return calendar;

}

/*********
 manager.js
 *********/

function CalendarManager(parent, base) {

    parent.changeWeek = (action) => {
        const month = parent.month;
        const totalWeeks = month.weeks.items.size;
        const activeIndex = month.weeks.active.index;
        const anotherMonth = action === 'prev' && activeIndex === 1 || action === 'next' && activeIndex >= totalWeeks;
        if (anotherMonth) {
            parent.changeMonth(action);
            return;
        }

        action === 'next' ? month.weeks.next() : month.weeks.prev();

    };

    const changeMonth = action => {

        const {active} = parent.months;
        const newactive = action === 'next' ? active.index + 1 : active.index - 1;

        if (newactive < 0) {
            base.activeDay = 31;
            base.activeMonth = 11;
            parent.previousYear();
            return;
        }

        if (newactive > 11) {
            base.activeDay = 1;
            base.activeMonth = 0;
            parent.nextYear();
            return;
        }

        parent.months[action]();
    };

    parent.changeMonth = changeMonth;
    parent.nextMonth = () => changeMonth('next');
    parent.previousMonth = () => changeMonth('prev');
    parent.nextWeek = () => parent.changeWeek('next');
    parent.previousWeek = () => parent.changeWeek('prev');
    parent.previousYear = () => base.years.prev();
    parent.nextYear = () => base.years.next();
    parent.activeWeek = () => {
        const year = base.years.active;
        return year.months.active.weeks.active;

    }

    parent.goTo = date => {
        base.years.goTo(dayjs(date));
    }
    this.getMonth = (day) => {
        const date = dayjs(day);
        if (!date.isValid()) throw Error('the argument day is not a valid date', day);
        return new Month(this, date.getMonth(), true);

    }
}

/**************
 months\month.js
 **************/

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

/***************
 months\months.js
 ***************/

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

/************
 weeks\week.js
 ************/

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
        firstDay = firstDay.subtract(firstDay.day(), 'd');

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

/*************
 weeks\weeks.js
 *************/

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

/************
 years\year.js
 ************/

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

/*************
 years\years.js
 *************/

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




