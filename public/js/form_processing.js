var formLoop = function jasUtilities(b) {
   this.formElements = document.getElementById(b).elements;
   this.formObj = {};
   
   this.loopForm = function (processCallback) {
    var item = 0;
      for (item; item < this.formElements.length; item++) {
         var formInputName = this.formElements[item].name;
         var formInputValue = this.formElements[item].value;
         var formInputType = this.formElements[item].type;
         
         switch(formInputType) {
         case 'radio':
            this.formObj[formInputName] = this.formElements[item].checked;
            break;
        case 'button':
            break;
        default:
            this.formObj[formInputName] = formInputValue;
      }
    }
    processCallback(this.formObj, b);
   };
};
$("#form_process").click(function(){
   form_process();
});
function processMyForm(jsonData, formName) {
   var json_send = {cName: formName, iDetails:jsonData};
   $.ajax("/form/save/", {
        data: JSON.stringify(json_send),
        type: "post", contentType: "application/json",
        success: function(result) { console.log(result) }
    });
}
function form_process() {
  var a, formName = $('form')[0].getAttribute("id");
  a = new formLoop(formName);
  a.loopForm(processMyForm);
}