var dateObj = function() {
    self = this;
    self.start_field = '';
    self.end_field = '';
    self.colArray = [{data:'idHeader'},{data:'element'},{data:'type'},{data:'account'}];
    self.colHeaders = ['idHeader','element','type','account'];
    
    self.getWeeks = function() {
        // Setup generating week dates based on start and finish  
        //should populate colHeaders and colArray that will be used often in the program
        //colArray.push({data: key});
        //colHeaders.push(key);
        var dStart = new Date(self.start_field);
        var tStart = new Date('03/24/2014');
        console.log(tStart);
        dStart = self.roundDOW(dStart, 'down');
       
        var dEnd = new Date(self.end_field);
         console.log(dEnd);
        dEnd = self.roundDOW(dEnd, 'up');
        var ONE_DAY = 1000 * 60 * 60 * 24
        var dateDiff = (dEnd - dStart) / ONE_DAY;
        console.log(dStart);
        console.log(dEnd);
        console.log(dateDiff);
        
    };
    self.getFinanceData = function() {
        //ajax call for data based on weeks
        //One call will ask for a collection and get obj {element:Forecast, type:FixedExpense, account:Mortgage, _id:yyy}
        //Other call will use each of the results from the above call and the start and end dates
            //{date:2014-03-24, value:1240.32, idHeader:yyy, _id:xxx}
        //Final output {element:Forecast, type:FixedExpense, account:Mortgage, idHeader:yyy, 2014-03-24:1240.32}
        console.log('Hello');
    };
    self.generateFTable = function() {
        self.start_field = $('#start_field')[0].value, self.end_field = $('#end_field')[0].value;
        self.getWeeks();
        
        //createTable(tableData, colHeaders, colArray)
    };
    self.roundDOW = function(dateObj, rdType) {
      //round up the days submitted to be a start or end of week
        var dow = dateObj.getDay()
        switch (rdType) {
                case 'up':
                    if (dow < 6) {
                        dateObj.setDate(dateObj.getDate() + (8 - dow));     
                        return dateObj;
                    } else {
                        dateObj.setDate(dateObj.getDate() + 2);
                        return dateObj;   
                    };
                    break;
                case 'down':
                    if (dow > 0) {
                         dateObj.setDate(dateObj.getDate() - dow + 1); 
                        return dateObj;
                    } else {
                        return dateObj;   
                    };
                    break;
                default:
                    return dateObj;
        };
    };
}