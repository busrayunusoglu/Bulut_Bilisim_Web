import dotenv from "dotenv";
import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

//s3 bağlantısı için tanımlar
dotenv.config();
const region = "us-west-2";
const bucketName = "my-project-s3-bucket-bb";
const accessKeyId = "AKIAUHAEJQTEY22GXCO3";
const secretAccessKey = "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";

// s3 bucket bağlantısı sağlamak için
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

// yüklenen dosya kayıt işlemleri için
export async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  //kaydedilen dosyanın kayıt yeri ve isimlendirmesi
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  //kaydedilen dosya url ve hash bilgisi tamamlandığında terminale bilgiyi yazdırıyoruz
  console.log("Yükleme tamamlandı!");
  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  console.log(params.Key);
  console.log(uploadURL);
  return uploadURL;
}
