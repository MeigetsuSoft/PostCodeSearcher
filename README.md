# Post Code Searcher

このパッケージは、日本全国の郵便番号の検索を行うことができるパッケージです。

## 使い方

1. [郵便局のサイト](https://www.post.japanpost.jp/zipcode/download.html)から郵便番号のCSVをダウンロードする
2. CSVを任意のディレクトリに配置する。郵便番号のデータがShift-JISの場合は予めUTF-8に変換しておいて下さい
3. ```postcode -i -m <CSV path>```を実行
4. postcodesフォルダが生成され、その中にmasterというフォルダが生成されて都道府県名のJSONファイルとdata.txtが格納されているのを確認する

## 新しい郵便番号のデータが出た場合は？

郵便局からは、郵便番号の情報に変更があった場合に差分データが提供されます。

1. [郵便局のサイト](https://www.post.japanpost.jp/zipcode/download.html)からマスターデータが作られてた日以降に提供されている郵便番号差分データのCSVをダウンロードする。この時、新規追加データと廃止データの両方をダウンロードして下さい
2. CSVをUTF-8に変換し、新規追加データのCSVを```ADD.CSV```、廃止データのCSVを```DEL.CSV```にそれぞれファイル名を変更する
3. postcodesの中に```patch```という名前のフォルダを生成する
4. patchの中に任意のフォルダを生成し、その中にADD.CSVとDEL.CSVを格納する

※マスターデータの生成日は```postcode/master/data.txt```に書かれていますが、この日付はマスターデータを生成した年月日および時刻であり、マスターデータの生成の元となったCSVをダウンロードした年月日および時刻とは一致しません。

## ライセンス

[Copyright 2025 Meigetsu. All rights reserved](https://license.meigetsu.jp/?id=8AFD146A24D641948F0A956515B897E5)
