from playwright.sync_api import sync_playwright
import pandas as pd
from io import StringIO
import time
import requests
import json


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
    

    
    data_to_send = {
    "SET_data": set_data_list[0].to_dict(),
    "mai_data": mai_data_list[0].to_dict(),
    "overview_data": overview_data_list[0].to_dict(),
    "short_sell_data": shortsell_data_list[0].to_dict() if 'shortsell_data_list' in locals() else None,
    "program_trading_data": programTrade_data_list[0].to_dict(),
    "security_data": security_data_list[0].to_dict() if 'security_data_list' in locals() else None,
}

url = 'https://projectsrapingset.onrender.com'

# ส่งข้อมูลด้วย POST request
response = requests.post(url, json=data_to_send)

# ตรวจสอบผลลัพธ์ที่ได้รับจากเซิร์ฟเวอร์
if response.status_code == 200:
    print("ส่งข้อมูลสำเร็จ:", response.json())
else:
    print("ส่งข้อมูลไม่สำเร็จ:", response.status_code, response.text)
    

    
    