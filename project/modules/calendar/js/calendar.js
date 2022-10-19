export function JidaCalendar(specs = {}) {

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
