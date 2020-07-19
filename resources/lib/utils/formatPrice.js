export default function formatPrice(amount, prefix = '€') {
    if(isNaN(+amount)) {
        throw new Error(`${amount} is NaN.`);
    }

    if(parseInt(amount, 10) == amount) {
        return `${prefix}${amount},-`;
    }

    return `${prefix}${parseFloat(amount).toFixed(2)}`;
}
