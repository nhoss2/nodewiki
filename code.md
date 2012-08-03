    import json

    crawlData_file = open('/home/nafis/node/HN/crawl_data.json', 'r')
    crawlData = crawlData_file.read()
    crawlData_file.close()

    daily = json.loads(crawlData)
    uniqueData = []

    for data in daily:
      day = data['data']
      day.reverse()
      unique = []

      while len(day) > 0:
        if day[0]['text'] != '':
          unique.append(day[0])
        day.pop(0)

        i = 0
        for article in day:
          if article['text'] != '' and article['link'] == unique[-1]['link']:
            day.pop(i)
          i += 1

      uniqueData.append({'day': data['day'], 'month': data['month'], 'data': unique})

    writeFile = open('/home/nafis/node/HN/crawl_data_unique_daily.json', 'w')
    writeData = json.dumps(uniqueData)
    writeFile.write(writeData)
    writeFile.close()

