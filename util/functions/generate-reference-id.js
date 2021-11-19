export default (hostname) => {
    let prefix = hostname?.split?.('.')?.join('-') || 'la-engine'
    return (prefix + '-' + (new Date()).getTime())
}