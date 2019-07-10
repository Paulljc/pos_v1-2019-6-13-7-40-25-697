'use strict';

function printReceipt(inputs) {
  const items = countBarcode(inputs);
  const receipts = createReceipt(items);
  console.log(receipts);
}

function countBarcode(barcode) {
  let item = {};
  barcode.forEach((value) => {
    if (value.indexOf('-') == -1) {
      if (item[value] == undefined) {
        item[value] = 1;
      } else {
        item[value]++;
      }
    } else {
      let _val = value.split('-')[0];
      let _count = Number(value.split('-')[1]);
      if (item[_val] == undefined) {
        item[_val] = _count;
      } else {
        item[_val] += _count;
      }
    }
  })
  return item;
}

function createReceipt(items) {
  let expextedMoney  = 0;
  let actualMoney  = 0;
  let receiptContent = '***<没钱赚商店>收据***\n';

  for(const barcode in items) {
    let item = findItemByBarcode(barcode);


    if(item != undefined) {
      let littleCount;
      let itemBarcode = Number(items[barcode]);
      if(isPromotionGood(barcode, 'BUY_TWO_GET_ONE_FREE')){
        littleCount = (itemBarcode - Math.floor(itemBarcode/3)) * item['price']
      }else {
        littleCount = item['price']*itemBarcode;
      }

      receiptContent += `名称：${item['name']}，数量：${itemBarcode}${item['unit']}，单价：${item['price'].toFixed(2)}(元)，小计：${littleCount.toFixed(2)}(元)\n`
      expextedMoney += item['price']*itemBarcode;
      actualMoney += littleCount;
    }
  }
  receiptContent += `----------------------
总计：${actualMoney.toFixed(2)}(元)
节省：${(expextedMoney - actualMoney).toFixed(2)}(元)
**********************`

  return receiptContent;
}

function findItemByBarcode(barcode) {
  const dataSource = loadAllItems();
  let item = dataSource.filter((value) => {
    return barcode === value['barcode']
  })[0];
  return item;
}