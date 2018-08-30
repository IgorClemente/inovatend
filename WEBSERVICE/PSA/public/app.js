function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
    //    document.getElementById("demo").innerHTML = this.responseText;
    console.log(this.responseText);
      }
    };
    xhttp.open("GET", "http://ec2-34-201-112-184.compute-1.amazonaws.com:9000/questions", true);
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send();
  }

  loadDoc();