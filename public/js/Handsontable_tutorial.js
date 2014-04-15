var hTableContainer = $('#example1');
function getMyForm(formName, callback) {
    $.get("/form/get/" + formName, function (dataOutput) {
        //var dataOutputObject = JSON.parse(dataOutput);
        var dataOutputObject = dataOutput;;
        var tableData = dataOutputObject.resultArray, colArray = [], colHeaders = [], key;
        if (tableData.length >= 1) {
          //****ToDo Need a better way to make sure all columns are accounted for not just ones in the first record
            for (key in tableData[0]) {
                colArray.push({data: key});
                colHeaders.push(key);
            }
    }
    callback(tableData, colHeaders, colArray);
    setupEvent(formName);
  });
  
}
function updateTable (collName) {
    $.get( "/form/get/" + collName, function( dataOutput ) {
        //var dataOutputObject = JSON.parse(dataOutput);
        var dataOutputObject = dataOutput;
        var tableData = dataOutputObject.resultArray
        var ht = hTableContainer.handsontable('getInstance');
        ht.loadData(tableData);
    });
}
function createTable(tableData, colHeaders, colArray) {
  hTableContainer.handsontable({
      data: tableData,
      colHeaders: colHeaders,
      columns: colArray,
      contextMenu: true,
      autoWrapRow: true,
      currentRowClassName: 'currentRow',
      currentColClassName: 'currentCol',
      afterChange: function (change, source) {
        if (source === 'loaddata') {
          return;
        }
        if (change && change.length === 1) {
          chgRowData = ht.getDataAtRow(change[0][0]);
            exist = objValueExists(ht.chgsArray, chgRowData, "_id")
          if (exist >= 0) {
            removed = ht.chgsArray.splice(exist,1);
          }
          ht.chgsArray.push(chgRowData);
        }
      },
      afterCreateRow: function(i, amt) {
        var ht = hTableContainer.handsontable('getInstance');
        var rowData = ht.getDataAtRow(i);
        rowData._id = "NEW"+i;
      },
      beforeRemoveRow: function(i, amt) {
        var collName = $('#formID').text();
        var rmRowData = ht.getDataAtRow(i);
        //**In future maybe have where you can delete multiple rows
        //**Also check if new row being deleted before sending to server
         var json_send = {cName: collName, iDetails:rmRowData};
         $.ajax("/form/removeline", {
              data: JSON.stringify(json_send),
              type: "post", contentType: "application/json",
              success: function(result) {
                console.log(result)
              }
          });
      }
    });
    var ht = hTableContainer.handsontable('getInstance');
    ht.chgsArray = [];
    hTableContainer.handsontable('selectCell', 1, 1);
}

function objValueExists(obj, obj2, objSearchProp) {
  //obj = [{_id:12345,someother:67890}, {...}, ...], obj2 = {_id:12345, some: 67890}, objSearchProp=_id
  for (i=0, i_len = obj.length; i < i_len; i++) {
    if (obj[i][objSearchProp] && obj[i][objSearchProp] === obj2[objSearchProp]) {
      return i;
    }
  }
  //Did not find any matches
  return -1;
}

function setupEvent(cName) {
  //var example = $("#example1");
  var cN = cName;
  var callbackUpdate = updateItems(cN)
  
  function updateItems(collectionName){
    var collName = collectionName;
    return function() {
      var HOT = hTableContainer.handsontable('getInstance');
       var json_send = {cName: collName, iDetails:HOT.chgsArray};
       $.ajax("/form/update", {
            data: JSON.stringify(json_send),
            type: "post", contentType: "application/json",
            success: function(result) {
              //Resets the chgsArray to be fresh for new changes
              HOT.chgsArray = [];
                updateTable(collName);
            }
        });
    }
  };
  
    $("#saveChanges").click(callbackUpdate);

    $("#addRow").click(function() {
        var ht = hTableContainer.handsontable('getInstance');
        ht.alter ('insert_row');
    });
  
    $('#search_field').on('keyup', function () {
        var value = ('' + this.value).toLowerCase(), row_colValue = '', row, r_len, td, colCounter, tDataValue, ht = hTableContainer.handsontable('getInstance'), tData = ht.getData();
            if (value) {
              for (row = 0, r_len = tData.length; row < r_len; row++) {
                for (k in tData[row]){
                    colCounter = ht.propToCol(k)
                  td = hTableContainer.handsontable('getCell', row, colCounter);
                  tDataValue = tData[row][k];
                  //converts boolean to string for search
                  if (typeof tDataValue === 'boolean' && tDataValue){
                    row_colValue = 'true'
                  } else if (typeof tDataValue === 'boolean' && !tDataValue) {
                    row_colValue = 'false'
                  } else if (!tDataValue) {
                    row_colValue = ' ';
                  } else {
                    row_colValue = tDataValue.toLowerCase();
                  }
                  //Check if row col value in table contains search text
                    if(td) {
                        if (row_colValue.indexOf(value) > -1) {
                            td.className = 'pass';
                        } else {
                            td.className = '';
                        }
                        }
                  colCounter++;
                }
              }
            } else {
              //if empty string remove all pass classes so nothing it highlighted
              $( ".pass" ).removeClass( "pass" ).addClass( "" );
            }
        });
    }
$(document).ready(function () {
  var formName = $('#formID').text()
  if (formName) {
      var tData = getMyForm(formName, createTable);
  } else {
      var dObj = new dateObj();
      $("#getDates").click(dObj.generateFTable);
  }
});
