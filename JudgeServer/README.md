github 오픈 소스 `Judger`를 이용하여 만들었다.

[Judger](https://github.com/QingdaoU/Judger)

<br/>

#### 사용 방법

```
cd Judger
sudo apt-get install libseccomp-dev
mkdir build && cd build && cmake .. && make && sudo make install

// 를 하면 libjudger.so가 저장된 위치를 터미널에서 확인 가능

// JudgeServer 위치에서 test 디렉토리 생성 (JudgeServer/test)
mkdir test 

// test 폴더에 복사한다.
sudo cp (libjudger.so 경로) test

cd server
npm start
```
<br/>

[server .env 설정](./server/README.md)

.env 설정을 해야 동작한다. 