/**
 * Beyond event emitter
 *
 * @param specs {object=} The events specification
 *      .supported {Array} The list of supported events
 *      .bind {object} The object where to set the bind and unbind methods
 * @constructor
 */

export function Events(specs) {
    'use strict';

    specs = specs ? specs : {};

    if (specs.supported && !(specs.supported instanceof Array)) throw new Error('Invalid parameters');

    const listeners = new Map();

    /**
     * Binds an event handler to an event name
     *
     * @param event
     * @param listener
     * @param priority
     * @returns {Window.Events}
     */
    this.on = function (event, listener, priority) {

        if (specs.supported && !specs.supported.includes(event)) {
            throw new Error(`Event "${event}" is not defined`);
        }
        if (typeof listener !== 'function') {
            throw new Error('Listener is not a function');
        }

        this.off(event, listener); // Just in case the listener is already registered

        const l = listeners.has(event) ? listeners.get(event) : [];
        listeners.set(event, l);
        l.push({'listener': listener, 'priority': priority ? priority : 0});

        return this;

    };
    this.bind = (e, l, p) => this.on(e, l, p);

    /**
     * Unbind an event listener
     *
     * @param event {string} The event name
     * @param listener {function} The listener function
     * @param force {boolean=} Force to remove all listeners when listener is not set
     * @returns {Window.Events}
     */
    this.off = function (event, listener, force) {

        if (!event) {
            throw new Error(`Event name not specified`);
        }
        if (specs.supported && !specs.supported.includes(event)) {
            throw new Error(`Event "${event}" is not defined`);
        }

        if (!listener) {
            if (!force) throw new Error('Listener function not set');
            listeners.delete(event);
            return this;
        }

        if (!listeners.has(event)) return this;

        const filtered = listeners.get(event).filter(item => item.listener !== listener);
        listeners.set(event, filtered);

        return this;

    };
    this.unbind = (e, l, f) => this.off(e, l, f);

    /**
     * Triggers an event
     * @param event {string} The event name
     * @returns {*}
     */
    this.trigger = function (event) {

        event = typeof event === 'string' ? {'name': event} : event;
        if (typeof event !== 'object') throw new Error('Invalid parameters');
        if (typeof event.name !== 'string') throw new Error('Invalid event name');

        if (specs.supported && !specs.supported.includes(event.name)) {
            throw new Error(`Event "${event.name}" is not defined`);
        }

        let args = [...arguments];
        args.shift(); // Remove the event name from the list of arguments

        if (!listeners.has(event.name)) return;

        let l = listeners.get(event.name);

        // Sort by priority
        l.sort((a, b) => b.priority - a.priority);

        if (event.async) {

            const trigger = async function () {

                const promises = [];
                for (let listener of l) {
                    promises.push(listener.listener(...args));
                }

                await Promise.all(promises);

            };

            return trigger.call(this, ...args).catch(exc => console.error(exc.stack));

        }
        else {
            for (let listener of l) {
                listener.listener(...args);
            }
        }

    };

    if (specs.bind) {
        specs.bind.bind = (event, listener) => this.on(event, listener);
        specs.bind.unbind = (event, listener) => this.off(event, listener);
    }

};
