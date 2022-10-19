export function Page() {

    // const calendar = new JidaCalendar();

    ReactDOM.render(React.createElement(View, {
        'texts': module.texts,
        'currency': this.vdir
    }), this.container);

    this.container.id = 'jida-calendar-page';
    this.container.classList.add('page');

}