<?php
require_once '../config/cors.php';
header("Content-Type: application/json; charset=utf-8");

// Khởi tạo dữ liệu mặc định (fallback nếu lỗi)
$data = [
    'stocks' => [
        [ 'name' => 'VN-Index', 'val' => '1,312.45', 'pct' => '+1.17%', 'up' => true, 'flat' => false ],
        [ 'name' => 'HNX-Index', 'val' => '231.18', 'pct' => '+1.07%', 'up' => true, 'flat' => false ],
        [ 'name' => 'UPCOM', 'val' => '98.67', 'pct' => '-0.34%', 'up' => false, 'flat' => false ],
        [ 'name' => 'VN30', 'val' => '1,398.72', 'pct' => '0.00%', 'up' => false, 'flat' => true ],
    ],
    'fx' => [
        [ 'currency' => 'USD', 'buy' => '25,110', 'sell' => '25,450' ],
        [ 'currency' => 'EUR', 'buy' => '27,320', 'sell' => '28,540' ],
        [ 'currency' => 'JPY', 'buy' => '162.50', 'sell' => '170.30' ],
        [ 'currency' => 'GBP', 'buy' => '31,800', 'sell' => '33,100' ],
        [ 'currency' => 'CNY', 'buy' => '3,410', 'sell' => '3,580' ],
    ],
    'gold' => [
        [ 'type' => 'Vàng SJC (lượng)', 'buy' => '120,500', 'sell' => '122,500' ],
        [ 'type' => 'Vàng nhẫn 9999', 'buy' => '103,800', 'sell' => '105,300' ],
    ]
];

// Hàm format số có dấu phẩy
function formatNumber($num) {
    return number_format((float)$num, 0, '.', ',');
}

// 1. Cập nhật Tỷ giá từ Vietcombank XML
try {
    $vcbXml = @file_get_contents('https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx');
    if ($vcbXml) {
        $xml = simplexml_load_string($vcbXml);
        if ($xml) {
            $fxData = [];
            $targetCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];
            foreach ($xml->Exrate as $exrate) {
                $code = (string)$exrate['CurrencyCode'];
                if (in_array($code, $targetCurrencies)) {
                    $fxData[] = [
                        'currency' => $code,
                        'buy' => formatNumber(str_replace(',', '', (string)$exrate['Buy'])),
                        'sell' => formatNumber(str_replace(',', '', (string)$exrate['Sell']))
                    ];
                }
            }
            if (count($fxData) > 0) {
                $data['fx'] = $fxData;
            }
        }
    }
} catch (Exception $e) {
    // Giữ nguyên fallback
}

// 2. Cập nhật Giá vàng từ SJC XML
try {
    $sjcXml = @file_get_contents('https://sjc.com.vn/xml/tygiavang.xml');
    if ($sjcXml) {
        $xml = simplexml_load_string($sjcXml);
        if ($xml && isset($xml->ratelist->city[0])) {
            $hcm = $xml->ratelist->city[0];
            $goldData = [];
            foreach ($hcm->item as $item) {
                $type = (string)$item['type'];
                if (strpos(strtolower($type), 'SJC') !== false && count($goldData) == 0) {
                    $goldData[] = [
                        'type' => 'Vàng SJC (lượng)',
                        'buy' => formatNumber((float)$item['buy'] * 10), // XML SJC lưu giá 1 chỉ, nhân 10 để ra lượng
                        'sell' => formatNumber((float)$item['sell'] * 10)
                    ];
                }
                if (strpos(strtolower($type), 'Nhẫn') !== false && count($goldData) == 1) {
                    $goldData[] = [
                        'type' => 'Vàng nhẫn 9999',
                        'buy' => formatNumber((float)$item['buy'] * 10),
                        'sell' => formatNumber((float)$item['sell'] * 10)
                    ];
                }
            }
            if (count($goldData) > 0) {
                $data['gold'] = $goldData;
            }
        }
    }
} catch (Exception $e) {
    // Giữ nguyên fallback
}

// 3. Giả lập Chứng khoán thay đổi theo thời gian thực
foreach ($data['stocks'] as &$stock) {
    $currentVal = (float)str_replace(',', '', $stock['val']);
    $change = rand(-500, 500) / 100; // -5.00 to +5.00
    
    $newVal = $currentVal + $change;
    $pctChange = ($change / $currentVal) * 100;
    
    $stock['val'] = number_format($newVal, 2, '.', ',');
    
    $pctString = number_format(abs($pctChange), 2, '.', '') . '%';
    if ($change > 0) {
        $stock['pct'] = '+' . $pctString;
        $stock['up'] = true;
        $stock['flat'] = false;
    } elseif ($change < 0) {
        $stock['pct'] = '-' . $pctString;
        $stock['up'] = false;
        $stock['flat'] = false;
    } else {
        $stock['pct'] = '0.00%';
        $stock['up'] = false;
        $stock['flat'] = true;
    }
}

echo json_encode($data);
