var namesContent = null;


function refreshNames() {
  var client = new XMLHttpRequest();
  client.open('GET', '/names.json');
  client.onreadystatechange = function() {
    namesContent = JSON.parse(client.responseText);
  }
  client.send();
}

var charMap = {
  Ç: 'C',
  Ö: 'O',
  Ş: 'S',
  İ: 'I',
  I: 'i',
  Ü: 'U',
  Ğ: 'G',
  ç: 'c',
  ö: 'o',
  ş: 's',
  ı: 'i',
  ü: 'u',
  ğ: 'g'
};

function trToEng(txt) {
  return txt.split("").map(x => {
    return charMap[x] ?? x;
  }).join("")
}

function univStr(t) {
  return trToEng(t).toLowerCase()
}

function checkRow(r, i) {
  return univStr(r[1]).split(" ").includes(univStr(i));
}

function capFirstLetter(string) {
  return string.charAt(0).toLocaleUpperCase("tr-TR") + string.slice(1).toLocaleLowerCase("tr-TR");
}

function capWords(txt) {
  return txt.split(" ").map(capFirstLetter).join(" ");
}

function query(name) {
  if (!namesContent) {
    alert("Sorgu yapılırken bir hata oluştu. Sorunun devam etmesi durumunda daha sonra tekrar deneyiniz.")
    return refreshNames();
  }
  let ns = name.split(" ");
  let res = [];
  for (let i = 0; i < namesContent.length; i++) {
    let row = namesContent[i];
    if (ns.map(x => checkRow(row, x)).reduce((a, b) => a && b)) {
      // if (checkRow(row, name)) {
      let name = capWords(row[1]);
      let dist = row[2] ? capWords(row[2]) : null;
      let jj = (dist ? (dist + " - ") : "") + name;
      if (res.indexOf(jj) == -1) res.push(jj)
      // res.push(row)


    }
  }

  displayRes(res);
}


function displayRes(res) {
  let html = "";
  if (res.length == 0) {
    html = '<div class="text-md my-2">Kişi bulunamadı</div>'
  } else {
    for (let i = 0; i < res.length; i++) {
      r = res[i];
      // html += (i == 0 ? "" : "<hr>") + '<div class="text-md my-2">' + (r[2] ? (r[2] + " - ") : "") + r[1] + '</div>'
      html += (i == 0 ? "" : "<hr>") + '<div class="text-md my-2">' + r + '</div>'

    }
  }
  document.getElementById("results").innerHTML = html;
}

document.getElementById("querybtn").onclick = () => {
  query(document.getElementById("nameinp").value);
}

function keyDown(e) {
  if (e.key == "Enter") {
    document.getElementById("querybtn").click();
  }
}

refreshNames();
