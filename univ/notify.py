import time
import requests
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.chrome.options import Options

def start_chrome():
    # chromedriverのPATHを指定（Pythonファイルと同じフォルダの場合）
    driver_path = #ここにchromedriverのファイルパスを書いてください

    # Chrome起動
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options, executable_path=driver_path)
    # driver.maximize_window() # 画面サイズ最大化

    return driver

def login_google(driver):
    
    # Googleログイン
    url = 'https://service.cloud.teu.ac.jp/inside2/hachiouji/hachioji_common/cancel/'
    selecter = {"class":"search_result"}
    
    driver.get(url)

    #ログイン情報
    login_id = #ここに東京工科大生用のGoogleアカウント名を書いてください
    login_pw = #ここにパスワードを書いてください。

    #最大待機時間（秒）
    wait_time = 10

    ### IDを入力
    login_id_xpath = '//*[@id="identifierNext"]'
    # xpathの要素が見つかるまで待機します。
    WebDriverWait(driver, wait_time).until(EC.presence_of_element_located((By.XPATH, login_id_xpath)))
    driver.find_element_by_name("identifier").send_keys(login_id)
    driver.find_element_by_xpath(login_id_xpath).click()
    time.sleep(2)
    
    ### パスワードを入力
    login_pw_xpath = '//*[@id="passwordNext"]'
    # xpathの要素が見つかるまで待機します。
    WebDriverWait(driver, wait_time).until(EC.presence_of_element_located((By.XPATH, login_pw_xpath)))
    driver.find_element_by_name("password").send_keys(login_pw)
    time.sleep(1) # クリックされずに処理が終わるのを防ぐために追加。
    driver.find_element_by_xpath(login_pw_xpath).click()
    time.sleep(2)
        
    data = ""
    file = []
    
    try:
        data = driver.find_elements_by_class_name("searchTable")
    except:
        data = "None"
        
    for i in range(len(data)):
        message = data[i].text
        if((message.find('3年次') > 0) and (message.find('コンピュータサイエンス') > 0)):　#CS3年以外はこのif文は消してください
            file.append((data[i].text + '\n'))
        else:
            message = ""
    
    #次ページへ
    for i in range(2, 10):
        data = ""
        try:
            driver.get(url + 'page' + str(i) + '/')
            time.sleep(2)
            data = driver.find_elements_by_class_name("searchTable")
            if(len(data) < 1):
                break
                
        except:
            data = ""
            break
        
        for j in range(len(data)):
            message = data[j].text
            if((message.find('3年次') > 0) and (message.find('コンピュータサイエンス') > 0)): #CS3年以外は消してください
                file.append((data[j].text + '\n'))
            else:
                message = ""
              
    time.sleep(1)
    
    # ファイル書き込み（新データ）
    with open("new.txt", mode='w') as f:
        f.writelines(file)
    
    # ファイル読み込み（元データ）
    base = []
    try:
        with open("base.txt") as f1:
            data1 = f1.readlines()
    except:
            data1 = []
   
    for i in range(0, len(data1), 6):
        tmp = ""
        for j in range(i, i+6, 1):
            tmp += data1[j]
        base.append(tmp)
    
    time.sleep(1)
        
    # ファイル読み込み（新データ）
    new = []
    with open("new.txt") as f2:
        data2 = f2.readlines()
    
    for i in range(0, len(data2), 6):
        tmp = ""
        for j in range(i, i+6, 1):
            tmp += data2[j]
        new.append(tmp)

    # ファイル比較(一致:1, 新データ:0)
    check = [0] * len(new)
    for i in range(len(new)):
        for j in range(len(base)):
            if new[i] == base[j] :
                check[i] = 1
                break

    # 新しい情報を通知(LINE)
    #print(check) #チェック用
    lurl = "https://notify-api.line.me/api/notify"
    token = #ここにLINEのトークンを書いてください
    headers = {"Authorization" : "Bearer "+ token}
    
    for i in range(len(check)):
        if check[i] == 0:
            message = "\n"
            message += new[i]
            payload = {"message" :  message}
            line_notify = requests.post(lurl, data = payload, headers = headers)
        
    time.sleep(1)
    
    
    # ファイル書き込み（新データを元データとする）
    with open("base.txt", mode='w') as fw:
        fw.writelines(new)
        
    time.sleep(1)
    
    # 終了
    driver.quit()
    
if __name__ == '__main__':
    
    # Chromeを起動
    driver = start_chrome()

    # Googleにログイン&取得
    login_google(driver)