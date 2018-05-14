
export function isSp(): boolean {
    let ua = navigator.userAgent
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        return true
    } else {
        return false
    }
}
