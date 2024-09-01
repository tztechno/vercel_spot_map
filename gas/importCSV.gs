function importCSVtoSheet() {
  // スプレッドシートの ID を指定
  const spreadsheetId = '1A7poGLhbVwz6uyqNW3YHcsDohHNqdIYDip1h81A4CEQ'; // スプレッドシートの ID に置き換えてください
  const sheetName = 'spot'; // スプレッドシートのシート名を指定
  const folderId = '1gK10WQ8emV0pCV96_hilJtNFqSyHion5'; // Google Drive フォルダの ID に置き換えてください

  // スプレッドシートとシートを取得
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

  // シートの内容をクリア
  sheet.clear();

  // ヘッダーを設定
  sheet.appendRow(['POINT', 'name']);

  // 指定フォルダから CSV ファイルを取得
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByType(MimeType.CSV);

  // ファイルごとに処理
  while (files.hasNext()) {
    const file = files.next();
    const csvData = Utilities.parseCsv(file.getBlob().getDataAsString());

    // CSV データを処理
    csvData.forEach((row, index) => {
      if (index === 0) return; // 1行目がヘッダーの場合はスキップ

      const [name, latitude, longitude] = row;
      const point = `POINT(${longitude} ${latitude})`; // POINT データ形式に変換

      // シートに書き込み
      sheet.appendRow([point, name]);
    });
  }

  Logger.log('CSV import completed.');
}
