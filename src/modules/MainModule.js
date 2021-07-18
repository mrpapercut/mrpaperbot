class MainModule {
    constructor(props) {
        this.props = props;
    }

    // Override this function
    handleMessage(message) {
        message.channel.send('Missing handleMessage');
    }
}

export default MainModule;
