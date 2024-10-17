from playwright.sync_api import sync_playwright
import pandas as pd
from io import StringIO
import time
import requests
import json
import math


with sync_playwright() as p:
    
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
     # ข้อมูลหน้า มูลค่าซื้อขายตามกลุ่มนักลงทุน
    
    url_TradingValueGroup = 'https://www.set.or.th/th/market/statistics/investor-type'
    page.goto(url_TradingValueGroup)
    
    # ตรวจจับไว้ปิด popup
    try:
        page.wait_for_selector('#__layout > div > div.lightbox.show > div > div.d-flex.mb-2 > button > svg', timeout=60000)  # เพิ่ม timeout เป็น 60 วินาที
        page.click('#__layout > div > div.lightbox.show > div > div.d-flex.mb-2 > button > svg')
    except Exception as e:
        print("NO POP-UPS")

    
    html_source = page.content()
    html_io = StringIO(html_source)
    set_data_list = pd.read_html(html_io)   
    print("ข้อมูลจากตาราง SET:")
    print(set_data_list[0])
    
    page.click('//*[@id="__layout"]/div/div[2]/div[3]/div/div/div[1]/div[1]/button[2]')
    
    
    html_source = page.content()
    html_io = StringIO(html_source)
    mai_data_list = pd.read_html(html_io)
    print("ข้อมูลจากตาราง mai:")
    print(mai_data_list[0])
    
    
    # ข้อมูลหน้า ธุรกรรมขายชอร์ต 
    url_shortselling = 'https://www.set.or.th/th/market/statistics/short-sales/total-short-sales'
    page.goto(url_shortselling)
    
    html_source = page.content()
    html_io = StringIO(html_source)
    overview_data_list = pd.read_html(html_io)
    print("ข้อมูลการขายชอร์ต")
    print("ภาพรวมตลาด (SET และ mai)")
    print(overview_data_list[0])
    
    
    
    second_table = page.query_selector('#__layout > div > div.site-content.statistics > div.tab-content > div > div > div > div.short-sell-datatable-container.mx-auto > div.table-shortsales.mx-auto > div.table-shortsales-wrapper > div')
    if second_table:
        second_table_html = second_table.inner_html()
        shortsell_data_list = pd.read_html(second_table_html)
        print("ข้อมูลรายหลักทรัพย์:")
        print(shortsell_data_list[0])
    else:
        print("ไม่พบบล็อกของตารางที่สอง")
    
    time.sleep(5)
    
    # ข้อมูลหน้า Program Trading Value 
    url_programTradingValue = 'https://www.set.or.th/th/market/statistics/program-trading-value'
    page.goto(url_programTradingValue)
    
    page.evaluate("window.scrollBy(0, 1000)")
    time.sleep(5)
    
    
    html_source = page.content()
    html_io = StringIO(html_source)
    programTrade_data_list = pd.read_html(html_io)   
    print("ข้อมูลภาพรวมตลาด SET และ mai")
    print(programTrade_data_list[0])
    time.sleep(5)
    
    second_table = page.query_selector('#__layout > div > div.site-content.statistics > div.tab-content > div > div:nth-child(7) > div > div:nth-child(2)')
    if second_table:
        second_table_html = second_table.inner_html()
        security_data_list = pd.read_html(second_table_html)
        print("ข้อมูลรายหลักทรัพย์:")
        print(security_data_list[0])
    else:
        print("ไม่พบบล็อกของตารางที่สอง")
    

    
def convert_tuple_to_string(data):
    if isinstance(data, list):
        return [convert_tuple_to_string(item) for item in data]
    elif isinstance(data, dict):
        return {str(key): convert_tuple_to_string(value) for key, value in data.items()}
    else:
        return data

def clean_nan_values(obj):
    if isinstance(obj, list):
        return [clean_nan_values(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: clean_nan_values(value) for key, value in obj.items()}
    elif isinstance(obj, float):
        if math.isnan(obj) or obj == float('inf') or obj == float('-inf'):
            return None
    return obj

# สร้าง data_to_send
data_to_send = {
    "SET_data": set_data_list[0].to_dict(orient='records') if set_data_list else None,
    "mai_data": mai_data_list[0].to_dict(orient='records') if mai_data_list else None,
    "overview_data": overview_data_list[0].to_dict(orient='records') if overview_data_list else None,
    "short_sell_data": shortsell_data_list[0].to_dict(orient='records') if 'shortsell_data_list' in locals() else None,
    "program_trading_data": programTrade_data_list[0].to_dict(orient='records') if programTrade_data_list else None,
    "security_data": security_data_list[0].to_dict(orient='records') if 'security_data_list' in locals() else None,
}

# แปลง tuple ภายในข้อมูลให้เป็น string ทั้งหมด
clean_data_to_send = {key: convert_tuple_to_string(value) for key, value in data_to_send.items()}

# ทำความสะอาดข้อมูลที่เป็น NaN และ Infinity
clean_data_to_send = clean_nan_values(clean_data_to_send)

# พิมพ์โครงสร้างข้อมูล
print("Data to send structure:")
for key, value in clean_data_to_send.items():
    print(f"{key}: {type(value)}")  # แสดงประเภทของข้อมูล

# พิมพ์ข้อมูลที่จะส่ง
print("Data to send:")
print(clean_data_to_send)

# ลองแปลงเป็น JSON
try:
    json_data = json.dumps(clean_data_to_send, ensure_ascii=False)
    print("JSON data to send:")
    print(json_data)
except Exception as e:
    print("Error converting to JSON:", e)

# ส่งข้อมูลด้วย POST request
url = 'https://projectsrapingset.onrender.com/api/data'


response = requests.post(url, json=clean_data_to_send)

# ตรวจสอบผลลัพธ์ที่ได้รับจากเซิร์ฟเวอร์
if response.status_code == 200:
    print("ส่งข้อมูลสำเร็จ:", response.json())
else:
    print(f"ส่งข้อมูลล้มเหลว รหัสสถานะ: {response.status_code}, การตอบกลับ: {response.text}")