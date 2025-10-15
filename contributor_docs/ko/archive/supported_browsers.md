#### 이 페이지는 최신이 아닙니다. 업데이트를 도와주세요! 아래 명시된 목표를 확인하세요.

# 지원되는 브라우저

## 명시된 목표:

브라우저의 현재 버전과 브라우저의 이전 메이저 릴리즈를 지원합니다. 예외: 인터넷 익스플로러, 2013년 이후 새로운 주요 릴리스가 없어서, 가장 최신 주요 릴리스 (v.11)만 지원합니다. 사파리, 2015년 이후 새로운 주요 릴리즈가 없어, 가장 최신 주요 릴리스 (v.11)만 지원합니다.

## 잠재적인 이슈:

* IE10, 파이어폭스, 안드로이드 브라우저에서 지원이 제한된 webGL을 사용합니다.
* IE 10 및 IE Mobile 10/11에서 Uint8ClampedArray를 지원하지 않는 타입이 지정된 배열을 사용하고 있습니다.
* IE에서  Canvas blend 모드를 지원하지 않습니다.
* webAudio는 IE 또는 Android 브라우저에서 지원되지 않습니다.

2018년 9월을 기준으로 다음을 지원합니다:

|Browser            |  Current Version  | Previous Version|  Notes                    
|-------------------|------------------:|----------------:|--------------
|Internet Explorer  |             v. 11 |  Not supported  | No support for WebAudio
|Microsoft Edge     |             v. 42 |  v. 41          |
|Chrome             |             v. 68 |  v. 67          |
|Chrome for Android |             v. 68 |  v. 67          |
|Firefox            |             v. 61 |  v. 60          | 
|Safari             |             v. 11 |  Not supported  |
|iOS Safari         |           v. 11.4 |  v. 11.2        |
|Opera              |             v. 54 |  v. 53          |


여러 브라우저에서 알려진 모든 이슈를 나열했지만 브라우저에서 지원되는 기능 전체 목록을 보려면 [caniuse.com](http://caniuse.com)를 방문해 특정 기능 (예 : [WebGL](http://caniuse.com/#search=webgl)
)을 검색하세요.