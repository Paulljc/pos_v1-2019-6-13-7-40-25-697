'use strict';

function printReceipt(inputs) {
  const items = countBarcode(inputs);
  const receipts = createReceipt(items);
  console.log(receipts);
}

function countBarcode(barcode) {
  let item = {};
  barcode.forEach((value) => {
    if (item[value] === undefined) {
      item[value] = 1;
    } else {
      item[value]++;
    }
  })
  return item;
}

function createReceipt(items) {
  let totalMoney = 0;
  let receiptContent = '';
  let saveGoodInfo = null;
  receiptContent += '***<没钱赚商店>收据***\n';

  for(const id in items) {
    const item;
    let isSaveGood = isSaveGood(id)
    if(isSaveGood){
      saveGoodInfo = id.split("-");
      item = findItemById(saveGoodInfo[0]);
    }else{
      item = findItemById(id);
    }

    if (item !== undefined && isSaveGood) {
      let saveMoney = item['price']
      receiptContent += "名称：" + item['name'] + "数量：" + saveGoodInfo[1] + "单价" + item['price'] + "小计：" + saveMoney  + '\n';
      totalMoney += item['price'] * saveGoodInfo[1];
    } else if(item !== undefined && !isSaveGood){
      receiptContent += "名称：" + item['name'] + "数量：" + items[id] + "单价" + item['price'] + "小计：" + item[id] * item['price'] + '\n';
      totalMoney += item['price'] * items[id];
    } else {
      receiptContent = '[ERROR]: not found item[id=' + id + '].Please input correctly.'
      return receiptContent;
    }
  }
  receiptContent += '----------------------\n';
  if(isSaveGood){
    receiptContent += '总计： ' + totalMoney.toFixed(2) + '(元)\n';
    receiptContent += '节省： ' + saveMoney.toFixed(2) + '(元)\n';
  }else{
    receiptContent += '总计： ' + totalMoney.toFixed(2) + '(元)\n';
  }
  receiptContent += '**********************';

  return receiptContent;
}

function findItemById(id) {
  let item;
  const dataSource = loadAllItems();
  dataSource.forEach((value, index) => {
    if (id == value['id']) {
      item = {'id': value['id'], 'name': value['name'],'unit': value['unit'],'price': value['price']};
    }
  })
  return item;
}

function isSaveGood(barcode) {
  const saveGoodsDB = loadPromotions();
  let newArr = barcode.split("-");
  if(newArr.length > 1){
    let isSaveGood = saveGoodsDB.forEach(value => {
      for (let i = 0; i < value.barcodes.length; i++) {
        if(value.barcodes[i] === barcode){
          return true
        }
      }
    });
    return isSaveGood;
  }else{
    return false;
  }
}
