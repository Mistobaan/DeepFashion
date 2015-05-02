

document.getElementById("search").onclick = function() {display_image()};

function display_image() {
  var image_links = ["photo/lg-1.jpg", "photo/lg-2.jpg", "photo/lg-3.jpg", "photo/lg-4.jpg", "photo/lg-5.jpg"];
  var i = 0;
  // for (i = 0; i < 5; i++) {
  //   show_image(image_links[i], 120,160, "Google Logo");
  // }
  d3.select("body").selectAll("p")
    .data(image_links)
    .enter()
    .append("p")
    .text("New");
    // .show_image(image_links[i], 120, 160, "photo");
}

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.body.appendChild(img);
}