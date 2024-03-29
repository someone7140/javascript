namespace CalendarSettingModule {
  // カレンダーの初期プルダウンを設定
  export const setCalendarSelectPulldown = () => {
    const sheet = SheetUtilModule.getSettingSheet();
    if (sheet) {
      // カレンダーの区分選択プルダウンを作成
      const calendarCategoryRule = SpreadsheetApp.newDataValidation()
        .requireValueInList([
          ConstantsModule.CALENDAR_SELECT_DEFAULT,
          ConstantsModule.CALENDAR_SELECT_ID_INPUT,
        ])
        .build();
      const calendarCategoryCell: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
        ConstantsModule.CALENDAR_SELECT_POS.row,
        ConstantsModule.CALENDAR_SELECT_POS.column,
      );
      calendarCategoryCell.setDataValidation(calendarCategoryRule);
    }
  };

  // カレンダーのID入力区分変更
  export const onChangeCalendarCategory = (e: any, inputValue: string) => {
    const sheet = e.source.getActiveSheet();
    // 選択内容によって出しわけするセル
    const headerCell: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
      ConstantsModule.CALENDAR_ID_POS.row - 1,
      ConstantsModule.CALENDAR_ID_POS.column,
    );
    const valueCell: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
      ConstantsModule.CALENDAR_ID_POS.row,
      ConstantsModule.CALENDAR_ID_POS.column,
    );
    // デフォルトの場合はID入力を空白
    if (inputValue === ConstantsModule.CALENDAR_SELECT_DEFAULT) {
      SheetUtilModule.clearInputCell(headerCell, valueCell);
      return;
    }
    // ID指定の場合は入力欄を作成
    if (inputValue === ConstantsModule.CALENDAR_SELECT_ID_INPUT) {
      headerCell.setValue('カレンダーID');
      headerCell.setBackground(ConstantsModule.COLOR_TABLE_HEADER);
      headerCell.setBorder(true, true, true, true, false, false);
      valueCell.setValue(null);
      valueCell.setBackground('white');
      valueCell.setBorder(true, true, true, true, false, false);
      return;
    }
  };

  // カレンダー設定の入力チェック
  export const validateCalendarInput = (): string | undefined => {
    const sheet = SheetUtilModule.getSettingSheet();
    if (!sheet) {
      return 'シートの設定に誤りがあります。';
    }
    const selectCell: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
      ConstantsModule.CALENDAR_SELECT_POS.row,
      ConstantsModule.CALENDAR_SELECT_POS.column,
    );
    if (selectCell.getValue() == ConstantsModule.CALENDAR_SELECT_DEFAULT) {
      return undefined;
    } else if (selectCell.getValue() == ConstantsModule.CALENDAR_SELECT_ID_INPUT) {
      const idCell: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
        ConstantsModule.CALENDAR_ID_POS.row,
        ConstantsModule.CALENDAR_ID_POS.column,
      );
      if (!idCell.getValue()) {
        return 'カレンダーIDを入力してください。';
      }
      return undefined;
    }

    return 'カレンダー設定の区分を選択してください。';
  };
}
