# SildeShow-React
利用Create React App + less + TS製作的簡單幻燈片練習

4/16-bug
前三張如果刪除再新增圖片的話，第一次不會觸發css入場效果(前三張不會因setCurrentIndex而re-render)
箭頭移動會重新render導致最後一張出不來
