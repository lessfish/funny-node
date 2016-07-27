<?php
// 公钥放在客户端。公钥和私钥一定要配对，且必须保证私钥的安全
$public_key = '-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEvqKN8KZnilJHgWbs0cBGxomkCh
aC5EXlObFBXxLg5/bmtZCHA2Pz+7kQrUYKzmk5Qvvk7N/cwe9Oa93H2W2hlAQV39
hABs0PzR+by8Ruf3FqHJozaFHMe240HsvKYE1jhDMTVp5xoT70fqnJxFBA0tRPhH
KIcS01l77McG0XNHAgMBAAE=
-----END PUBLIC KEY-----';


// 私钥放在服务端，用以验证和解密客户端经过公钥加密后的信息
$private_key = '-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgEvqKN8KZnilJHgWbs0cBGxomkChaC5EXlObFBXxLg5/bmtZCHA2
Pz+7kQrUYKzmk5Qvvk7N/cwe9Oa93H2W2hlAQV39hABs0PzR+by8Ruf3FqHJozaF
HMe240HsvKYE1jhDMTVp5xoT70fqnJxFBA0tRPhHKIcS01l77McG0XNHAgMBAAEC
gYBImlwYZEP4YkhsqVeyxnbcj3XnFfcjOLPV1dzx10WrC+i4td/CIb9/3o0rBE6p
TaQa90ZU6+Es1PZ3r2Euo5VVwkYZkOxc7rY6XtFQYnfKibuDeaKAm2aDcEyRYZH/
5MzPGOpinpXqHQaK8JCp3002tdrhTnuz0mgK6y2UL3OgQQJBAI8NIwY7D+AC1akZ
p+yfFhwWuSPEMPCL34Fr18IzEx6Mg0bxh577lwA90XA0BTnNgms/72jvIyEULaCn
3ffD/lcCQQCH2r4UAajsEo/MAZnS1Rx8qrhj+V1ve8uuKNUxPxfurKF6wpObnu1h
ieCTzHFepvn4ihtU/lRGt+/DJy3FHjyRAkAVcGSVZHimnAYlh8DRB66qmwU4RQkI
pA3lOaJman0tEOYD1eL7gr1IvfsLk+BMn24yYKyiz2Q2au3DrCTqIyeVAkBEbP+J
8iAT73Fv7mp8z4wOmqpO6H2QNkkrijN/H2k9dMPMog5Ytp6Xnyt3JeUAKJgFAAKu
N39ZMzHXGHesLgORAkAB11qp2pjhrpFTinPwrW63urpcq3u/sJfeFPDkot40k3hy
BSOkEe0crEoHqd8QKsXESIgcF+YQT6uJSeb9e8uR
-----END RSA PRIVATE KEY-----';


/**
 * 使用 PHP OpenSSL 时，最好先看看手册，了解如何开启 OpenSSL 和其中的一些方法的使用
 *  具体如何使用这里不做赘述，大家去看看 PHP 手册，什么都就解决了
 */
$pi_key = openssl_pkey_get_private($private_key); // 这个函数可用来判断私钥是否是可用的，可用返回资源 Resource id
$pu_key = openssl_pkey_get_public($public_key); // 这个函数可用来判断公钥是否是可用的

$decrypted = "";
openssl_private_decrypt(base64_decode($_POST['name']), $decrypted, $pi_key); // 私钥解密

// $decrypted 就是解密后的数据
echo json_encode($decrypted);
?>