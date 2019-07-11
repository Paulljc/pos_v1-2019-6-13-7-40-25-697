'use strict';

function printReceipt(inputs) {
  const items = countGoods(inputs);
  const receipts = createReceipt(items);
  console.log(receipts);
}

function countGoods(barcode) {
  const item = {};
  barcode.forEach((value) => {
    if (value.indexOf('-') === -1) {
      if (item[value] === undefined) {
        item[value] = 1;
      } else {
        item[value]++;
      }
    } else {
      let goodInfo = value.split('-');
      let barcode = goodInfo[0];
      let count = Number(goodInfo[1]);
      if (item[barcode] === undefined) {
        item[barcode] = count;
      } else {
        item[barcode] += count;
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
      let subtotal = null;
      let itemCount = Number(items[barcode]);
      if(isPromotionGood(barcode, 'BUY_TWO_GET_ONE_FREE')){
        subtotal = (itemCount - Math.floor(itemCount / 3)) * item['price']
      }else {
        subtotal = item['price'] * itemCount;
      }

      receiptContent += `名称：${item['name']}，数量：${itemCount}${item['unit']}，单价：${item['price'].toFixed(2)}(元)，小计：${subtotal.toFixed(2)}(元)\n`
      expextedMoney += item['price'] * itemCount;
      actualMoney += subtotal;
    }else{
      receipts = '[Error]: barcode not exist';
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

function isPromotionGood(barcode, promotionType) {
  let allPromotions = loadPromotions();
  let promotionGood = null;
  let isPromotionGood = false;
  allPromotions.forEach((value) => {
    if(value['type'] === promotionType) {
      promotionGood = value['barcodes'];
    }
  });
  for(let promoGood of promotionGood) {
    if(barcode === promoGood) {
      isPromotionGood = true
    }
  }
  return isPromotionGood;
}