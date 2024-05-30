/**
    Calculate ration between two pairs and display the UI reference and provide rations.
    @param {number} _srcAmount      - Source token amount (in token)
    @param {number} _dstQuote       - Destination token quotation (in token)
*/
function ratio(_srcAmount, _dstQuote) {
    let ratio = _dstQuote / _srcAmount
    let revRatio = _srcAmount / _dstQuote
    return {
        ratioSrcOnDst: ratio,
        ratioDstOnSrc: revRatio
    }
}

/**
    Convert limit order input to the corrisponding ratio.
    @param {boolean} _srcONdst      - Input limit order type (True: Destination value, False: Source value)
    @param {number} _limitOrderVal  - Limit order value
    @param {number} _srcAmount      - Source token amount (in token)
    @param {number} _dstQuote       - Destination token quotation (in token)
*/
function conversion(_srcONdst, _limitOrderVal, _srcAmount, _dstQuote) {
    return _srcONdst ? ((_dstQuote / _limitOrderVal) / _dstQuote) : ((_srcAmount / _limitOrderVal) / _srcAmount)
}

/**
    Convert limit order input to have always the ratio of 1 SRC = X DST.
    @param {boolean} _srcONdst      - Input limit order type (True: Destination value, False: Source value)
    @param {number} _limitOrderVal  - Limit order value
    @param {number} _srcAmount      - Source token amount (in token)

    @return Ration between the pair
*/
function conversionNeon(_srcONdst, _limitOrderVal, _srcAmount) {
    return _srcONdst ? _limitOrderVal : ((_srcAmount / _limitOrderVal) / _srcAmount)
}

/**
    Verify if the limit order is compliant with the quotation.
    @param {number} _limitOrderVal  - Limit order value
    @param {number} _srcAmount      - Source token amount (in token)
    @param {number} _dstQuote       - Destination token quotation (in token)
 */
function check(_limitOrderVal, _srcAmount, _dstQuote){
    let ratio = _srcAmount / _dstQuote;
    return {ratioLimit: _limitOrderVal, ratioSwap: ratio, canSwap: _limitOrderVal >= ratio}
}


const limitOrder = {
    ratio,
    conversion,
    conversionNeon,
    check
}

export default limitOrder