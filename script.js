window.addEventListener('load', function(){
  var submitBtn = document.querySelector('#submitBtn');
  var taskText = document.querySelector('.taskText');
  var taskImg = document.querySelector('#taskImg');
  var teamName = document.querySelector('#teamName');
  var levelKey = document.querySelector('#keyLevel');
  var errorText = document.querySelector('.error');
  var ImInBtn = document.querySelector('#ImIn');
  var prologueDiv = document.querySelector('.prologue');
  var taskDiv = document.querySelector('.tasks');

  ImInBtn.addEventListener('click', function(){
    prologueDiv.style.display='none';
    taskDiv.style.display='block';

  })

  submitBtn.addEventListener('click', function() {

    if (teamName.value && levelKey.value) {
      var request = new XMLHttpRequest();
      request.open('POST','http://10.10.54.24:1337');
      request.onreadystatechange = function(req,res) {
        if (request.readyState == 4) {
          respBodyObj = JSON.parse(request.response);
          if (respBodyObj.error) {
            errorText.innerText = respBodyObj.error;
          } else {
            taskImg.src = respBodyObj.img ;
            taskText.innerText = respBodyObj.task;
            errorText.innerText = '';
          }
        }
        levelKey.value = '';
      }
      var reqObj = {"teamName": teamName.value.substr(0,50), "levelKey":levelKey.value.substr(0,30)}
      request.send(JSON.stringify(reqObj));
    } else {
      errorText.innerText = 'Please populate both Team Name and Level Key fields';
    }
  });
})
