var image_links = ["photo/lg-1.jpg", "photo/lg-2.jpg", "photo/lg-3.jpg", "photo/lg-4.jpg", "photo/lg-5.jpg"];

document.getElementById("search").onclick = function() {display_image(image_links)};

function display_image(image_links) {
  var i = 0;
  for (i = 0; i < 5; i++) {
    show_image(image_links[i], 300,400, "Google Logo");
  }
}

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.getElementById("output_image").appendChild(img);
}