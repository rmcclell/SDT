Ext.define('SDT.util.DateUtils', {
    requires: ['SDT.util.GLOBALS'],
    singleton: true,
    /*******************************************************************************************************************************
    * convertGridDate
    *
    * Converts dates used in grids to the format specified in US74393:
    *   yyyy-mm-dd hh:mm GMT
    *
    * Usage:
    *   From a field in the target which displays date data, specify the following:
    *
    *   {
    *       name: 'yourFieldName',  // Replace 'yourFieldName' with the actual field name
    *       type: 'date',
    *       dateFormat: 'c',
    *       renderer: function (value, e, record) {
    *           return SDT.util.DateUtils.convertGridDate(value);
    *       }
    *   }
    *
    * If argument 'v' is not passed, no conversion will occur, and the method will fail *silently*. The initial version of this method
    * attempted to log errors, but argument 'v' fails to get passed whenever a field instantiates without an initial value, which
    * resulted in an unacceptable flood of the console.
    *
    * CH - 02.28.2013
    *
    */
    convertGridDate: function (v) {
        var theDateFormat = SDT.util.GLOBALS.DISPLAY_FORMATS.date;
        if (v) {
            if (Ext.isDate(v)) {                                        // IF Date already comes across PARSED
                k1 = v.getTimezoneOffset() * 60000 + Date.parse(v);     // Brings everything to EPOCH  - k and he offset cause from line above
                v7 = new Date(k1);                                      // Creates a Date object from the EPOCH
                v = Ext.Date.format(v7, theDateFormat+' H:i') + ' GMT';
            } else {
                k = Ext.Date.parse(v, 'c');                             // Variable 'k' contains the converted date in complete format in LOCAL Time.
                if (Ext.isDate(k)) {
                    k1 = k.getTimezoneOffset() * 60000 + Date.parse(k); // Brings everything to EPOCH  - k and he offset cause from line above
                    v7 = new Date(k1);                                  // Creates a Date object from the EPOCH
                    v = Ext.Date.format(v7, theDateFormat+' H:i') + ' GMT';
                }
            }
            return v;
        }
    },
    removeTimestamp: function (v) {
        var theDateFormat = SDT.util.GLOBALS.DISPLAY_FORMATS.date;
        if (v) {
            if (!Ext.isDate(v)) {
                return v.substring(0, v.indexOf(' '));
            } else {
                return Ext.Date.format(v, theDateFormat);
            }
        }
    },
    convertUtcDate: function (utcDate) {
        if (Ext.isString(utcDate)) {
            var isodate = utcDate.replace('T', ' ').replace('Z', '');
            return Ext.Date.parse(isodate, 'Y-m-d H:i:s');
        } else {
            return this.getUTCDate();
        }
    },
    getUTCDate: function () {
        var currentDate = new Date(),
        utcDate = new Date(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            currentDate.getUTCHours(),
            currentDate.getUTCMinutes(),
            currentDate.getUTCSeconds()
        );
        return utcDate;
    },

    /*
    * Convert a string date to ISO8601 string format
    * This function is only here to support IE8.
    * Once we don't have to support IE8, .toISOString() can be used instead. 
    */
    getISO8601DateStringFromStringDate: function (dateString) {
        if (Ext.isDate(dateString)) {
            var parsedDate = dateString.getTimezoneOffset() * 60000 + Date.parse(dateString);
            var newDate = new Date(parsedDate);
            return this.getISO8601DateStringFromDate(newDate);
        }
        return 'Unable to parse string value.';
    },

    /*
    * Convert Date to ISO8601 string format.
    * If Date is not specified, use new Date().
    */
    getISO8601DateStringFromDate: function (date) {
        // Format integers to have at least two digits.
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        if (!date) {
            date = new Date();
        }
		//TODO Change to Ext.String.format for cleanner implementation
        return date.getUTCFullYear() +
			'-' +
			pad(date.getUTCMonth() + 1) +
			'-' +
			pad(date.getUTCDate()) +
			'T' +
			pad(date.getUTCHours()) +
			':' + pad(date.getUTCMinutes()) +
			':' + pad(date.getUTCSeconds()) +
			'Z';
    }
});