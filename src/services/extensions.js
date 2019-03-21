Date.prototype.toHtml = function(){
    return this.toISOString().match(/\d{4}(-\d{2}){2}/)[0]
}

/**
 * not immutable
 * @param days
 * @returns {Date}
 */
Date.prototype.addDays = function(days){
    this.setDate(this.getDate() + days)
    return this
}