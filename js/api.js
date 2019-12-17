const base_url = "https://api.football-data.org/v2/";
const api_key = '6df32f3d034442d38a32a504f4692faf';
const fetchApi = function(url) {    
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_key
    }
  });
};
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function setFavorite(favorite, id, name, image) {
  var dbPromise = idb.open("dbsoccer", 1, function(upgradeDb) {
		if (!upgradeDb.objectStoreNames.contains("klub")) {
			var klub=upgradeDb.createObjectStore("klub",{keypath:"id"});
			klub.createIndex("id","id",{unique:true});
		  }
  });
  
  dbPromise.then(function(db) {
		 
		if(favorite==false){
			var tx = db.transaction('klub', 'readwrite');
			var store = tx.objectStore('klub');
			var item = {
				id: id,
				name: name,
				image: image
			};
      store.put(item, id); 
      M.toast({html: 'Club '+name+' telah disukai'});
			return tx.complete;
		} else {
			dbPromise.then(function(db) {
			  var tx = db.transaction('klub', 'readwrite');
			  var store = tx.objectStore('klub');
        store.delete(id);
        M.toast({html: 'Club '+name+' batal disukai'});
			  return tx.complete;
			}).then(function() {
        console.log('Klub Favorite dihapus');
        var fav_btn = document.getElementById('fav_btn');
        fav_btn.innerHTML = 'favorite_border';
        fav_btn.parentNode.parentNode.setAttribute("onclick", "setFavorite(false, '"+id+"', '"+name+"', '"+image+"')");
			});
			
		}
	}).then(function() {
    console.log('Klub Favorite disimpan.');
    var fav_btn = document.getElementById('fav_btn');
    fav_btn.innerHTML= 'favorite';
    fav_btn.parentNode.parentNode.setAttribute("onclick", "setFavorite(true, '"+id+"', '"+name+"', '"+image+"')");
	}).catch(function() {
		console.log('Klub Favorite gagal disimpan.')
	});
}
// Blok kode untuk melakukan request data json
function getClub() {

  if ('caches' in window) {
    caches.match(base_url + "competitions/2021/standings").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var clubHTML = "";
          data.standings[0].table.forEach(function(club) {
            clubHTML += getClubCard(
              club.team.id, 
              club.team.crestUrl.replace(/^http:\/\//i, 'https://'),
              club.team.name,
              club.playedGames,
              club.won,
              club.lost);
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("clubs").innerHTML = clubHTML;
        })
      }
    });
  }
  
  fetchApi(base_url + "competitions/2021/standings").then(status).then(json).then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      var clubHTML = "";
      data.standings[0].table.forEach(function(club) {
        clubHTML += getClubCard(
          club.team.id, 
          club.team.crestUrl.replace(/^http:\/\//i, 'https://'),
          club.team.name,
          club.playedGames,
          club.won,
          club.lost);
        });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("clubs").innerHTML = clubHTML;
    })
    .catch(error);
}

