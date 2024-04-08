# calendar-sync

GoogleカレンダーからGoogleカレンダーに予定をコピーするGASです．
元となる予定を記録しておき，updateされた予定のみをコピーします．

## 使い方

https://script.google.com/home/usersettings にアクセスし，`Google Apps Script API`を有効にしてから，以下の手順を行ってください． 

```sh
$ git clone
$ cd calendar-sync
$ npm install
$ npx clasp login
$ npx clasp create
$ npx clasp push
$ npx clasp open
```

GASの画面が開くので，以下の2つを設定してください．

- トリガー
  - 適当な時間間隔で実行されるように設定してください．
  - 対象となるカレンダーの更新でトリガーしてもよいでしょう．
- スクリプトプロパティ
  - "destniation": コピー先のカレンダーID
  - \[コピー元のカレンダーID\]: 以下に示すプロパティのJSON
    - "prefix": 予定のタイトルにつけるプレフィックス．省略可．
