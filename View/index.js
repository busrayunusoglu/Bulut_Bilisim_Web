const imageForm = document.querySelector("#imageForm");
const imageInput = document.querySelector("#imageInput");
const imageArea = document.querySelector("#aws-load-img");

//yüklenen fotoğrafı s3 içerisinden alır ve görüntüler 
imageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = imageInput.files[0];

  // aws server'da olan güvenli url almak için
  const { url } = await fetch("/s3Url").then((res) => res.json());
  console.log(url);

  // image doğrudan s3 bucket gönderilir post işlemi için
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  });

  const imageUrl = url.split("?")[0];
  console.log(imageUrl);

  // post verileri depolamak için - server post işlemi için
  console.log(imageUrl);

  imageArea.src = imageUrl;
});