function getFavorite(){
	var dbPromise = idb.open("dbsoccer", 1, function(upgradeDb) {
		if (!upgradeDb.objectStoreNames.contains("klub")) {
			var klub=upgradeDb.createObjectStore("klub",{keypath:'id'});
			klub.createIndex("id","id",{unique:true});
		  }
		});
	dbPromise.then(function(db) {
		  var tx = db.transaction('klub', 'readonly');
		  var store = tx.objectStore('klub');
		  return store.getAll(); 
		}).then(function(val) {
		
		if(val!=null){
      var clubHTML = "";
      val.forEach(function(data) {
        clubHTML += getClubCard(
          data.id,
          data.image.replace(/^http:\/\//i, 'https://'),
          data.name);
      });
		}
		
		// Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("clubs").innerHTML = clubHTML;

	  });
}

function getArticleById() {
  
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  var favorite = false;

  if ("caches" in window) {
    caches.match(base_url + "teams/" + idParam).then(function(response) {
      console.log("masuk caches");
      if (response) {
        response.json().then(function (data) {
          var dbPromise = idb.open("dbsoccer", 1, function(upgradeDb) {
            if (!upgradeDb.objectStoreNames.contains("klub")) {
              var klub=upgradeDb.createObjectStore("klub",{keypath:"id"});
              klub.createIndex("id","id",{unique:true});
            }
          });

          var id_fav=`${data.id}`;
          dbPromise.then(function(db) {
            var tx = db.transaction('klub', 'readonly');
            var store = tx.objectStore('klub');
            return store.get(id_fav); 
          }).then(function(val) {
            
            if(val!=null){
              if(val.id==id_fav)
                favorite=true;
              else
                favorite=false;
            }else{
              favorite=false;
            }
            var clubHTML = getClubDetail(data, favorite);
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("body-content").innerHTML = clubHTML;
          });
        })
      }
    })
  }

  fetchApi(base_url + "teams/" + idParam).then(status).then(json).then(function(data) {
    console.log("masuk fetch");
    

    var dbPromise = idb.open("dbsoccer", 1, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains("klub")) {
        var klub=upgradeDb.createObjectStore("klub",{keypath:"id"});
        klub.createIndex("id","id",{unique:true});
      }
    });

    var id_fav=`${data.id}`;
      
      dbPromise.then(function(db) {
        var tx = db.transaction('klub', 'readonly');
        var store = tx.objectStore('klub');
        return store.get(id_fav); 
      }).then(function(val) {
        if(val!=null){
          if(val.id==id_fav)
            favorite=true;
          else
            favorite=false;
        }else{
          favorite=false;
        }
        // Objek JavaScript dari response.json() masuk lewat variabel data.
      // Menyusun komponen card artikel secara dinamis
      var clubHTML = getClubDetail(data, favorite);
      
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = clubHTML;
  
      });
    });
}

function getClubCard(id, imageSrc, name, played, won, lost) {
  var cardTag = `
  <div class="col s12 m12 l6">
    <div class="card horizontal">
      <div class="card-image">
        <img class="img-resize" src="${imageSrc}">
      </div>
      <div class="card-stacked">
        <div class="card-content">
          <p><b>${name}</b></p>`;
          if (played && won && lost) {
            cardTag += `<p>Games:${played} - Win:${won} - Lost:${lost}</p>`;
          }
        cardTag += `</div>
        <div class="card-action">
        <a href="./detail.html?id=${id}"">Detail</a>
        </div>
      </div>
    </div>
  </div>
  `;
  return cardTag;
}

function getClubDetail(data, favorite) {
  var htmlTag = `
  <div class="section"> 
    <div class="row">
      <div class="col l12">
        <article class="post-2369 post type-post status-publish format-standard has-post-thumbnail hentry category-verdun" id="post-2369">
          <div class="row">
            <div class="col l8 s12">
              <h2 id="team-name">${data.name}</h2>
              <img id="team-img" width="800" height="600" src="${data.crestUrl}" class="single-photo responsive-img z-depth-3 wp-post-image" alt="" sizes="(max-width: 800px) 100vw, 800px">
            </div>
            <div class="col l4 s12">
              <div class="card-panel alcaramel" style="min-height: 640px;">
                <h6>DETAILS</h6>
                <hr>
                <span class="detail-title"><i class="mdi-communication-location-on"></i>Address</span>
                <span class="">${data.address}</span>
                <hr>
                <span class="detail-title"><i class="mdi-action-store"></i>Email</span>
                <span class="">${data.email}</span>
                <hr>
                <span class="detail-title"><i class="mdi-action-store"></i>Website</span>
                <span class="">${data.website}</span>
                <hr>
                <span class="detail-title"><i class="mdi-action-store"></i>Phone</span>
                <span class="">${data.phone}</span>
                <hr>
                <span class="detail-title"><i class="mdi-device-access-time"></i> Squad</span>
                <ul class="opening-hours">`;
                data.squad.forEach(function(squad) {
                  htmlTag += `<li>${squad.name}: ${squad.role} - ${squad.position}</li>`;
                });
                htmlTag += `</ul>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
  <div class="fixed-action-btn" onclick="setFavorite(${favorite}, '${data.id}','${data.name}','${data.crestUrl}')">
    <a class="btn-floating btn-large red">
      <i class="large material-icons" id="fav_btn">`;
      if (favorite) {
        htmlTag += `favorite`;
      } else {
        htmlTag += `favorite_border`;
      }
      htmlTag += `</i>
    </a>  
  </div>
  `;
  return htmlTag;
}