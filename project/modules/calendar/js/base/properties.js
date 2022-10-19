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