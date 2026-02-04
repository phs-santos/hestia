const extractInfo = (url: string) => {
    const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const match = url.match(regex);
    if (match) {
        const [, user, password, host, port, database] = match;
        return { user, password, host, port, database };
    }
    return null;
};

export { extractInfo };