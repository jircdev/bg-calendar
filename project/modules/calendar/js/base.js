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
